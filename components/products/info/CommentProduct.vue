<template>
  <div class="product-comments-panel">
    <FormComments :product-id="productId" />
    <AllComments :product-id="productId" />
  </div>
</template>
<script setup lang="ts">
import FormComments from "./FormComments.vue";
import AllComments from "./AllComments.vue";

defineProps<{
  productId: string;
}>();
</script>
<style scoped>
.product-comments-panel {
  width: 100%;
}
</style>
