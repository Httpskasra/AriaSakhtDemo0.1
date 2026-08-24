// services/authService.ts
import axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { useCookie, useRequestHeaders, useRuntimeConfig } from "#app";
import { useApiClient } from '~/services/apiClient';

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
const csrfCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 48 * 60 * 60,
};

function readCookie(cookieHeader: string | undefined, name: string): string | null {
  const value = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
  return value ? decodeURIComponent(value) : null;
}

function upsertCookie(cookieHeader: string | undefined, name: string, value: string): string {
  const cookies = (cookieHeader || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !part.startsWith(`${name}=`));

  cookies.push(`${name}=${encodeURIComponent(value)}`);
  return cookies.join('; ');
}

function responseData(error: unknown): { status?: number; code?: string; message?: string } {
  const axiosError = error as {
    response?: { status?: number; data?: { code?: unknown; message?: unknown } };
  };
  const data = axiosError.response?.data;
  return {
    status: axiosError.response?.status,
    code: typeof data?.code === 'string' ? data.code : undefined,
    message: typeof data?.message === 'string' ? data.message : undefined,
  };
}

const isCsrfFailure = (error: unknown): boolean => {
  const details = responseData(error);
  return details.code === 'AUTH_CSRF_INVALID'
    || (details.status === 400 && details.message?.toLowerCase().includes('csrf') === true);
};

/**
 * Only this explicit backend code is allowed to turn a refresh failure into
 * a logout. Infrastructure failures must leave the local session intact so a
 * later request can retry refresh.
 */
export const isInvalidRefreshSession = (error: unknown): boolean => {
  const details = responseData(error);
  return details.code === 'AUTH_SESSION_INVALID'
    || (details.status === 401 && !details.code);
};

async function performRefresh(
  authStore: ReturnType<typeof useAuthStore>,
): Promise<string> {
  const config = useRuntimeConfig();
  const apiBase = (process.server ? config.serverApiBase : config.public.apiBase) as string;
  const incomingHeaders = process.server
    ? useRequestHeaders(["cookie", "user-agent"])
    : {};
  const incomingCookie = incomingHeaders.cookie;
  const incomingUserAgent = incomingHeaders['user-agent'];
  let upstreamHeaders: Record<string, string> = {
    ...(incomingCookie ? { Cookie: incomingCookie } : {}),
    // The backend binds refresh sessions to the browser User-Agent. Preserve
    // it when SSR performs the internal refresh on behalf of that browser.
    ...(incomingUserAgent ? { 'User-Agent': incomingUserAgent } : {}),
  };

  // Create this before the first await so the Nuxt SSR context is captured.
  // Writing it on both server and client also covers browsers where the
  // cross-origin Set-Cookie response is delayed or not persisted.
  const csrfCookie = useCookie<string | null>('csrfToken', csrfCookieOptions);

  const browserCookie = process.client && typeof document !== 'undefined' ? document.cookie : undefined;
  // The backend validates the double-submit pair. A token in Pinia/Nuxt state
  // without its matching cookie is not usable, so the cookie is authoritative.
  let csrfToken = readCookie(incomingCookie || browserCookie, 'csrfToken') || csrfCookie.value;

  const issueCsrfCookie = async (): Promise<void> => {
    const csrfResponse = await axios.get<{ csrfToken: string }>(
      `${apiBase}/auth/csrf`,
      { withCredentials: true, headers: upstreamHeaders, timeout: 10000 },
    );
    csrfToken = csrfResponse.data.csrfToken;
    authStore.setCsrfToken(csrfToken);
    csrfCookie.value = csrfToken;

    if (process.server) {
      // Axios on the server does not maintain a browser-like cookie jar. Add
      // the freshly issued CSRF cookie to the internal refresh request too.
      const cookieHeader = upsertCookie(incomingCookie, 'csrfToken', csrfToken);
      upstreamHeaders = { ...upstreamHeaders, Cookie: cookieHeader };
    }
  };

  if (!csrfToken) {
    await issueCsrfCookie();
  } else {
    // Reuse the CSRF cookie already present on the incoming request/browser.
    authStore.setCsrfToken(csrfToken);
  }

  const payload: RefreshTokenRequestDto = {};
  let csrfRetried = false;
  let data: RefreshTokenResponseDto;
  while (true) {
    try {
      ({ data } = await axios.post<RefreshTokenResponseDto>(
        `${apiBase}/auth/refresh`,
        payload,
        {
          withCredentials: true,
          timeout: 10000,
          headers: { ...upstreamHeaders, "X-CSRF-Token": csrfToken },
        },
      ));
      break;
    } catch (error) {
      // A rotated/stale CSRF cookie is recoverable. Mint one replacement and
      // retry exactly once; never clear an otherwise valid login for this.
      if (!csrfRetried && isCsrfFailure(error)) {
        csrfRetried = true;
        await issueCsrfCookie();
        continue;
      }
      throw error;
    }
  }

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

export interface RequestOtpResponse { message?: string; phoneNumber?: string; }

export async function requestSignInOtp(phoneNumber: string): Promise<RequestOtpResponse> {
  const api = useApiClient();
  const { data } = await api.post<RequestOtpResponse>('/auth/signin', { phoneNumber });
  return data;
}

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
