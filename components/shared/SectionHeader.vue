<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="mb-10">
    <h2 class="text-3xl font-black text-slate-900 mb-2">{{ title }}</h2>
    <div v-if="subtitle" class="flex items-center gap-4">
      <span class="h-px bg-slate-200 w-12 hidden sm:block"></span>
      <p class="text-slate-500 font-medium">{{ subtitle }}</p>
    </div>
  </div>
</template>