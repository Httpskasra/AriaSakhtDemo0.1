<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/roles.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "users", action: "m" } });
</script>
<template><LegacyPage /></template>
