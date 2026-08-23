<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/products.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "products", action: "r" } });
</script>
<template><LegacyPage seller-only /></template>
