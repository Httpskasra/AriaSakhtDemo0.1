import { usePermissions } from "~/composables/usePermissions";
import type { Action, Resource } from "~/types/permissions";

type RequiredPermission = {
  resource: Resource;
  action: Action;
};

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;
  const required = to.meta.permission as RequiredPermission | undefined;
  if (!required) return;

  const { hasPermission } = usePermissions();
  if (!hasPermission(required.resource, required.action)) {
    return navigateTo("/forbidden");
  }
});
