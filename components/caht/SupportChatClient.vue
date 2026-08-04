<template>
  <div class="fixed bottom-[5.5rem] md:bottom-6 right-4 z-40">
    <UButton to="/dashboard/ticketing" color="primary" size="lg" icon="i-lucide-message-circle" class="shadow-lg" aria-label="ارسال تیکت پشتیبانی">
      پشتیبانی
    </UButton>
  </div>
</template>

<script setup lang="ts">
// No chat transport exists in the verified frontend/backend contracts.
// This deliberately links to ticketing instead of presenting a fake chat.
</script>
