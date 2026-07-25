<script setup lang="ts">
import { advancedSearchProducts } from '~/services/productService';

const { buildParams, changePage, page, limit, maxPrice, companyName, categoryIds, onFiltersFromSidebar, clearAllFilters } = useProductSearch();

const { data: productsData, pending, refresh } = await useAsyncData('products-list', async () => {
  return (await advancedSearchProducts(buildParams())).data;
}, { watch: [() => useRoute().query] });

const onPageChange = (newPage: number) => {
  changePage(newPage);
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <aside class="w-full lg:w-64 shrink-0">
        <FilterSidebar
          :initialMaxPrice="maxPrice"
          :initialCompanyName="companyName"
          :initialCategoryIds="categoryIds"
          @update:filters="onFiltersFromSidebar"
          @clear="clearAllFilters"
        />
      </aside>

      <main class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <RecordCount :total="productsData?.total || 0" :page="page" :limit="limit" />
          <SortFilter />
        </div>

        <ProductGrid :products="productsData?.items || []" :loading="pending" />

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
