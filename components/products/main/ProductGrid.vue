<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-8 h-full">
    <SingleProduct
      v-for="product in products"
      :key="product.id"
      :product-id="product.id" />
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>
