import type { User } from "~/types/permissions";
import type { AxiosRequestConfig } from "axios";
import { useState } from "#app";
import { computed } from "vue";
import { useApiClient } from '~/services/apiClient';
import { usePendingLogout } from '~/composables/usePendingLogout';

// The auth bootstrap plugin and protected-route middleware can call useUser()
// during the same hydration cycle. Keep one request per Nuxt runtime so they
// cannot race each other and invalidate a valid session.
let clientUserRequest: Promise<boolean> | null = null;

export const useUser = () => {
  const { isPending: isLogoutPending } = usePendingLogout();
  const user = useState<User | null>("user", () => null);
  const isUserLoading = useState<boolean>("user-loading", () => true);
  const hasResolvedUser = useState<boolean>("user-resolved", () => false);
  // A temporary auth API/network failure is different from an invalid
  // session. Keep this state so route middleware does not log the user out
  // merely because /auth/me was temporarily unavailable.
  const authUnavailable = useState<boolean>("user-auth-unavailable", () => false);
  const requestVersion = useState<number>("user-request-version", () => 0);
  // Server-side requests must remain local to this composable invocation so
  // one SSR request can never share a user/profile Promise with another.
  let serverUserRequest: Promise<boolean> | null = null;
  const normalizeUser = (data: User & { id?: string; _id?: string }): User => {
    const rawId = data?.userId || data?.id || data?._id || "";
    return {
      ...data,
      userId: rawId ? String(rawId) : "",
    };
  };

  const setUser = (data: User) => {
    user.value = data;
    authUnavailable.value = false;
    isUserLoading.value = false;
    hasResolvedUser.value = true;
  };

  const clearUser = () => {
    requestVersion.value += 1;
    user.value = null;
    authUnavailable.value = false;
    isUserLoading.value = false;
    hasResolvedUser.value = true;
  };

  const fetchUser = async (force = false, accessToken?: string): Promise<boolean> => {
    // A failed logout has an outstanding server-side revocation. Do not let
    // route middleware refresh the HttpOnly cookie before that retry succeeds.
    if (isLogoutPending.value) {
      clearUser();
      return false;
    }

    if (!force && user.value) {
      isUserLoading.value = false;
      hasResolvedUser.value = true;
      return true;
    }

    // Do not immediately repeat a failed auth bootstrap from every route
    // middleware/page in the same outage window. A forced call (login or an
    // explicit retry) can still attempt the request again.
    if (!force && authUnavailable.value) return false;

    const activeRequest = process.client ? clientUserRequest : serverUserRequest;
    if (!force && activeRequest) return activeRequest;

    const request = (async () => {
      isUserLoading.value = true;
      authUnavailable.value = false;
      const currentRequest = ++requestVersion.value;
      try {
        const requestConfig: (AxiosRequestConfig & { _skipAuthRefresh?: boolean }) | undefined = accessToken
          ? {
            headers: { Authorization: `Bearer ${accessToken}` },
            _skipAuthRefresh: true,
          }
          : undefined;
        const response = await useApiClient().get<User>("/auth/me", requestConfig);
        if (currentRequest !== requestVersion.value) return Boolean(user.value);
        setUser(normalizeUser(response.data));
        return true;
      } catch (error: any) {
        if (currentRequest !== requestVersion.value) return Boolean(user.value);

        const status = error?.info?.status ?? error?.response?.status;
        // A 403 can be a permission/API problem and must not erase a valid
        // login. Only an explicit authentication failure is session-invalid.
        const isInvalidSession = status === 401;

        if (isInvalidSession) {
          // Only an explicit authentication/authorization failure is allowed
          // to clear the current user. Network, 404 and 5xx errors must not
          // turn a temporary outage into a logout.
          clearUser();
        } else {
          authUnavailable.value = true;
          isUserLoading.value = false;
          hasResolvedUser.value = true;
        }
        return false;
      } finally {
        if (currentRequest === requestVersion.value) {
          isUserLoading.value = false;
          hasResolvedUser.value = true;
        }
      }
    })();
    if (process.client) clientUserRequest = request;
    else serverUserRequest = request;

    const clearRequest = () => {
      if (process.client && clientUserRequest === request) clientUserRequest = null;
      if (process.server && serverUserRequest === request) serverUserRequest = null;
    };
    request.then(clearRequest, clearRequest);
    return request;
  };

  // A token in memory is only a refresh hint; the authenticated session is
  // established after /auth/me succeeds. Otherwise an expired token can leave
  // the user on protected pages with an empty permission set.
  const isAuthenticated = computed(() => !!user.value);
  const authStatus = computed<"loading" | "authenticated" | "guest" | "unavailable">(() => {
    if (!hasResolvedUser.value || isUserLoading.value) return "loading";
    if (authUnavailable.value && !user.value) return "unavailable";
    return user.value ? "authenticated" : "guest";
  });

  return {
    user,
    isUserLoading,
    authUnavailable,
    setUser,
    clearUser,
    fetchUser,
    isAuthenticated,
    authStatus,
  };
};
