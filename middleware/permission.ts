// مثال در middleware/auth.ts
import { useUser } from '~/composables/useUser';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchUser } = useUser();
  await fetchUser();
});
