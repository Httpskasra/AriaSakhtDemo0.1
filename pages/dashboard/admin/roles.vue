<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/roles.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "all", action: "m" } });
</script>
<template><LegacyPage /></template>
