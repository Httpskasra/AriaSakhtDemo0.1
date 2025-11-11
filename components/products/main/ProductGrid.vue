<template>
  <div class="flex justify-center w-full">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 h-full">
      <SingleProduct
        v-for="product in products"
        :key="product.id"
        :productId="product.id" />
    </div>
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
