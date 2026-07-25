<script setup lang="ts">
import type { SidebarNavItem } from "~/types/sidebar";
import { usePermissions } from "~/composables/usePermissions";
import { useAuthStore } from "~/stores/auth";
import { Resource } from "~/types/permissions";

defineProps({
  isMenuOpen: { type: Boolean, default: false },
  isScrolled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:isMenuOpen"]);
const router = useRouter();
const { getResources } = usePermissions();
const { clearUser } = useUser();
const { $axios } = useNuxtApp();
const authStore = useAuthStore();

const resourceLabels: Record<string, string> = {
  [Resource.CARTS]: "سبدها",
  [Resource.CATEGORIES]: "دسته‌بندی‌ها",
  [Resource.COMPANIES]: "شرکت‌ها",
  [Resource.ORDERS]: "سفارش‌ها",
  [Resource.PAYMENT]: "پرداخت‌ها",
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

const navItems = computed<SidebarNavItem[]>(() => [
  ...getResources()
    .filter((resource) => resourceLabels[resource])
    .map((resource) => ({
      icon: resource,
      label: resourceLabels[resource],
      route: `/dashboard/${resource}`,
      permission: resource,
      iconBase: "/dashboardIcons",
    })),
  {
    icon: "logout",
    label: "خروج",
    iconBase: "/dashboardIcons",
    action: handleLogOut,
  },
]);

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
  <SharedSidebarPanel :items="navItems" @navigate="emit('update:isMenuOpen', false)" />
</template>
