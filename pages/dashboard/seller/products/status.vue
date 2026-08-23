<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/product_status.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "product_status", action: "r" } });
</script>
<template><LegacyPage /></template>
