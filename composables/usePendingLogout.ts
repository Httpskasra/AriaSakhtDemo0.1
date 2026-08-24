const PENDING_LOGOUT_COOKIE = "logoutPending";

const pendingLogoutCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  // Match the backend refresh-token lifetime so a failed logout cannot be
  // forgotten while the server-side session is still refreshable.
  maxAge: 48 * 60 * 60,
};

export function usePendingLogout() {
  const pendingLogout = useCookie<string | null>(
    PENDING_LOGOUT_COOKIE,
    pendingLogoutCookieOptions,
  );

  const markPending = () => {
    pendingLogout.value = "1";
  };

  const clearPending = () => {
    pendingLogout.value = null;
  };

  return {
    isPending: computed(() => pendingLogout.value === "1"),
    markPending,
    clearPending,
  };
}
