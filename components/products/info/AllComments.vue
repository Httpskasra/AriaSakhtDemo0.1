<template>
  <div class="container">
    <Comments
      class="comment"
      v-for="comment in data.comments"
      :key="comment.sender"
      :data="comment"
    />
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
@media (max-width: 767px) {
  .container {
    width: 100%;
    margin-top: 50px;
  }
  .comment {
    margin: 0px auto;
    width: 100%;
    height: auto;
    border-radius: 15px;
    position: relative;
    margin-top: 15px;
  }
}
</style>
