// server/api/auth/me.get.ts
import { defineEventHandler } from "h3";
import { Resource, Action, type User } from "~/types/permissions";

export default defineEventHandler((): User => {
  return {
    // id: "123456789",
    // permissions: [
    //   {
    //     resource: Resource.ORDERS,
    //     actions: [Action.READ, Action.UPDATE],
    //   },
    //   {
    //     resource: Resource.USERS,
    //     actions: [Action.READ],
    //   },
    //   {
    //     resource: Resource.PRODUCTS,
    //     actions: [Action.READ, Action.CREATE, Action.DELETE, Action.UPDATE],
    //   },
    //   {
    //     resource: Resource.CARTS,
    //     actions: [Action.READ, Action.CREATE, Action.DELETE],
    //   },
    // ],
    id: "admin123",
    permissions: [
      {
        resource: Resource.ALL,
        actions: [Action.MANAGE],
      },
    ],
  };
});
