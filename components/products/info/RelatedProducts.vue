<script setup lang="ts">
const props = defineProps<{
  categoryIds: string[];
  currentProductId: string;
}>();

const { $axios } = useNuxtApp();

const { data: related } = await useAsyncData(`related-${props.currentProductId}`, async () => {
  if (!props.categoryIds?.length) return [];
  
  const res = await $axios.get('/products/advanced-search', {
    params: {
      categoryIds: props.categoryIds,
      limit: 4
    }
  });
  
  return (res.data || []).filter((p: any) => (p.id || p._id) !== props.currentProductId);
});
</script>

<template>
  <div v-if="related?.length" class="mt-16">
    <div class="flex items-center gap-2 mb-6">
      <div class="h-8 w-1 bg-primary rounded-full"></div>
      <h3 class="text-xl font-bold text-gray-800">محصولات مشابه</h3>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Product v-for="item in related" :key="item.id" :product="item" />
    </div>
  </div>
</template>
