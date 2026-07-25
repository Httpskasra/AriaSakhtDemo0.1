<template>
  <div dir="rtl">
    <NuxtLoadingIndicator color="var(--color-brand-blue)" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UToaster />
  </div>
</template>

<script setup>
// Global head configuration is defined in nuxt.config.ts so the brand template has one source of truth.
</script>
