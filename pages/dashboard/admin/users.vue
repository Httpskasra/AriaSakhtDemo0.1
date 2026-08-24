<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/users.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "all", action: "m" } });
</script>
<template><LegacyPage /></template>
