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
  { icon: "dashboard", label: "داشبورد", route: "/userAdmin", iconBase: "/adminPannleIcons" },
  { icon: "finance", label: "گزارش مالی", route: "/dashboard/finance", iconBase: "/adminPannleIcons" },
  { icon: "orders", label: "سفارش ها", route: "/dashboard/orders", iconBase: "/adminPannleIcons" },
  { icon: "products", label: "محصولات", route: "/dashboard/products", iconBase: "/adminPannleIcons" },
  { icon: "user", label: "اطلاعات  شرکت", route: "/dashboard/info", iconBase: "/adminPannleIcons" },
  { icon: "support", label: "پشتیبانی", route: "/dashboard/support", iconBase: "/adminPannleIcons" },
  { icon: "exit", label: "خروج", route: "/dashboard/exit", iconBase: "/adminPannleIcons" },
];
</script>

<template>
  <SharedSidebarPanel :items="menuItems" :identity="{ name: 'نام شرکت', subtitle: '09164532683' }" @navigate="emit('update:isMenuOpen', false)" />
</template>
