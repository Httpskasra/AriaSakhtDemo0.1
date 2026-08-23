<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/fav.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "products", action: "r" } });
</script>
<template><LegacyPage /></template>
