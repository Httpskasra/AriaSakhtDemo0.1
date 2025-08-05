import { useUser } from "~/composables/useUser";
import { Action, Resource, type Permission } from "~/types/permissions";

const CRUD_ACTIONS = [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE];

export function usePermissions() {
  const { user } = useUser();

  const hasPermission = (resource: Resource, action: Action): boolean => {
    const permissions = user.value?.permissions ?? [];

    return permissions.some((perm: Permission) => {
      const resourceMatch =
        perm.resource === resource || perm.resource === Resource.ALL;

      const actionMatch =
        perm.actions.includes(action) ||
        (perm.actions.includes(Action.MANAGE) && CRUD_ACTIONS.includes(action));

      return resourceMatch && actionMatch;
    });
  };

  const getActionsFor = (resource: Resource): Action[] => {
    const permissions = user.value?.permissions ?? [];

    const matching = permissions.find(
      (p) => p.resource === resource || p.resource === Resource.ALL
    );

    if (!matching) return [];

    // اگر MANAGE داشت، همه CRUDها رو بده
    const actions = matching.actions.includes(Action.MANAGE)
      ? [...CRUD_ACTIONS]
      : [];

    return Array.from(new Set([...actions, ...matching.actions]));
  };

  const getResources = (): Resource[] => {
    const permissions = user.value?.permissions ?? [];

    if (permissions.some((p) => p.resource === Resource.ALL)) {
      // اگه به ALL دسترسی داره، همه‌ی ریسورس‌ها رو بده به جز 'all' خودش
      return Object.values(Resource).filter((r) => r !== Resource.ALL);
    }

    return permissions.map((p) => p.resource);
  };

  return {
    hasPermission,
    getResources,
    getActionsFor,
  };
}
