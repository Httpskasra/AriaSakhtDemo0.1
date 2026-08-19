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
const { hasPermission } = usePermissions();
const { clearUser } = useUser();
const { $axios } = useNuxtApp();
const authStore = useAuthStore();

const resourceLabels: Record<string, string> = {
  [Resource.CATEGORIES]: "دسته‌بندی‌ها",
  [Resource.COMPANIES]: "شرکت‌ها",
  [Resource.ORDERS]: "سفارش‌ها",
  [Resource.PRODUCTS]: "محصولات",
  [Resource.TICKETING]: "تیکت‌ها",
  [Resource.TRANSACTION]: "تراکنش‌ها",
  [Resource.TRANSPORTING]: "حمل و نقل",
  [Resource.USERS]: "کاربران",
  [Resource.WALLETS]: "کیف پول",
  [Resource.PROFILE]: "پروفایل",
  [Resource.PRODUCT_STATUS]: "وضعیت محصول",
};

const resourceRoutes: Partial<Record<Resource, string>> = {
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

const canManage = (resource: Resource) => [
  Action.MANAGE,
  Action.CREATE,
  Action.UPDATE,
  Action.DELETE,
].some((action) => hasPermission(resource, action));

const linkFor = (resource: Resource): SidebarNavItem | null => {
  const route = resourceRoutes[resource];
  if (!route || !resourceLabels[resource]) return null;
  return {
    icon: resource,
    label: resourceLabels[resource],
    route,
    permission: resource,
    iconBase: "/dashboardIcons",
  };
};

const section = (label: string): SidebarNavItem => ({
  icon: `section-${label}`,
  label,
  iconBase: "/dashboardIcons",
  section: true,
});

const navItems = computed<SidebarNavItem[]>(() => {
  const items: SidebarNavItem[] = [
    { icon: "dashboard", label: "داشبورد", route: "/dashboard", iconBase: "/dashboardIcons" },
    section("حساب کاربری"),
  ];

  const accountResources = [
    Resource.PROFILE,
    Resource.ORDERS,
    Resource.CARTS,
    Resource.TICKETING,
    Resource.WALLETS,
    Resource.TRANSACTION,
  ];
  accountResources.forEach((resource) => {
    const item = resource === Resource.CARTS
      ? { icon: Resource.CARTS, label: "سبد خرید", route: "/dashboard/carts", iconBase: "/dashboardIcons" }
      : linkFor(resource);
    if (item && (resource === Resource.CARTS || hasPermission(resource, Action.READ))) items.push(item);
  });

  items.push({
    icon: "fav",
    label: "علاقه‌مندی‌ها",
    route: "/dashboard/fav",
    iconBase: "/dashboardIcons",
  });

  const sellerResources = [
    Resource.COMPANIES,
    Resource.PRODUCTS,
    Resource.PRODUCT_STATUS,
    Resource.TRANSPORTING,
  ];
  const sellerItems = sellerResources
    .filter((resource) => hasPermission(resource, Action.READ) || canManage(resource))
    .map(linkFor)
    .filter((item): item is SidebarNavItem => Boolean(item));
  if (sellerItems.length) items.push(section("فروشندگی"), ...sellerItems);

  const managementItems: SidebarNavItem[] = [];
  if (canManage(Resource.CATEGORIES)) {
    const item = linkFor(Resource.CATEGORIES);
    if (item) managementItems.push(item);
  }
  if (hasPermission(Resource.USERS, Action.MANAGE)) {
    const users = linkFor(Resource.USERS);
    if (users) managementItems.push(users);
    managementItems.push({
      icon: Resource.ROLES,
      label: "نقش‌ها و دسترسی‌ها",
      route: "/dashboard/roles",
      permission: Resource.USERS,
      iconBase: "/dashboardIcons",
    });
  }
  if (managementItems.length) items.push(section("مدیریت"), ...managementItems);

  items.push({ icon: "logout", label: "خروج", iconBase: "/dashboardIcons", action: handleLogOut });

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
