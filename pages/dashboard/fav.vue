<template>
  <NuxtLayout name="dashboard">
    <div class="px-4 py-6 md:px-6">
      <FavItems />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "علاقه‌مندی‌ها",
});

definePageMeta({
  middleware: ["auth"],
});
</script>
