<template>
  <div class="container">
    <FormComments :data="data" />
    <AllComments :data="data" />
  </div>
</template>
<script setup lang="ts">
import type { Product } from "~/types/product";
import FormComments from "./FormComments.vue";
import AllComments from "./AllComments.vue";

const props = defineProps<{
  data: Product;
}>();
</script>
<style scoped>
.container {
  width: 100%;
}
</style>
