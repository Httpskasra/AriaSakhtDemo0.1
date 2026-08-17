<script setup lang="ts">
import type { SidebarNavItem } from "~/types/sidebar";
import { usePermissions } from "~/composables/usePermissions";
import { useAuthStore } from "~/stores/auth";
import { Action, Resource } from "~/types/permissions";

defineProps({
  isMenuOpen: { type: Boolean, default: false },
  isScrolled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:isMenuOpen"]);
const router = useRouter();
const route = useRoute();
const { getResources, hasPermission } = usePermissions();
const { clearUser } = useUser();
const { $axios } = useNuxtApp();
const authStore = useAuthStore();

const resourceLabels: Record<string, string> = {
  [Resource.CARTS]: "سبدها",
  [Resource.CATEGORIES]: "دسته‌بندی‌ها",
  [Resource.COMPANIES]: "شرکت‌ها",
  [Resource.ORDERS]: "سفارش‌ها",
  [Resource.PRODUCTS]: "محصولات",
  [Resource.ROLES]: "نقش‌ها",
  [Resource.TICKETING]: "تیکت‌ها",
  [Resource.TRANSACTION]: "تراکنش‌ها",
  [Resource.TRANSPORTING]: "حمل و نقل",
  [Resource.USERS]: "کاربران",
  [Resource.WALLETS]: "کیف پول",
  [Resource.PROFILE]: "پروفایل",
  [Resource.PRODUCT_STATUS]: "وضعیت محصول",
};

const resourceOrder = [
  Resource.CARTS,
  Resource.CATEGORIES,
  Resource.COMPANIES,
  Resource.PRODUCTS,
  Resource.PRODUCT_STATUS,
  Resource.ORDERS,
  Resource.TRANSACTION,
  Resource.TRANSPORTING,
  Resource.USERS,
  Resource.ROLES,
  Resource.TICKETING,
  Resource.WALLETS,
  Resource.PROFILE,
];

const navItems = computed<SidebarNavItem[]>(() => {
  const resourceRoutes: Partial<Record<Resource, string>> = {
    [Resource.CARTS]: "/dashboard/carts",
    [Resource.CATEGORIES]: "/dashboard/categories",
    [Resource.COMPANIES]: "/dashboard/companies",
    [Resource.PRODUCTS]: "/dashboard/products",
    [Resource.PRODUCT_STATUS]: "/dashboard/product_status",
    [Resource.ORDERS]: "/dashboard/orders",
    [Resource.TRANSACTION]: "/dashboard/transaction",
    [Resource.TRANSPORTING]: "/dashboard/transporting",
    [Resource.USERS]: "/dashboard/users",
    [Resource.TICKETING]: "/dashboard/ticketing",
    [Resource.WALLETS]: "/dashboard/wallets",
    [Resource.PROFILE]: "/dashboard/profile",
  };

  const resourceItems = getResources()
    .filter((resource) => resourceLabels[resource] && resourceRoutes[resource])
    .sort((left, right) => resourceOrder.indexOf(left) - resourceOrder.indexOf(right))
    .map((resource) => ({
      icon: resource,
      label: resourceLabels[resource],
      route: resourceRoutes[resource] as string,
      permission: resource,
      iconBase: "/dashboardIcons",
    }));

  if (hasPermission(Resource.USERS, Action.MANAGE)) {
    resourceItems.splice(resourceItems.findIndex((item) => item.route === "/dashboard/users") + 1, 0, {
      icon: Resource.ROLES,
      label: "نقش‌ها",
      route: "/dashboard/roles",
      permission: Resource.USERS,
      iconBase: "/dashboardIcons",
    });
  }

  const items: SidebarNavItem[] = [
    ...resourceItems,
    {
      icon: "logout",
      label: "خروج",
      iconBase: "/dashboardIcons",
      action: handleLogOut,
    },
  ];

  return route.path === "/dashboard/company/register"
    ? items.filter((item) => item.label !== "خروج")
    : items;
});

async function handleLogOut() {
  try {
    await $axios.post("/auth/signout");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    authStore.clearTokens();
    clearUser();
    await router.push("/");
  }
}
</script>

<template>
  <SidebarPanel :items="navItems" @navigate="emit('update:isMenuOpen', false)" />
</template>
