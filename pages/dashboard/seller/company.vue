<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/companies.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "companies", action: "r" } });
</script>
<template><LegacyPage /></template>
