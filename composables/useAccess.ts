import { Action, Resource } from "~/types/permissions";
import { usePermissions } from "~/composables/usePermissions";

export function useAccess(resource: Resource) {
  const { hasPermission, getActionsFor } = usePermissions();

  const canManage = hasPermission(resource, Action.MANAGE);

  const canRead = canManage || hasPermission(resource, Action.READ);
  const canCreate = canManage || hasPermission(resource, Action.CREATE);
  const canUpdate = canManage || hasPermission(resource, Action.UPDATE);
  const canDelete = canManage || hasPermission(resource, Action.DELETE);

  const allActions = getActionsFor(resource);

  return {
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canManage,
    allActions,
  };
}
