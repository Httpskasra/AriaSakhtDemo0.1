// services/authService.ts
import axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { useRequestHeaders, useRuntimeConfig } from "#app";

export interface RefreshTokenRequestDto {
  // Kept aligned with the backend contract. The secure browser flow does not
  // populate this field because refreshToken is an HttpOnly backend cookie.
  refreshToken?: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  csrfToken?: string;
}

export interface SignoutRequestDto {
  /** Optional legacy signal; the secure HttpOnly cookie remains authoritative. */
  refreshToken?: string;
}

export interface SignoutResponseDto {
  message: string;
}

export interface UpdateUserPermissionsRequestDto {
  permissions: Array<{
    resource: string;
    actions: string[];
    companyId?: string;
  }>;
  companyId?: string;
}

const refreshLocks = new WeakMap<object, Promise<string>>();

async function performRefresh(
  authStore: ReturnType<typeof useAuthStore>,
): Promise<string> {
  const config = useRuntimeConfig();
  const incomingCookie = process.server
    ? useRequestHeaders(["cookie"]).cookie
    : undefined;
  const cookieHeaders = incomingCookie ? { Cookie: incomingCookie } : {};

  let csrfToken = authStore.getCsrfToken();
  if (!csrfToken) {
    const csrfResponse = await axios.get<{ csrfToken: string }>(
      `${config.public.apiBase}/auth/csrf`,
      { withCredentials: true, headers: cookieHeaders },
    );
    csrfToken = csrfResponse.data.csrfToken;
    authStore.setCsrfToken(csrfToken);
  }

  const payload: RefreshTokenRequestDto = {};
  const { data } = await axios.post<RefreshTokenResponseDto>(
    `${config.public.apiBase}/auth/refresh`,
    payload,
    {
      withCredentials: true,
      headers: { ...cookieHeaders, "X-CSRF-Token": csrfToken },
    },
  );

  authStore.setTokens(data.accessToken, data.csrfToken || csrfToken);
  return data.accessToken;
}

/**
 * Single refresh entry point. Calls sharing the same Nuxt/Pinia session reuse
 * the same Promise, so concurrent 401 responses produce one refresh request.
 */
export const refreshAccessToken = (): Promise<string> => {
  const authStore = useAuthStore();
  const existingRefresh = refreshLocks.get(authStore);
  if (existingRefresh) return existingRefresh;

  const refreshPromise = performRefresh(authStore).finally(() => {
    refreshLocks.delete(authStore);
  });
  refreshLocks.set(authStore, refreshPromise);
  return refreshPromise;
};

export const login = async (email: string, password: string) => {
  const { $axios } = useNuxtApp();
  try {
    //console.log("Sending login request with:", { email, password });
    return await $axios.post("/", { username: email, password });
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

export const logout = async (refreshToken?: string) => {
  const { $axios } = useNuxtApp();
  try {
    return await $axios.post<SignoutResponseDto>("/auth/signout", {
      refreshToken,
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export const getProfile = async () => {
  const { $axios } = useNuxtApp();
  return await $axios.get("/auth/me");
};

export const updateUserPermissions = async (
  userId: string,
  payload: UpdateUserPermissionsRequestDto,
) => {
  const { $axios } = useNuxtApp();
  return await $axios.patch(
    `/auth/users/${encodeURIComponent(userId)}/permissions`,
    payload,
  );
};
