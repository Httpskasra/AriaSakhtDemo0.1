import { defineNuxtPlugin } from "#app";
import { useUser } from "~/composables/useUser";

export default defineNuxtPlugin(() => {
  // Resolve the session on public pages as well as protected routes.
  // Do not block Nuxt hydration on an optional public-session request.
  void useUser().fetchUser();
});
