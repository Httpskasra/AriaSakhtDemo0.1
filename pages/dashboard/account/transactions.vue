<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/transaction.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "transaction", action: "r" } });
</script>
<template><LegacyPage /></template>
