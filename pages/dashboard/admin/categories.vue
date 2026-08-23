<script setup lang="ts">
import CategoriesAdminPage from "~/pages/dashboard/categories.vue";

definePageMeta({
  layout: "panel",
  middleware: ["auth", "permission"],
  permission: { resource: "categories", action: "r" },
});
</script>

<template><CategoriesAdminPage /></template>
