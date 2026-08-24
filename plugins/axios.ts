import axios, { type AxiosError, type AxiosInstance } from "axios";
import { useAuthStore } from "~/stores/auth";
import { isInvalidRefreshSession, refreshAccessToken } from "~/services/authService";
import { useUser } from "~/composables/useUser";
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useRequestHeaders,
  navigateTo,
} from "#app";

export default defineNuxtPlugin({
  name: "axios",
  setup(nuxtApp) {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const incomingCookie = process.server
    ? useRequestHeaders(["cookie"]).cookie
    : undefined;
  const cookieHeaders = incomingCookie ? { Cookie: incomingCookie } : {};
  let redirectPromise: Promise<unknown> | null = null;

  const api: AxiosInstance = axios.create({
    baseURL: (process.server ? config.serverApiBase : config.public.apiBase) as string,
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
      if (accessToken && !requestConfig.headers?.Authorization) {
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
      const requestUrl = String(originalRequest?.url || '');
      const isAuthBootstrapRequest = /\/auth\/(refresh|csrf|signin|signup|verify-otp)$/.test(requestUrl);
      
      // If 401 Unauthorized and not already retrying
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest._skipAuthRefresh &&
        !isAuthBootstrapRequest
      ) {
        originalRequest._retry = true;
        
        try {
          const accessToken = await refreshAccessToken();

          // The request interceptor attaches the refreshed token on retry.
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          const sessionIsInvalid = isInvalidRefreshSession(refreshError);

          // A timeout, network outage, Redis outage, CSRF repair failure or
          // 5xx response must not destroy a valid local session. Only an
          // explicit AUTH_SESSION_INVALID response is allowed to clear
          // stores and redirect the user.
          if (sessionIsInvalid) {
            authStore.clearTokens();
            useUser().clearUser();
            if (process.client && window.location.pathname.startsWith("/dashboard")) {
              redirectPromise ??= Promise.resolve(navigateTo("/", { replace: true }));
              await redirectPromise;
            }
          }
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Provide axios instance globally
    nuxtApp.provide("axios", api);
  },
});
