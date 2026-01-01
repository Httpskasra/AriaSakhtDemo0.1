import type { User } from "~/types/permissions";
import { useNuxtApp } from "#app";

export const useUser = () => {
  const user = useState<User | null>("user", () => null);
  

  const normalizeUser = (data: any): User => {
    const rawId = data?.userId || data?.id || data?._id || "";
    return {
      ...data,
      userId: rawId ? String(rawId) : "",
    } as User;
  };

  const setUser = (data: User) => {
    user.value = data;
  };

  const clearUser = () => {
    user.value = null;
  };

  const fetchUser = async (force = false) => {
    // اگر قبلاً کاربر لود شده و force=false، دیگه درخواست نزن
    if (!force && user.value) {
      return;
    }

    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get<User>("/auth/me");
      setUser(normalizeUser(response.data));
    } catch (err) {
      console.error("Failed to fetch user:", err);
      clearUser();
    }
  };

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    setUser,
    clearUser,
    fetchUser,
    isAuthenticated,
  };
};
