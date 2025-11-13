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
import { ref, computed } from "vue";
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
const sortOption = ref<string>((route.query.sort as string) || "");

/* ---------- صفحه و limit از روی query ---------- */
const page = computed(() => Number(route.query.page || 1));
const limit = computed(() => Number(route.query.limit || 12));

/* ---------- آخرین فیلترهای اعمال‌شده (از سایدبار) ---------- */
const lastFilters = ref<{
  price: number | null;
  brand: string;
  category: string;
}>({
  // این‌ها را از query هم سینک می‌کنیم تا رفرش صفحه خراب نشود
  price: route.query.maxPrice ? Number(route.query.maxPrice) : null,
  brand: (route.query.companyName as string) || "",
  // اگر بک‌اند categoryIds دارد، ما فعلاً فقط اولین مقدار را می‌خوانیم
  category: Array.isArray(route.query.categoryIds)
    ? (route.query.categoryIds[0] as string) || ""
    : (route.query.categoryIds as string) || "",
});

/* ---------- ساخت پارامتر برای advanced-search ---------- */
const buildParams = (): AdvancedSearchParams => ({
  maxPrice:
    typeof lastFilters.value.price === "number"
      ? lastFilters.value.price
      : undefined,
  companyName: lastFilters.value.brand || undefined,
  categoryIds: lastFilters.value.category
    ? [lastFilters.value.category]
    : undefined,
  sort: sortOption.value || undefined,
  page: page.value,
  limit: limit.value,
});

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
    watch: [() => route.query], // هر بار query عوض بشه، دوباره لود
  }
);

const products = computed<Product[]>(() => data.value?.items ?? []);
const total = computed<number>(() => data.value?.total ?? 0);
const totalPages = computed(() =>
  total.value && limit.value ? Math.ceil(total.value / limit.value) : 1
);

/* ---------- هندل کردن کوئری آدرس (sync با URL) ---------- */
const updateQuery = (extra: Record<string, any> = {}) => {
  const query: Record<string, any> = {
    ...route.query,
    page: extra.page ?? 1, // وقتی فیلتر عوض شود، برگرد صفحه ۱
    limit: limit.value,
    sort: sortOption.value || undefined,
  };

  // مَپ کردن فیلترها به Swagger
  if (lastFilters.value.price != null) query.maxPrice = lastFilters.value.price;
  else delete query.maxPrice;

  if (lastFilters.value.brand) query.companyName = lastFilters.value.brand;
  else delete query.companyName;

  if (lastFilters.value.category) {
    // اگر بک‌اند انتظار آرایه دارد، با همین اسم یک‌تایی هم مشکلی ندارد
    query.categoryIds = lastFilters.value.category;
  } else {
    delete query.categoryIds;
  }

  // پاک کردن undefined / خالی
  Object.keys(query).forEach((key) => {
    const v = query[key];
    if (v === undefined || v === null || v === "") {
      delete query[key];
    }
  });

  router.replace({ query });
};

/* ---------- رویدادهای UI ---------- */
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// وقتی کاربر روی "✅ اعمال فیلترها" در FilterSidebar کلیک می‌کند
const onFiltersFromSidebar = (filters: {
  price?: number;
  brand?: string;
  category?: string;
}) => {
  lastFilters.value = {
    price: filters.price ?? null,
    brand: filters.brand ?? "",
    category: filters.category ?? "",
  };
  isSidebarOpen.value = false;
  updateQuery();
};

// وقتی sort عوض می‌شود (بسته به API کامپوننت SortFilter خودت)
const onSortChange = (value: string) => {
  sortOption.value = value;
  updateQuery({ page: page.value }); // فقط sort عوض شده، صفحه را حفظ کن
};

const changePage = (newPage: number) => {
  router.replace({
    query: {
      ...route.query,
      page: newPage,
    },
  });
};
</script>
