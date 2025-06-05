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
  line-height: 38px;
  font-family: "iran-yekan-DemiBold";
}
@media (max-width: 767px) {
  p {
    padding: 10px;
    font-size: 8px;
    line-height: 25px;
  }
}
</style>
