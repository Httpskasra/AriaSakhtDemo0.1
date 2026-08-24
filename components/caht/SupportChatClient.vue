<template>
  <div class="support-chat-launcher">
    <UButton to="/dashboard/account/tickets" color="primary" size="lg" icon="i-lucide-message-circle" aria-label="ارسال تیکت پشتیبانی">
      پشتیبانی
    </UButton>
  </div>
</template>

<script setup lang="ts">
// No chat transport exists in the verified frontend/backend contracts.
// This deliberately links to ticketing instead of presenting a fake chat.
</script>

<style scoped>
.support-chat-launcher { position: fixed; z-index: 40; right: 1rem; bottom: 1.5rem; }
.support-chat-launcher :deep(button), .support-chat-launcher :deep(a) { box-shadow: var(--shadow-raised); }
@media (max-width: 640px) { .support-chat-launcher { bottom: 5.5rem; } }
</style>
