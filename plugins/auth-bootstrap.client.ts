import { defineNuxtPlugin, useRoute } from "#app";
import { useUser } from "~/composables/useUser";

export default defineNuxtPlugin({
  name: "auth-bootstrap",
  dependsOn: ["axios"],
  async setup() {
    // Public pages do not need an auth bootstrap request. On panel routes,
    // resolve the session before the first page component mounts so page-level
    // permission checks cannot start with an empty user object.
    if (!useRoute().path.startsWith("/dashboard")) return;
    await useUser().fetchUser();
  },
});
