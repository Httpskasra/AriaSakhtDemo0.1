import { Action, Resource } from "~/types/permissions";
import { usePermissions } from "~/composables/usePermissions";
import { computed } from "vue";

export function useAccess(resource: Resource) {
  const { hasPermission, getActionsFor, isReady } = usePermissions();

  const canManage = computed(() => hasPermission(resource, Action.MANAGE));

  const canRead = computed(() => canManage.value || hasPermission(resource, Action.READ));
  const canCreate = computed(() => canManage.value || hasPermission(resource, Action.CREATE));
  const canUpdate = computed(() => canManage.value || hasPermission(resource, Action.UPDATE));
  const canDelete = computed(() => canManage.value || hasPermission(resource, Action.DELETE));

  const allActions = computed(() => getActionsFor(resource));

  return {
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canManage,
    allActions,
    isReady,
  };
}
