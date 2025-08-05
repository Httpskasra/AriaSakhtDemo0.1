import type { User } from "~/types/permissions";

export const useUser = () => {
  const user = useState<User | null>("user", () => null);

  const setUser = (data: User) => {
    user.value = data;
  };

  const clearUser = () => {
    user.value = null;
  };

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    setUser,
    clearUser,
    isAuthenticated,
  };
};
