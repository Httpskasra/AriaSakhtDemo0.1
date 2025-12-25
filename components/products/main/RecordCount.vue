<template>
  <p class="text-gray-600 text-sm md:text-base">{{ count }} محصول یافت شد</p>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    required: true,
  },
});
</script>
