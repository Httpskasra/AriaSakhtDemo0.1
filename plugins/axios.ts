import axios, { type AxiosInstance, type AxiosError } from "axios";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request Interceptor
  api.interceptors.request.use(
    (requestConfig) => {
      const accessToken = authStore.getAccessToken();
      if (accessToken) {
        requestConfig.headers = requestConfig.headers || {};
        requestConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post(
            `${config.public.apiBase}/refresh`,
            {
              refresh_token: authStore.getRefreshToken(),
            }
          );

          authStore.setTokens(data.access_token, data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          authStore.clearTokens();
          navigateTo("/");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  // Add instance to Nuxt App
  nuxtApp.provide("axios", api);
});
