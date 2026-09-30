<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/products.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "products", action: "r" } });
const route = useRoute();
const isProductsListRoute = computed(() => route.path.replace(/\/+$/, "") === "/dashboard/seller/products");
</script>
<template>
  <NuxtPage v-if="!isProductsListRoute" />
  <LegacyPage v-else seller-only />
</template>
