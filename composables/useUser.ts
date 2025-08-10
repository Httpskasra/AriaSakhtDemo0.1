import type { User } from "~/types/permissions";
import { useNuxtApp } from "#app";

export const useUser = () => {
  const user = useState<User | null>("user", () => null);
  const { $axios } = useNuxtApp();

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
      const response = await $axios.get<User>("/auth/me");
      setUser(response.data);
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
