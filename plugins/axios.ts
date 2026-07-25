import axios, { type AxiosInstance, type AxiosError } from "axios";
import { useAuthStore } from "~/stores/auth";
import { refreshAccessToken } from "~/services/authService";
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useRequestHeaders,
  navigateTo,
} from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const incomingCookie = process.server
    ? useRequestHeaders(["cookie"]).cookie
    : undefined;
  const cookieHeaders = incomingCookie ? { Cookie: incomingCookie } : {};

  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...cookieHeaders,
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
      const method = (requestConfig.method || "get").toLowerCase();
      if (!["get", "head", "options"].includes(method)) {
        const csrfToken = authStore.getCsrfToken();
        if (csrfToken) {
          requestConfig.headers["X-CSRF-Token"] = csrfToken;
        }
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
          const accessToken = await refreshAccessToken();

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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
