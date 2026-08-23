<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { advancedSearchProducts } from '~/services/productService';
import { useCategories } from '~/composables/useCategories';
import { getCategoryId } from '~/services/categories';

const { buildParams, changePage, page, limit, sortOption, searchQuery, minPrice, maxPrice, companyName, categoryIds, onFiltersFromSidebar, clearAllFilters, updateQueryString, onSortChange } = useProductSearch();
const { categories: availableCategories, load: loadCategories } = useCategories();
await loadCategories().catch(() => undefined);
const mobileFiltersOpen = ref(false);
const productsLoadError = ref<string | null>(null);
const searchInput = ref(searchQuery.value);
let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, value => { searchInput.value = value; });
watch(searchInput, value => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => updateQueryString({ query: value.trim() }), 300);
});
onBeforeUnmount(() => { if (searchTimer) clearTimeout(searchTimer); });

const { data: productsData, pending, error, refresh } = await useAsyncData('products-list', async () => {
  productsLoadError.value = null;
  try {
    return (await advancedSearchProducts(buildParams())).data;
  } catch (cause) {
    console.error('[ProductsPage] failed to load products', cause);
    productsLoadError.value = 'دریافت محصولات با مشکل مواجه شد. لطفاً دوباره تلاش کنید.';
    return { items: [], total: 0, page: page.value, limit: limit.value };
  }
}, { watch: [() => useRoute().query], dedupe: 'cancel' });

const activeFilterCount = computed(() => [minPrice.value, maxPrice.value, companyName.value, ...categoryIds.value].filter(Boolean).length);
const categoryLabel = (categoryId: string) => {
  const category = availableCategories.value.find(item => getCategoryId(item) === categoryId);
  return `دسته: ${category?.name || categoryId}`;
};
const activeFilterLabels = computed(() => [
  minPrice.value ? `از ${minPrice.value.toLocaleString()} ریال` : '',
  maxPrice.value ? `تا ${maxPrice.value.toLocaleString()} ریال` : '',
  companyName.value ? `تأمین‌کننده: ${companyName.value}` : '',
  ...categoryIds.value.map(categoryLabel),
].filter(Boolean));

const clearSearch = () => updateQueryString({ query: '' });
const clearMaxPrice = () => updateQueryString({ maxPrice: null });
const clearMinPrice = () => updateQueryString({ minPrice: null });
const clearCompanyName = () => updateQueryString({ companyName: null });
const removeCategory = (categoryId: string) => updateQueryString({ categoryIds: categoryIds.value.filter(id => id !== categoryId) });
const applyMobileFilters = (filters: { minPrice?: number; maxPrice?: number; companyName?: string; categoryIds?: string[] }) => {
  onFiltersFromSidebar(filters);
  mobileFiltersOpen.value = false;
};
const clearMobileFilters = () => {
  clearAllFilters();
  mobileFiltersOpen.value = false;
};

