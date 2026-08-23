<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/orders.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "orders", action: "r" } });
</script>
<template><LegacyPage /></template>
