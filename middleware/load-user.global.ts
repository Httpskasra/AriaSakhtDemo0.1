import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async () => {
  const { user, setUser } = useUser();
  if (!user.value) {
    const { data } = await useFetch("/api/auth/me");
    if (data.value) setUser(data.value);
  }
});
