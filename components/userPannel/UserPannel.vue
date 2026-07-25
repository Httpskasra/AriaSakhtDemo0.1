<script setup lang="ts">
import type { SidebarNavItem } from "~/types/sidebar";

defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false,
  },
  isScrolled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:isMenuOpen"]);

const menuItems: SidebarNavItem[] = [
  { icon: "dashboard", label: "داشبورد", route: "/userPannel", iconBase: "/userPannleIcons" },
  { icon: "wallet", label: "کیف پول", route: "/dashboard/wallet", iconBase: "/userPannleIcons" },
  { icon: "orders", label: "سفارشات ها", route: "/dashboard/orders", iconBase: "/userPannleIcons" },
  { icon: "cart", label: "سبد خرید", route: "/dashboard/carts", iconBase: "/userPannleIcons" },
  { icon: "user", label: "اطلاعات کاربری", route: "/dashboard/info", iconBase: "/userPannleIcons" },
  { icon: "fav", label: "علاقه‌مندی‌ها", route: "/dashboard/fav", iconBase: "/userPannleIcons" },
  { icon: "support", label: "پشتیبانی", route: "/dashboard/support", iconBase: "/userPannleIcons" },
  { icon: "exit", label: "خروج", route: "/dashboard/exit", iconBase: "/userPannleIcons" },
];
</script>

<template>
  <SharedSidebarPanel :items="menuItems" :identity="{ name: 'نام شخص', subtitle: '09164532683' }" @navigate="emit('update:isMenuOpen', false)" />
</template>
