<template>
  <div class="relative group aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
    <img
      v-if="!hasError"
      :src="currentUrl"
      :alt="alt"
      class="w-full h-full object-contain p-4 cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
      @error="handleError"
      @click="isLightboxOpen = true"
    />
    
    <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8">
      <UIcon name="i-lucide-package-search" class="size-16 mb-2 opacity-50" />
      <span class="text-xs text-center font-medium">تصویر در دسترس نیست</span>
    </div>

    <!-- Zoom Overlay Hint -->
    <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
      <div class="bg-white/90 p-2 rounded-full shadow-lg">
        <UIcon name="i-lucide-zoom-in" class="size-6 text-primary" />
      </div>
    </div>

    <!-- Lightbox Modal -->
    <UModal v-model="isLightboxOpen" :ui="{ width: 'sm:max-w-3xl' }">
      <div class="p-2 bg-white rounded-lg overflow-hidden relative">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-lucide-x"
          class="absolute top-4 right-4 z-10"
          @click="isLightboxOpen = false"
        />
        <div class="flex items-center justify-center min-h-[60vh] bg-gray-50 rounded-md">
          <img :src="currentUrl" :alt="alt" class="max-w-full max-h-[85vh] object-contain" />
        </div>
        <div class="p-4 text-center">
          <h3 class="font-bold text-gray-800">{{ alt }}</h3>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Product Image'
  }
})

const hasError = ref(false)
const isLightboxOpen = ref(false)
const placeholder = 'https://picsum.photos/seed/prod/600/600'

const currentUrl = computed(() => {
  if (!props.src || hasError.value) return placeholder
  return props.src
})

const handleError = () => {
  console.warn(`[ProductImage] Failed to load image: ${props.src}`)
  hasError.value = true
}
</script>
