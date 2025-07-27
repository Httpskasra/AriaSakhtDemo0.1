<template>
  <select
    v-model="sortOption"
    class="border rounded-lg px-3 py-2"
    @change="emitSort"
  >
    <option value="default">مرتب‌سازی پیش‌فرض</option>
    <option value="price-asc">قیمت: صعودی</option>
    <option value="price-desc">قیمت: نزولی</option>
  </select>
</template>

<script setup>
import { ref } from "vue";

const sortOption = ref("default");

const emitSort = () => {
  // Emit sort option to parent if needed
};
</script>
