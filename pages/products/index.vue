<template>
  <NuxtLayout>
    <div class="w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
      <!-- فیلترها بالا -->
      <div
        class="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">
        <div class="flex-1 flex flex-col md:flex-row gap-4">
          <!-- سرچ -->
          <input
            v-model="localFilters.query"
            type="text"
            placeholder="جستجو در محصولات (نام، توضیح، ...)"
            class="border rounded-lg px-3 py-2 w-full md:w-1/2"
            @keyup.enter="applyFilters" />

          <!-- نام شرکت -->
          <input
            v-model="localFilters.companyName"
            type="text"
            placeholder="نام شرکت (مثال: Nike)"
            class="border rounded-lg px-3 py-2 w-full md:w-1/3"
            @keyup.enter="applyFilters" />

          <!-- حداکثر قیمت -->
          <input
            v-model.number="localFilters.maxPrice"
            type="number"
            min="0"
            placeholder="حداکثر قیمت"
            class="border rounded-lg px-3 py-2 w-full md:w-1/3"
            @keyup.enter="applyFilters" />
        </div>

        <div class="flex items-center gap-4">
          <!-- sort -->
          <select
            v-model="localFilters.sort"
            class="border rounded-lg px-3 py-2"
            @change="applyFilters">
            <option value="">مرتب‌سازی</option>
            <option value="basePrice:asc">قیمت از کم به زیاد</option>
            <option value="basePrice:desc">قیمت از زیاد به کم</option>
          </select>

          <button
            @click="applyFilters"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg">
            اعمال فیلتر
          </button>
        </div>
      </div>

      <!-- نتایج -->
      <div v-if="pending" class="text-center py-10">
        در حال بارگذاری محصولات...
      </div>

      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">تعداد نتایج: {{ total }}</h2>

          <!-- صفحه‌بندی ساده -->
          <div class="flex items-center gap-2">
            <button
              :disabled="page <= 1"
              @click="changePage(page - 1)"
              class="px-3 py-1 border rounded disabled:opacity-50">
              قبلی
            </button>
            <span>صفحه {{ page }}</span>
            <button
              :disabled="products.length < limit"
              @click="changePage(page + 1)"
              class="px-3 py-1 border rounded disabled:opacity-50">
              بعدی
            </button>
          </div>
        </div>

        <div
          v-if="products.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
            <h3 class="font-semibold text-lg mb-2">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 mb-2">
              {{ product.description?.slice(0, 80) }}…
            </p>
            <p class="font-bold">{{ product.basePrice }} تومان</p>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-600">
          محصولی یافت نشد.
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "#app";
import type { Product } from "~/types/product";
import {
  advancedSearchProducts,
  type AdvancedSearchParams,
  type PaginatedResponse,
} from "~/services/productService";

const route = useRoute();
const router = useRouter();

/* ---------- خواندن مقدار اولیه از query ---------- */

const page = computed(() => Number(route.query.page || 1));
const limit = computed(() => Number(route.query.limit || 12));

const localFilters = reactive<{
  query: string;
  maxPrice: number | null;
  companyName: string;
  sort: string;
  categoryIds: string[];
}>({
  query: (route.query.query as string) || "",
  maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : null,
  companyName: (route.query.companyName as string) || "",
  sort: (route.query.sort as string) || "",
  categoryIds: Array.isArray(route.query.categoryIds)
    ? (route.query.categoryIds as string[])
    : route.query.categoryIds
    ? [route.query.categoryIds as string]
    : [],
});

/* ---------- call به advanced-search ---------- */

const buildParams = (): AdvancedSearchParams => ({
  query: localFilters.query || undefined,
  maxPrice:
    typeof localFilters.maxPrice === "number"
      ? localFilters.maxPrice
      : undefined,
  companyName: localFilters.companyName || undefined,
  categoryIds: localFilters.categoryIds.length
    ? localFilters.categoryIds
    : undefined,
  page: page.value,
  limit: limit.value,
  sort: localFilters.sort || undefined,
});

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

/* ---------- sync کردن فیلترها با آدرس ---------- */

const updateQuery = (extra: Record<string, any> = {}) => {
  const query: Record<string, any> = {
    ...route.query,
    query: localFilters.query || undefined,
    maxPrice: localFilters.maxPrice || undefined,
    companyName: localFilters.companyName || undefined,
    sort: localFilters.sort || undefined,
    page: extra.page ?? 1, // هر بار فیلتر عوض شد برگرد صفحه ۱
    limit: limit.value,
  };

  // پاک کردن undefinedها
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === "") {
      delete query[key];
    }
  });

  router.replace({ query });
};

const applyFilters = () => {
  updateQuery();
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
