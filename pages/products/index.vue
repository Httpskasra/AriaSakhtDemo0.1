<script setup lang="ts">
const { buildParams, changePage, page, limit } = useProductSearch();
const { $axios } = useNuxtApp();

const { data: productsData, refresh } = await useAsyncData('products-list', async () => {
  const params = buildParams();
  const res = await $axios.get('/products/advanced-search', { params });
  // Simulate pagination if backend returns flat array
  return {
    items: res.data,
    total: res.data.length // Simplified for logic
  };
}, { watch: [() => useRoute().query] });

const onPageChange = (newPage: number) => {
  changePage(newPage);
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <aside class="w-full lg:w-64 shrink-0">
        <FilterSidebar />
      </aside>

      <main class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <RecordCount :total="productsData?.total || 0" />
          <SortFilter />
        </div>

        <ProductGrid :products="productsData?.items || []" />

        <div v-if="productsData?.total && productsData.total > limit" class="mt-12 flex justify-center border-t border-gray-100 pt-8">
          <UPagination
            :model-value="page"
            :total="productsData.total"
            :page-count="limit"
            @update:model-value="onPageChange"
          />
        </div>
      </main>
    </div>
  </UContainer>
</template>
