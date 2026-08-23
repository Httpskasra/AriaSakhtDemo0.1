<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/transporting.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "transporting", action: "r" } });
</script>
<template><LegacyPage /></template>
