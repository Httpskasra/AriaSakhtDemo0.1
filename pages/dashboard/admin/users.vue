<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/users.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "users", action: "m" } });
</script>
<template><LegacyPage /></template>
