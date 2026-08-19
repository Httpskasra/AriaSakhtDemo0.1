import { defineNuxtPlugin } from "#app";
import { useUser } from "~/composables/useUser";

export default defineNuxtPlugin(async () => {
  // Resolve the session on public pages as well as protected routes.
  await useUser().fetchUser();
});
