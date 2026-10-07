<template>
  <div class="product-specifications">
    <p v-if="!attributes.length" class="product-specifications__empty">مشخصات فنی برای این محصول ثبت نشده است.</p>
    <dl v-else class="product-specifications__grid">
      <div v-for="([key, value]) in attributes" :key="key" class="product-specifications__item">
        <dt>{{ key }}</dt>
        <dd>{{ value }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/types/product";

const props = defineProps<{ data: Product }>();
const attributes = computed(() => Object.entries(props.data.attributes || {}));
</script>

<style scoped>
.product-specifications { width: 100%; }
.product-specifications__empty { margin: 0; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); color: var(--color-text-muted); line-height: 1.9; }
.product-specifications__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem 1.25rem; margin: 0; }
.product-specifications__item { display: flex; justify-content: space-between; gap: 1rem; padding: .75rem; border-bottom: 1px solid var(--color-border); }
.product-specifications dt { color: var(--color-text-muted); font-size: .8rem; }
.product-specifications dd { margin: 0; color: var(--color-text-heading); font-size: .85rem; font-weight: 700; overflow-wrap: anywhere; text-align: end; }
@media (max-width: 640px) { .product-specifications__grid { grid-template-columns: 1fr; } }
</style>
