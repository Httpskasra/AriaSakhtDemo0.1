<template>
  <div class="app-container min-h-screen flex flex-col font-yekan">
    <UApp>
      <Header />
      
      <main class="flex-grow">
        <NuxtPage />
      </main>

      <Footer />
      
      <!-- Persistent Support Chat if authenticated -->
      <SupportChatClient v-if="isAuthenticated" />
      
      <UNotifications />
    </UApp>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUser } from '~/composables/useUser';

const { fetchUser, isAuthenticated } = useUser();

// F3 - Ensure user state is hydrated on initial load regardless of route
onMounted(async () => {
  await fetchUser();
});
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
