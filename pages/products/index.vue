<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "~/types/product";
import {
  advancedSearchProducts,
  type PaginatedResponse,
} from "~/services/productService";
import { useProductSearch } from "~/composables/useProductSearch";

const {
  page,
  limit,
  sortOption,
  searchQuery,
  maxPrice,
  companyName,
  categoryIds,
  buildParams,
  onFiltersFromSidebar,
  onSortChange,
  changePage,
} = useProductSearch();

/* ---------- وضعیت UI ---------- */
const isSidebarOpen = ref(false);

/* ---------- گرفتن داده از بک‌اند با useAsyncData ---------- */
const { data, pending, error, refresh } = await useAsyncData<
  PaginatedResponse<Product>
>(
  "products-advanced-search",
  async () => {
    const response = await advancedSearchProducts(buildParams());
    return response.data;
  },
  {
    watch: [page, searchQuery, maxPrice, companyName, categoryIds, sortOption],
  }
);

const products = computed<Product[]>(() => data.value?.items ?? []);
const total = computed<number>(() => data.value?.total ?? 0);
const totalPages = computed(() =>
  total.value && limit.value ? Math.ceil(total.value / limit.value) : 1
);

/* ---------- رویدادهای UI ---------- */
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <NuxtLayout>
    <div class="w-full mx-auto px-4 sm:px-8">
      <!-- نوار بالا: Sort + تعداد رکورد + دکمه باز کردن سایدبار در موبایل -->
      <div
        class="flex justify-between items-center w-full md:w-1/2 mx-auto mb-4">
        <div class="flex items-center space-x-6 rtl:space-x-reverse">
          <!-- SortFilter -->
          <SortFilter
            :model-value="sortOption"
            @update:model-value="onSortChange" />
          <RecordCount :count="total" />
        </div>
        <button
          @click="toggleSidebar"
          class="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg">
          فیلترها
        </button>
      </div>

      <div class="flex w-full flex-col md:flex-row relative">
        <!-- سایدبار فیلترها -->
        <div class="md:w-1/3 lg:w-1/4 w-full md:static">
          <!-- بک‌دراپ موبایل -->
          <div
            v-if="isSidebarOpen"
            class="fixed inset-0 bg-black/40 z-30 md:hidden"
            @click="toggleSidebar"></div>

          <!-- خود سایدبار -->
          <div
            class="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white z-40 transform transition-transform duration-300 md:static md:h-auto md:w-full md:transform-none md:z-auto shadow-md md:shadow-none"
            :class="{
              'translate-x-0': isSidebarOpen,
              'translate-x-full md:translate-x-0': !isSidebarOpen,
            }">
            <FilterSidebar
              @apply-filters="
                (filters) => {
                  onFiltersFromSidebar(filters);
                  isSidebarOpen = false;
                }
              " />
          </div>
        </div>

        <!-- لیست محصولات -->
        <div class="pt-20 md:pt-0 flex-1 w-full mx-auto">
          <div v-if="pending" class="py-10 text-center text-gray-600">
            در حال بارگذاری محصولات...
          </div>

          <div v-else>
            <!-- هدر نتایج + صفحه‌بندی -->
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">تعداد نتایج: {{ total }}</h2>

              <div class="flex items-center gap-2 text-sm">
                <button
                  class="px-3 py-1 border rounded disabled:opacity-50"
                  :disabled="page <= 1"
                  @click="changePage(page - 1)">
                  قبلی
                </button>
                <span>صفحه {{ page }} از {{ totalPages }}</span>
                <button
                  class="px-3 py-1 border rounded disabled:opacity-50"
                  :disabled="page >= totalPages"
                  @click="changePage(page + 1)">
                  بعدی
                </button>
              </div>
            </div>

            <div v-if="products.length">
              <ProductGrid :products="products" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              محصولی با این فیلترها یافت نشد.
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
