<template>
  <NuxtLayout>
    <div class="w-full mx-auto px-4 sm:px-8">
      <!-- نوار بالا: Sort + تعداد رکورد + دکمه باز کردن سایدبار در موبایل -->
      <div
        class="flex justify-between items-center w-full md:w-1/2 mx-auto mb-4">
        <div class="flex items-center space-x-6 rtl:space-x-reverse">
          <!-- فرض: SortFilter با v-model کار می‌کند -->
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
            <FilterSidebar @apply-filters="onFiltersFromSidebar" />
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

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "#app";
import type { Product } from "~/types/product";
import {
  advancedSearchProducts,
  type AdvancedSearchParams,
  type PaginatedResponse,
} from "~/services/productService";

const route = useRoute();
const router = useRouter();

/* ---------- وضعیت UI ---------- */
const isSidebarOpen = ref(false);

/* ---------- محاسبه مقادیر از query string ---------- */
const page = computed(() => Number(route.query.page || 1));
const limit = computed(() => Number(route.query.limit || 12));
const sortOption = computed(() => (route.query.sort as string) || "");
const searchQuery = computed(() => (route.query.query as string) || "");
const maxPrice = computed(() =>
  route.query.maxPrice ? Number(route.query.maxPrice) : undefined
);
const companyName = computed(() => (route.query.companyName as string) || "");
const categoryIds = computed(() => {
  const cat = route.query.categoryIds;
  if (Array.isArray(cat)) return cat as string[];
  return cat ? [cat as string] : [];
});

/* ---------- ساخت پارامتر برای advanced-search ---------- */
const buildParams = (): AdvancedSearchParams => {
  const params: AdvancedSearchParams = {
    page: page.value,
    limit: limit.value,
  };

  if (searchQuery.value) params.query = searchQuery.value;
  if (maxPrice.value) params.maxPrice = maxPrice.value;
  if (companyName.value) params.companyName = companyName.value;
  if (categoryIds.value.length > 0) params.categoryIds = categoryIds.value;
  if (sortOption.value) params.sort = sortOption.value;

  return params;
};

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

/* ---------- تابع برای آپدیت query string ---------- */
const updateQueryString = (newParams: Record<string, any> = {}) => {
  const query: Record<string, any> = {};

  // جستجو
  if (newParams.query !== undefined) {
    if (newParams.query) query.query = newParams.query;
  } else if (searchQuery.value) {
    query.query = searchQuery.value;
  }

  // قیمت
  if (newParams.maxPrice !== undefined) {
    if (newParams.maxPrice) query.maxPrice = newParams.maxPrice;
  } else if (maxPrice.value) {
    query.maxPrice = maxPrice.value;
  }

  // شرکت
  if (newParams.companyName !== undefined) {
    if (newParams.companyName) query.companyName = newParams.companyName;
  } else if (companyName.value) {
    query.companyName = companyName.value;
  }

  // دسته‌بندی
  if (newParams.categoryIds !== undefined) {
    if (newParams.categoryIds && newParams.categoryIds.length > 0) {
      query.categoryIds = newParams.categoryIds;
    }
  } else if (categoryIds.value.length > 0) {
    query.categoryIds = categoryIds.value;
  }

  // سورت
  if (newParams.sort !== undefined) {
    if (newParams.sort) query.sort = newParams.sort;
  } else if (sortOption.value) {
    query.sort = sortOption.value;
  }

  // صفحه (پیش‌فرض صفحه 1 هنگام تغییر فیلترها)
  query.page = newParams.page ?? 1;
  query.limit = limit.value;

  router.replace({ query });
};

/* ---------- رویدادهای UI ---------- */
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// وقتی کاربر جستجو انجام دهد
const onSearch = (query: string) => {
  updateQueryString({ query, page: 1 });
};

// وقتی کاربر روی "✅ اعمال فیلترها" در FilterSidebar کلیک می‌کند
const onFiltersFromSidebar = (filters: {
  price?: number;
  brand?: string;
  category?: string;
}) => {
  isSidebarOpen.value = false;
  updateQueryString({
    maxPrice: filters.price,
    companyName: filters.brand,
    categoryIds: filters.category ? [filters.category] : [],
    page: 1,
  });
};

// وقتی sort عوض می‌شود
const onSortChange = (value: string) => {
  updateQueryString({ sort: value, page: 1 });
};

// تغییر صفحه
const changePage = (newPage: number) => {
  updateQueryString({ page: newPage });
};
</script>
