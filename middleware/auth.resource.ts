import { usePermissions } from "~/composables/usePermissions";
import { Resource, Action } from "~/types/permissions";

export default defineNuxtRouteMiddleware((to) => {
  const { hasPermission } = usePermissions();
  const resource = to.meta.resource as Resource;
  const action = (to.meta.action as Action) || Action.READ;

  if (!resource || !hasPermission(resource, action)) {
    return navigateTo("/403");
  }
});
