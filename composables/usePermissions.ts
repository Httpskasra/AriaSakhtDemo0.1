import { useUser } from "~/composables/useUser";
import { Action, Resource, type Permission } from "~/types/permissions";
import { computed } from "vue";

const CRUD_ACTIONS = [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE];

export function usePermissions() {
  const { user, isUserLoading } = useUser();
  // A failed /auth/me request must not leave the panel in an endless blank
  // state. Once loading ends, pages can render their own API error or
  // forbidden state instead of waiting forever for permission data.
  const isReady = computed(() => !isUserLoading.value);
  const normalizedPermissions = computed<Permission[]>(() =>
    (Array.isArray(user.value?.permissions) ? user.value.permissions : [])
      .filter((permission): permission is Permission => Boolean(permission?.resource && Array.isArray(permission.actions))),
  );

  const expandsAction = (actions: Action[], action: Action): boolean =>
    actions.includes(action) ||
    (actions.includes(Action.MANAGE) && CRUD_ACTIONS.includes(action));

  const matchingPermissions = (resource: Resource): Permission[] => {
    const permissions = normalizedPermissions.value;
    return permissions.filter(
      (perm) => perm.resource === resource || perm.resource === Resource.ALL,
    );
  };

  const hasPermission = (resource: Resource, action: Action): boolean => {
    return matchingPermissions(resource).some((perm: Permission) =>
      expandsAction(perm.actions, action),
    );
  };

  const getActionsFor = (resource: Resource): Action[] => {
    const actions = matchingPermissions(resource).flatMap((permission) => [
      ...permission.actions,
      ...(permission.actions.includes(Action.MANAGE) ? CRUD_ACTIONS : []),
    ]);

    return Array.from(new Set(actions));
  };

  const getResources = (): Resource[] => {
    if (hasPermission(Resource.ALL, Action.MANAGE)) {
      // اگه به ALL دسترسی داره، همه‌ی ریسورس‌ها رو بده به جز 'all' خودش
      return Object.values(Resource).filter((r) => r !== Resource.ALL);
    }

    return Array.from(
      new Set(
        Object.values(Resource).filter((resource) =>
          hasPermission(resource, Action.READ),
        ),
      ),
    );
  };

  return {
    hasPermission,
    getResources,
    getActionsFor,
    isReady,
  };
}
