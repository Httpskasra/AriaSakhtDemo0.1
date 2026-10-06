<template>
  <div dir="rtl">
    <NuxtLoadingIndicator color="var(--color-brand-blue)" :height="3" />
    <NuxtLayout>
      <!-- A full path key guarantees that panel pages remount on every
           sidebar navigation and re-run their data loaders without a manual
           refresh. -->
      <NuxtPage :page-key="route.fullPath" />
    </NuxtLayout>
    <!-- Authentication modal has one global owner across desktop and mobile headers. -->
    <ModalWrapper v-if="authStep" />
    <!-- Keep every global notification in one predictable, readable RTL surface. -->
    <UToaster
      position="top-right"
      :expand="true"
      :ui="{
        viewport: 'tejaris-toaster__viewport',
        base: 'tejaris-toaster__base'
      }"
    />
  </div>
</template>

<script setup>
// Global head configuration is defined in nuxt.config.ts so the brand template has one source of truth.
const { authStep } = useAuthStep();
const route = useRoute();
</script>
