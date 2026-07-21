<script setup lang="ts">
const props = defineProps<{
  total: number;
  page: number;
  limit: number;
}>();

const start = computed(() => (props.page - 1) * props.limit + 1);
const end = computed(() => Math.min(props.page * props.limit, props.total));
</script>

<template>
  <div class="text-sm text-gray-500 font-num">
    <template v-if="total > 0">
      نمایش 
      <span class="font-iran-yekan-DemiBold text-blue-dark">{{ start }}</span>
      تا
      <span class="font-iran-yekan-DemiBold text-blue-dark">{{ end }}</span>
      از
      <span class="font-iran-yekan-DemiBold text-blue-dark">{{ total }}</span>
      نتیجه
    </template>
    <template v-else>
      نتیجه‌ای یافت نشد
    </template>
  </div>
</template>
