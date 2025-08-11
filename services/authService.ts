// services/authService.ts
export const login = async (email: string, password: string) => {
  const { $axios } = useNuxtApp();
  try {
    console.log("Sending login request with:", { email, password });
    return await $axios.post("/", { username: email, password });
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

export const logout = async () => {
  const { $axios } = useNuxtApp();
  try {
    return await $axios.post("/auth/logout");
  } catch (error: any) {
    console.error("Logout error:", error);
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { $axios } = useNuxtApp();
  return await $axios.post("/auth/refresh", { refresh_token: refreshToken });
};

export const getProfile = async () => {
  const { $axios } = useNuxtApp();
  return await $axios.get("/auth/profile");
};
