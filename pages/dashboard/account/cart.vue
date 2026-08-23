<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/carts.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "carts", action: "r" } });
</script>
<template><LegacyPage /></template>
