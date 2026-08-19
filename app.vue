<template>
  <div dir="rtl">
    <NuxtLoadingIndicator color="var(--color-brand-blue)" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- Authentication modal has one global owner across desktop and mobile headers. -->
    <ModalWrapper v-if="authStep" />
    <UToaster />
  </div>
</template>

<script setup>
// Global head configuration is defined in nuxt.config.ts so the brand template has one source of truth.
const { authStep } = useAuthStep();
</script>
