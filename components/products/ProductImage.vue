<template>
  <div class="product-image">
    <img
      v-if="!hasError"
      :src="currentUrl"
      :alt="alt"
      class="product-image__source"
      @error="handleError"
      @click="isLightboxOpen = true"
    />
    
    <div v-else class="product-image__empty">
      <UIcon name="i-lucide-package-search" class="product-image__empty-icon" />
      <span>تصویر در دسترس نیست</span>
    </div>

    <!-- Zoom Overlay Hint -->
    <div class="product-image__hint" aria-hidden="true">
      <div class="product-image__hint-icon">
        <UIcon name="i-lucide-zoom-in" />
      </div>
    </div>

    <!-- Lightbox Modal -->
    <UModal v-model="isLightboxOpen" :ui="{ width: 'sm:max-w-3xl' }">
      <div class="product-image__lightbox">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          class="product-image__close"
          @click="isLightboxOpen = false"
        />
        <div class="product-image__lightbox-stage">
          <img :src="currentUrl" :alt="alt" class="product-image__lightbox-source" />
        </div>
        <div class="product-image__caption">
          <h3>{{ alt }}</h3>
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
const placeholder = '/products/building-material.jpg'

const currentUrl = computed(() => {
  if (!props.src || hasError.value) return placeholder
  return props.src
})

const handleError = () => {
  console.warn(`[ProductImage] Failed to load image: ${props.src}`)
  hasError.value = true
}
</script>

<style scoped>
.product-image { position: relative; overflow: hidden; aspect-ratio: 1; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); box-shadow: var(--shadow-raised); }
.product-image__source { width: 100%; height: 100%; padding: 1rem; cursor: zoom-in; object-fit: contain; transition: transform .5s ease; }
.product-image:hover .product-image__source { transform: scale(1.05); }
.product-image__empty { display: flex; width: 100%; height: 100%; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; padding: 2rem; color: var(--color-text-muted); background: var(--color-bg-light); text-align: center; font-size: .75rem; font-weight: 600; }
.product-image__empty-icon { width: var(--spacing-icon-hero); height: var(--spacing-icon-hero); opacity: .5; }
.product-image__hint { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; background: color-mix(in srgb, var(--color-text-heading) 5%, transparent); transition: opacity .16s ease; }
.product-image:hover .product-image__hint { opacity: 1; }
.product-image__hint-icon { display: grid; place-items: center; padding: .5rem; border-radius: var(--radius-circle); color: var(--color-brand-blue); background: color-mix(in srgb, var(--color-bg-surface) 90%, transparent); box-shadow: var(--shadow-raised); }
.product-image__lightbox { position: relative; overflow: hidden; padding: .5rem; border-radius: var(--radius-field); background: var(--color-bg-surface); }
.product-image__close { position: absolute; z-index: 10; inset-block-start: 1rem; inset-inline-end: 1rem; }
.product-image__lightbox-stage { display: flex; min-height: 60vh; align-items: center; justify-content: center; border-radius: var(--radius-compact-list-item); background: var(--color-bg-light); }
.product-image__lightbox-source { max-width: 100%; max-height: 85vh; object-fit: contain; }
.product-image__caption { padding: 1rem; text-align: center; }
.product-image__caption h3 { margin: 0; color: var(--color-text-heading); font-weight: 800; }
</style>
