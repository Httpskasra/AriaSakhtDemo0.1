<script setup lang="ts">
import LegacyProductsPage from "~/pages/dashboard/products.vue";

definePageMeta({
  layout: "panel",
  middleware: ["auth", "permission"],
  permission: { resource: "products", action: "c" },
});
</script>

<template>
  <LegacyProductsPage editor-only />
</template>
