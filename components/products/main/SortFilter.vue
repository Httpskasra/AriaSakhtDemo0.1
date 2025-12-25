<template>
  <select
    :value="modelValue"
    @change="(e) => $emit('update:model-value', (e.target as HTMLSelectElement).value)"
    class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm md:text-base">
    <option value="">مرتب‌سازی پیش‌فرض</option>
    <option value="basePrice:asc">قیمت: صعودی</option>
    <option value="basePrice:desc">قیمت: نزولی</option>
    <option value="createdAt:desc">جدیدترین</option>
    <option value="rating:desc">پرتشویق</option>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
}>();

defineEmits<{
  "update:model-value": [value: string];
}>();
</script>
