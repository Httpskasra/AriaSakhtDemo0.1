import { defineNuxtPlugin, useRequestHeaders } from "#app";
import { useUser } from "~/composables/useUser";
import { refreshAccessToken } from "~/services/authService";
import { useAuthStore } from "~/stores/auth";
import { usePendingLogout } from "~/composables/usePendingLogout";

function hasRefreshCookie(cookieHeader: string | undefined): boolean {
  return Boolean(cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith('refreshToken=')));
}

export default defineNuxtPlugin({
  name: "auth-bootstrap",
  dependsOn: ["axios"],
  async setup() {
    const { authStatus, clearUser, fetchUser } = useUser();
    const { isPending, clearPending } = usePendingLogout();

    if (isPending.value) {
      if (process.server) {
        // Do not render the authenticated user while a previous logout is
        // waiting for a server acknowledgement.
        clearUser();
        return;
      }

      try {
        // The access token is intentionally not persisted. Recreate it from
        // the HttpOnly refresh cookie, then call the guarded signout route.
        const accessToken = await refreshAccessToken();
        const { $axios } = useNuxtApp();
        await $axios.post("/auth/signout", undefined, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        clearPending();
      } catch (error: any) {
        // Keep the marker for every failure: a failed response does not
        // prove that the HttpOnly cookie was revoked. A successful login
        // clears it when the user intentionally starts a new session.
        console.warn("Pending sign out retry failed", error);
      } finally {
        useAuthStore().clearTokens();
        clearUser();
      }
      return;
    }

    if (process.server) {
      // The refresh token is HttpOnly, so SSR is the only place where we can
      // cheaply decide whether an auth bootstrap request is useful on a
      // public page. Resolve guests explicitly so hydration does not repeat
      // an unnecessary /auth/me -> /auth/refresh chain in the browser.
      const cookieHeader = useRequestHeaders(["cookie"]).cookie;
      if (!hasRefreshCookie(cookieHeader)) {
        clearUser();
        return;
      }

      await fetchUser();
      return;
    }

    // On a normal SSR response, authStatus is already hydrated from the
    // server. Only bootstrap client-only runtimes that still have no result.
    if (authStatus.value === "loading") {
      await fetchUser();
    }
  },
});
