import { computed, ref } from "vue";
import { useRoute, useRouter } from "#app";
import {
  advancedSearchProducts,
  type AdvancedSearchParams,
  type PaginatedResponse,
} from "~/services/productService";
import type { Product } from "~/types/product";

export const useProductSearch = () => {
  const route = useRoute();
  const router = useRouter();

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

  /* ---------- رویدادهای جستجو ---------- */
  const onFiltersFromSidebar = (filters: {
    maxPrice?: number;
    companyName?: string;
    categoryIds?: string[];
  }) => {
    updateQueryString({
      maxPrice: filters.maxPrice,
      companyName: filters.companyName,
      categoryIds: filters.categoryIds,
      page: 1,
    });
  };

  const onSortChange = (value: string) => {
    updateQueryString({ sort: value, page: 1 });
  };

  const changePage = (newPage: number) => {
    updateQueryString({ page: newPage });
  };

  return {
    page,
    limit,
    sortOption,
    searchQuery,
    maxPrice,
    companyName,
    categoryIds,
    buildParams,
    updateQueryString,
    onFiltersFromSidebar,
    onSortChange,
    changePage,
  };
};
