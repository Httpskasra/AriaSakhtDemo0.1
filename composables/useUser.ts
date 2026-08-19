import type { User } from "~/types/permissions";
import { useState } from "#app";
import { computed } from "vue";
import { useApiClient } from '~/services/apiClient';

export const useUser = () => {
  const user = useState<User | null>("user", () => null);
  const isUserLoading = useState<boolean>("user-loading", () => true);
  const hasResolvedUser = useState<boolean>("user-resolved", () => false);
  const normalizeUser = (data: User & { id?: string; _id?: string }): User => {
    const rawId = data?.userId || data?.id || data?._id || "";
    return {
      ...data,
      userId: rawId ? String(rawId) : "",
    };
  };

  const setUser = (data: User) => {
    user.value = data;
    isUserLoading.value = false;
    hasResolvedUser.value = true;
  };

  const clearUser = () => {
    user.value = null;
    isUserLoading.value = false;
    hasResolvedUser.value = true;
  };

  const fetchUser = async (force = false) => {
    if (!force && user.value) {
      isUserLoading.value = false;
      hasResolvedUser.value = true;
      return;
    }

    isUserLoading.value = true;
    const request = (async () => {
      try {
        const response = await useApiClient().get<User>("/auth/me");
        setUser(normalizeUser(response.data));
      } catch (_err) {
        clearUser();
      } finally {
        isUserLoading.value = false;
        hasResolvedUser.value = true;
      }
    })();
    await request;
  };

  // A token in memory is only a refresh hint; the authenticated session is
  // established after /auth/me succeeds. Otherwise an expired token can leave
  // the user on protected pages with an empty permission set.
  const isAuthenticated = computed(() => !!user.value);
  const authStatus = computed<"loading" | "authenticated" | "guest">(() => {
    if (!hasResolvedUser.value || isUserLoading.value) return "loading";
    return user.value ? "authenticated" : "guest";
  });

  return {
    user,
    isUserLoading,
    setUser,
    clearUser,
    fetchUser,
    isAuthenticated,
    authStatus,
  };
};
