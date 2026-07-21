import axios, { type AxiosInstance, type AxiosError } from "axios";
import { useAuthStore } from "~/stores/auth";
import { defineNuxtPlugin, useRuntimeConfig, navigateTo } from "#app";

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

  // Request Interceptor: Attach token
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

  // Response Interceptor: Handle Token Refresh and 401s
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      
      // If 401 Unauthorized and not already retrying
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = authStore.getRefreshToken();

          if (!refreshToken) {
            authStore.clearTokens();
            // F1: Use navigateTo instead of window.location for SSR safety
            return navigateTo("/", { external: true });
          }

          // Request new access token
          const { data } = await axios.post(
            `${config.public.apiBase}/auth/refresh`,
            { refreshToken }
          );

          // Update store with new token
          authStore.setTokens(data.accessToken, refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token session failed:", refreshError);
          authStore.clearTokens();
          // F1: Robust redirect across SSR/Client
          return navigateTo("/", { external: true });
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Provide axios instance globally
  nuxtApp.provide("axios", api);
});
