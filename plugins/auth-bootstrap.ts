import { defineNuxtPlugin, useRequestHeaders } from "#app";
import { useUser } from "~/composables/useUser";
import { isInvalidRefreshSession, refreshAccessToken } from "~/services/authService";
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

    const authStore = useAuthStore();

    // SSR normally hydrates both the user and the short-lived access token.
    // If only the user arrived in the payload, restore the access token from
    // the HttpOnly refresh cookie before the first protected navigation/API
    // request. Never persist the access token in localStorage.
    if (authStatus.value === "authenticated" && !authStore.getAccessToken()) {
      try {
        await refreshAccessToken();
      } catch (error) {
        // A genuinely invalid/expired refresh session is a real logout. A
        // temporary API, Redis or network failure must keep the current user
        // state so a later request can retry without forcing a login.
        if (isInvalidRefreshSession(error)) {
          authStore.clearTokens();
          clearUser();
        }
      }
      return;
    }

    // Retry an auth bootstrap that failed during SSR because of a temporary
    // infrastructure problem. This prevents one transient outage from
    // becoming a guest session after the page has hydrated.
    if (authStatus.value === "loading" || authStatus.value === "unavailable") {
      await fetchUser(authStatus.value === "unavailable");
    }
  },
});
