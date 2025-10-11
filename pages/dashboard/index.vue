<!-- pages/dashboard/carts.vue -->
<script setup lang="ts">
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});
</script>

<template>
  <NuxtLayout name="dashboard"> kasra </NuxtLayout>
</template>
