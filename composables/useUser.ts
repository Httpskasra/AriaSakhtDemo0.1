import type { User } from "~/types/permissions";
import { useNuxtApp } from "#app";

export const useUser = () => {
  const user = useState<User | null>("user", () => null);
  const { $axios } = useNuxtApp(); // استفاده از axios instance با توکن

  const setUser = (data: User) => {
    user.value = data;
  };

  const clearUser = () => {
    user.value = null;
  };

  const fetchUser = async () => {
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
