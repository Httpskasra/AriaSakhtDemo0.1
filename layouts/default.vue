<script setup lang="ts">
// Common layout for the marketplace
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header Component (from components/Header/Header.vue) -->
    <Header />

    <main class="flex-grow container mx-auto px-4 py-6">
      <slot />
    </main>

    <!-- Footer Component (from components/footer/Footer.vue) -->
    <Footer />
    
    <!-- Support Chat (from components/caht/SupportChatClient.vue) -->
    <SupportChatClient />
  </div>
</template>
