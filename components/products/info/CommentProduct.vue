<template>
  <div class="product-comments-panel">
    <FormComments :product-id="productId" @comment-added="refreshComments" />
    <AllComments ref="commentsRef" :product-id="productId" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import FormComments from "./FormComments.vue";
import AllComments from "./AllComments.vue";

defineProps<{
  productId: string;
}>();

const commentsRef = ref<{ refresh?: () => Promise<void> } | null>(null);
function refreshComments() {
  void commentsRef.value?.refresh?.();
}
</script>
<style scoped>
.product-comments-panel {
  width: 100%;
}
</style>
