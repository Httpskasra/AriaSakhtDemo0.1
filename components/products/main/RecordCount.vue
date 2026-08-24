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
  <div v-if="total > 0 || hasSearchContext" class="record-count font-num">
    <template v-if="total > 0">
      نمایش 
      <span class="record-count__value font-num">{{ start }}</span>
      تا
      <span class="record-count__value font-num">{{ end }}</span>
      از
      <span class="record-count__value font-num">{{ total }}</span>
      نتیجه
    </template>
    <template v-else-if="hasSearchContext">
      ۰ نتیجه
    </template>
  </div>
</template>

<style scoped>
.record-count { color: var(--color-text-muted); font-size: .875rem; }
.record-count__value { color: var(--color-text-heading); font-weight: 700; }
</style>
