<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader v-if="showPublicChrome" />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer v-if="showPublicChrome" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

// Dashboard pages already render their own dashboard layout. The public
// company-registration page intentionally keeps the public header/footer.
const showPublicChrome = computed(() => (
  !route.path.startsWith('/dashboard') || route.path === '/dashboard/company/register'
));
</script>
