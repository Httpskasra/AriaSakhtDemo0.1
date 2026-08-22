import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async () => {
  const { fetchUser, isAuthenticated } = useUser();
  await fetchUser();

  if (!isAuthenticated.value) {
    return navigateTo("/");
  }
});
