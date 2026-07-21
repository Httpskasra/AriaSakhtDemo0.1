<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main class="flex-grow">
      <NuxtPage />
    </main>
    <Footer />
    <UNotifications />
    <SupportChatClient />
  </div>
</template>

<script setup>
// Main application layout assembly
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
