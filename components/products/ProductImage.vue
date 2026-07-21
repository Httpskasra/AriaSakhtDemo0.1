<template>
  <div class="relative overflow-hidden bg-gray-100 rounded-lg aspect-square group">
    <NuxtImg
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
      @error="handleError"
      loading="lazy"
    />
    <div v-else class="flex items-center justify-center w-full h-full bg-gray-200">
      <UIcon name="i-lucide-image" class="size-12 text-gray-400" />
    </div>
    
    <!-- Badge for Out of Stock -->
    <div v-if="outOfStock" class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
      <span class="px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-full shadow-lg">
        ناموجود
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  src?: string;
  alt?: string;
  outOfStock?: boolean;
}>();

const hasError = ref(false);

const handleError = () => {
  hasError.value = true;
};
</script>
