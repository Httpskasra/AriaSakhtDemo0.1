<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });
await navigateTo("/dashboard/admin/categories", { redirectCode: 308 });
</script>

<template>
  <div aria-hidden="true" />
</template>
