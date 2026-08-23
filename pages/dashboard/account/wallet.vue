<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/wallets.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "wallets", action: "r" } });
</script>
<template><LegacyPage /></template>
