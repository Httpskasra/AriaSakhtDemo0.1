import { useUser } from "~/composables/useUser";
import { Action, Resource, type Permission } from "~/types/permissions";

const CRUD_ACTIONS = [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE];

export function usePermissions() {
  const { user } = useUser();

  const expandsAction = (actions: Action[], action: Action): boolean =>
    actions.includes(action) ||
    (actions.includes(Action.MANAGE) && CRUD_ACTIONS.includes(action));

  const matchingPermissions = (resource: Resource): Permission[] => {
    const permissions = user.value?.permissions ?? [];
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
  };
}
