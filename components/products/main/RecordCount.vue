<template>
  <p class="text-gray-600">{{ count }} محصول یافت شد</p>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    required: true,
  },
});
</script>
