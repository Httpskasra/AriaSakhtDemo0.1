<script setup lang="ts">
import LegacyPage from "~/pages/dashboard/profile.vue";
definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "profile", action: "r" } });
</script>
<template><LegacyPage /></template>
