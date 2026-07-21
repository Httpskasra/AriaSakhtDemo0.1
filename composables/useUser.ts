import type { User } from "~/types/permissions";
import { useNuxtApp, useState } from "#app";
import { computed } from "vue";

export const useUser = () => {
  const user = useState<User | null>("user", () => null);
  const isUserLoading = useState<boolean>("user-loading", () => true);

  const normalizeUser = (data: any): User => {
    const rawId = data?.userId || data?.id || data?._id || "";
    return {
      ...data,
      userId: rawId ? String(rawId) : "",
    } as User;
  };

  const setUser = (data: User) => {
    user.value = data;
    isUserLoading.value = false;
  };

  const clearUser = () => {
    user.value = null;
    isUserLoading.value = false;
  };

  const fetchUser = async (force = false) => {
    if (!force && user.value) {
      isUserLoading.value = false;
      return;
    }

    isUserLoading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get<User>("/auth/me");
      setUser(normalizeUser(response.data));
    } catch (err) {
      console.error("Failed to fetch user:", err);
      clearUser();
    } finally {
      isUserLoading.value = false;
    }
  };

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    isUserLoading,
    setUser,
    clearUser,
    fetchUser,
    isAuthenticated,
  };
};