const onPageChange = (newPage: number) => {
  changePage(newPage);
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="products-page">
    <PublicPageHeader
      icon="i-lucide-factory"
      title="فروشگاه تجاریس"
      description="محصول موردنیاز کسب‌وکار خود را با فیلترهای دقیق، مقایسه آسان و خرید مطمئن پیدا کنید."
    />
    <UContainer class="page-container products-page__content py-5 sm:py-8">

    <div class="mobile-filter-trigger mb-4 lg:hidden">
      <UButton block variant="soft" icon="i-lucide-sliders-horizontal" @click="mobileFiltersOpen = true">
        فیلترها<span v-if="activeFilterCount" class="filter-count">{{ activeFilterCount }}</span>
      </UButton>
    </div>

    <div class="results-layout">
      <aside class="results-sidebar">
        <FilterSidebar
          input-id-prefix="desktop-products"
          :initialMinPrice="minPrice"
          :initialMaxPrice="maxPrice"
          :initialCompanyName="companyName"
          :initialCategoryIds="categoryIds"
          @update:filters="onFiltersFromSidebar"
          @clear="clearAllFilters"
        />
      </aside>

      <main class="results-main min-w-0">
        <div class="results-toolbar mb-4 sm:mb-6">
          <div class="results-toolbar__top">
            <RecordCount :total="productsData?.total || 0" :page="page" :limit="limit" :has-search-context="Boolean(searchQuery || activeFilterLabels.length)" />
            <div class="results-toolbar__sort">
              <SortFilter :model-value="sortOption" :disabled="pending || !(productsData?.total)" @update:model-value="onSortChange" />
            </div>
          </div>
          <div class="results-toolbar__search">
            <label for="products-inline-search" class="sr-only">جستجوی درون نتایج</label>
            <UInput
              id="products-inline-search"
              v-model="searchInput"
              aria-label="جستجوی درون نتایج"
              placeholder="جستجو در محصولات صنعتی"
              class="results-search"
              size="lg"
            >
              <template #leading>
                <UIcon name="i-lucide-search" aria-hidden="true" />
              </template>
            </UInput>
          </div>
        </div>

        <div v-if="activeFilterLabels.length || searchQuery" class="active-filters mb-4" aria-label="فیلترهای فعال">
          <span class="text-xs font-semibold text-slate-500">فیلترهای فعال:</span>
          <button v-if="searchQuery" type="button" class="filter-chip" @click="clearSearch">جستجو: {{ searchQuery }} <UIcon name="i-lucide-x" /></button>
          <button v-if="minPrice" type="button" class="filter-chip" @click="clearMinPrice">از {{ minPrice.toLocaleString() }} ریال <UIcon name="i-lucide-x" /></button>
          <button v-if="maxPrice" type="button" class="filter-chip" @click="clearMaxPrice">تا {{ maxPrice.toLocaleString() }} ریال <UIcon name="i-lucide-x" /></button>
          <button v-if="companyName" type="button" class="filter-chip" @click="clearCompanyName">تأمین‌کننده: {{ companyName }} <UIcon name="i-lucide-x" /></button>
          <button v-for="categoryId in categoryIds" :key="categoryId" type="button" class="filter-chip" @click="removeCategory(categoryId)">
            {{ categoryLabel(categoryId) }} <UIcon name="i-lucide-x" />
          </button>
          <button type="button" class="clear-filters-link" @click="clearAllFilters">پاک کردن همه</button>
        </div>

        <ProductGrid
          :products="productsData?.items || []"
          :loading="pending"
          :error="Boolean(error) || Boolean(productsLoadError)"
          :has-active-filters="activeFilterLabels.length > 0"
          :has-search-query="Boolean(searchQuery)"
          @retry="refresh"
          @clear-filters="clearAllFilters"
          @clear-search="clearSearch"
        />

        <p v-if="productsLoadError" class="products-load-error" role="alert">
          {{ productsLoadError }}
        </p>

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
    <UModal v-model:open="mobileFiltersOpen" title="فیلترهای جستجو">
      <template #body>
        <div class="p-4">
          <FilterSidebar
            input-id-prefix="mobile-products"
            :initialMinPrice="minPrice"
            :initialMaxPrice="maxPrice"
            :initialCompanyName="companyName"
            :initialCategoryIds="categoryIds"
            @update:filters="applyMobileFilters"
            @clear="clearMobileFilters"
          />
        </div>
      </template>
    </UModal>
    </UContainer>
  </div>
</template>

<style scoped>
.products-page__content { margin-inline: auto; }
.page-container { width: 100%; max-width: 90rem; padding-inline: 1.5rem; }
.results-layout { display: grid; grid-template-columns: 17.5rem minmax(0, 1fr); gap: 1.5rem; align-items: start; }
.results-sidebar { display: none; grid-column: 1; min-width: 0; }
.results-main { grid-column: 2; min-width: 0; width: 100%; }
.results-toolbar { display: grid; gap: .875rem; padding: .875rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); }
.results-toolbar__top { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 1rem; min-height: 2.5rem; }
.results-toolbar__sort { display: flex; align-items: center; }
.results-toolbar__search { width: 100%; }
.results-search { width: 100%; }
:deep(.results-search input) { min-height: 2.75rem; padding-inline-start: 2.75rem; padding-inline-end: .875rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-surface); }
:deep(.results-search > span:first-of-type) { inset-inline-start: .875rem; color: var(--color-text-muted); pointer-events: none; }
:deep(.results-search input:focus-visible) { border-color: var(--color-brand-blue); outline: none; box-shadow: var(--focus-ring); }
.active-filters { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.filter-chip { display: inline-flex; align-items: center; gap: .375rem; min-height: 2rem; padding: .25rem .625rem; border: 1px solid var(--color-info-border); border-radius: var(--radius-pill); background: var(--color-info-bg); color: var(--color-info-fg); font-size: .75rem; }
.filter-chip button, button.filter-chip { cursor: pointer; }
.clear-filters-link { min-height: 2rem; color: var(--color-text-body); font-size: .75rem; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
.filter-count { display: inline-grid; place-items: center; min-width: 1.35rem; height: 1.35rem; margin-inline-start: .375rem; border-radius: var(--radius-pill); background: var(--color-brand-blue); color: var(--color-bg-surface); font-size: .7rem; }
.products-load-error { margin-top: .75rem; color: var(--color-danger-fg); font-size: .8125rem; text-align: center; }
@media (max-width: 639px) {
  .page-container { padding-inline: 1rem; }
  .results-layout { display: block; }
  .results-toolbar__top { grid-template-columns: 1fr; align-items: stretch; }
  .results-toolbar__sort { width: 100%; }
  .results-toolbar__search { width: 100%; }
}
@media (min-width: 640px) and (max-width: 1023px) {
  .results-layout { display: block; }
}
@media (min-width: 1024px) {
  .results-sidebar { display: block; }
}
</style>
