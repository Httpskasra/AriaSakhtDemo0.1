import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async () => {
  // Session restoration needs browser cookies (refresh + CSRF). Let the
  // client resolve them after hydration instead of redirecting SSR to home.
  if (import.meta.server) return;
  const { fetchUser, isAuthenticated } = useUser();
  await fetchUser();

  if (!isAuthenticated.value) {
    return navigateTo("/");
  }
});
