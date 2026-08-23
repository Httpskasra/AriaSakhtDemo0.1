<template>
  <div class="product-description">
    <!-- <ul>
      <li><span class="title">ابعاد</span><span class="val">14*14</span></li>
      <li><span class="title">ابعاد</span><span class="val">14*14</span></li>
      <li><span class="title">ابعاد</span><span class="val">14*14</span></li>
      <li><span class="title">ابعاد</span><span class="val">14*14</span></li>
      <li><span class="title">ابعاد</span><span class="val">14*14</span></li>
    </ul> -->
    <p>{{ data.description }}</p>
  </div>
</template>
<script setup lang="ts">
import type { Product } from "~/types/product";
const prop = defineProps<{
  data: Product;
}>();
</script>
<style scoped>
.product-description {
  width: 100%;
}
p {
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
  p {
    padding: 1rem;
    font-size: .9rem;
  }
}

@media (max-width: 767px) {
  p {
    padding: .75rem;
    font-size: .85rem;
  }
}
</style>
