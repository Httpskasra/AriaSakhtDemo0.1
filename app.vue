<template>
  <div dir="rtl">
    <NuxtLoadingIndicator color="#1673ff" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup>
// Global initialization and meta tags
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - تجاریس` : 'تجاریس - پلتفرم صنعتی بیست‌وبی';
  }
})
</script>