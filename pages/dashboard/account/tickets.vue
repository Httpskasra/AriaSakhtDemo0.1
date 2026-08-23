<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/ticketing.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "ticketing", action: "r" } });
</script>
<template><LegacyPage /></template>
