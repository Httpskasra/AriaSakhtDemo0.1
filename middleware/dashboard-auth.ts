import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;
  if (to.path.startsWith("/dashboard")) {
    const { fetchUser, isAuthenticated } = useUser();

    // فقط وقتی user خالی باشه fetch کن
    await fetchUser();

    if (!isAuthenticated.value) {
      return navigateTo("/");
    }
  }
});
