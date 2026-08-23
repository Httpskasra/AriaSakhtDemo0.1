import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async () => {
  const { fetchUser, isAuthenticated, authUnavailable } = useUser();
  await fetchUser();

  // Do not redirect to the homepage while the auth service is temporarily
  // unavailable. A later navigation/retry can resolve the same session.
  if (authUnavailable.value) return;

  if (!isAuthenticated.value) {
    return navigateTo("/");
  }
});
