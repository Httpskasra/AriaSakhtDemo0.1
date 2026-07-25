<template>
  <USelect
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', String($event ?? ''))"
    :items="[
      { label: 'مرتب‌سازی پیش‌فرض', value: '' },
      { label: 'قیمت: صعودی', value: 'basePrice:asc' },
      { label: 'قیمت: نزولی', value: 'basePrice:desc' },
      { label: 'جدیدترین', value: 'createdAt:desc' },
      { label: 'پرتشویق', value: 'rating:desc' }
    ]"
    class="sort-filter" />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
}>();

defineEmits<{
  "update:model-value": [value: string];
}>();
</script>
