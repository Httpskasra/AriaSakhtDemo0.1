<template>
  <div class="container">
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
.container {
  width: 100%;
}
p {
  padding: 10px;
  padding-top: 60px;
  font-size: 18px;
  line-height: var(--line-height-long-form);
  font-family: var(--font-yekan);
  font-weight: 600;
}
@media (min-width: 768px) and (max-width: 1024px) {
  p {
    padding: 16px;
    padding-top: 40px;
    font-size: 14px;
    line-height: var(--line-height-long-form);
  }
}

@media (max-width: 767px) {
  p {
    padding: 10px;
    font-size: 8px;
    line-height: var(--line-height-long-form);
  }
}
</style>
