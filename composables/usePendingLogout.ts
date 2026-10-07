const PENDING_LOGOUT_COOKIE = "logoutPending";

export function usePendingLogout() {
  const config = useRuntimeConfig();
  const configuredTtl = Number(config.public.authRefreshTtlSeconds);
  const pendingLogout = useCookie<string | null>(
    PENDING_LOGOUT_COOKIE,
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // Match the backend refresh-token lifetime so a failed logout cannot
      // be forgotten while the server-side session is still refreshable.
      maxAge: Number.isFinite(configuredTtl) && configuredTtl > 0 ? configuredTtl : 48 * 60 * 60,
    },
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
