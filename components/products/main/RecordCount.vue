<script setup lang="ts">
const props = defineProps<{
  total: number;
  page: number;
  limit: number;
  hasSearchContext?: boolean;
}>();

const start = computed(() => (props.page - 1) * props.limit + 1);
const end = computed(() => Math.min(props.page * props.limit, props.total));
</script>

<template>
  <div v-if="total > 0 || hasSearchContext" class="text-sm text-gray-500 font-num">
    <template v-if="total > 0">
      نمایش 
      <span class="font-yekan font-semibold text-blue-dark">{{ start }}</span>
      تا
      <span class="font-yekan font-semibold text-blue-dark">{{ end }}</span>
      از
      <span class="font-yekan font-semibold text-blue-dark">{{ total }}</span>
      نتیجه
    </template>
    <template v-else-if="hasSearchContext">
      ۰ نتیجه
    </template>
  </div>
</template>
