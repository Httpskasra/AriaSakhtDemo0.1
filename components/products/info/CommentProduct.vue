<template>
  <div class="container">
    <FormComments />
    <AllComments :data="data" />
  </div>
</template>
<script setup lang="ts">
import type { Product } from "~/types/product";
const props = defineProps<{
  data: Product;
}>();
</script>
<style scoped>
.container {
  width: 100%;
}
</style>
