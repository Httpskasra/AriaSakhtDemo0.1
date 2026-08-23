import type { User } from "~/types/permissions";
import { useState } from "#app";
import { computed } from "vue";
import { useApiClient } from '~/services/apiClient';

export const useUser = () => {
  const user = useState<User | null>("user", () => null);
  const isUserLoading = useState<boolean>("user-loading", () => true);
  const hasResolvedUser = useState<boolean>("user-resolved", () => false);
  // A temporary auth API/network failure is different from an invalid
  // session. Keep this state so route middleware does not log the user out
  // merely because /auth/me was temporarily unavailable.
  const authUnavailable = useState<boolean>("user-auth-unavailable", () => false);
  const requestVersion = useState<number>("user-request-version", () => 0);
  // Keep one in-flight profile request for the whole app. The bootstrap
  // plugin and route middleware can run together during hydration.
  let userRequest: Promise<boolean> | null = null;
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

  const fetchUser = async (force = false): Promise<boolean> => {
    if (!force && user.value) {
      isUserLoading.value = false;
      hasResolvedUser.value = true;
      return true;
    }

    if (!force && userRequest) return userRequest;

    const request = (async () => {
      isUserLoading.value = true;
      authUnavailable.value = false;
      const currentRequest = ++requestVersion.value;
      try {
        const response = await useApiClient().get<User>("/auth/me");
        if (currentRequest !== requestVersion.value) return Boolean(user.value);
        setUser(normalizeUser(response.data));
        return true;
      } catch (error: any) {
        if (currentRequest !== requestVersion.value) return Boolean(user.value);

        const status = error?.info?.status ?? error?.response?.status;
        const isInvalidSession = status === 401 || status === 403;

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
    userRequest = request;
    request.then(
      () => { if (userRequest === request) userRequest = null; },
      () => { if (userRequest === request) userRequest = null; },
    );
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
