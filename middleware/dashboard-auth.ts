// مثال در middleware/auth.ts
import { useUser } from '~/composables/useUser';

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/dashboard')) {
    const { fetchUser, isAuthenticated } = useUser();
    await fetchUser();

    if (!isAuthenticated.value) {
      return navigateTo('/login');
    }
  }
});