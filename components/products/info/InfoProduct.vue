<template>
  <div class="product-description">
    <p class="product-description__text">{{ props.data.description || "توضیحی برای این محصول ثبت نشده است." }}</p>
  </div>
</template>
<script setup lang="ts">
import type { Product } from "~/types/product";
const props = defineProps<{
  data: Product;
}>();
</script>
<style scoped>
.product-description {
  width: 100%;
}
.product-description__text {
  margin: 0;
  padding: 1rem;
  font-size: 1rem;
  line-height: var(--line-height-long-form);
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--color-text-body);
  overflow-wrap: anywhere;
}
@media (min-width: 768px) and (max-width: 1024px) {
  .product-description__text {
    padding: 1rem;
    font-size: .9rem;
  }
}

@media (max-width: 767px) {
  .product-description__text {
    padding: .75rem;
    font-size: .85rem;
  }
}
</style>
