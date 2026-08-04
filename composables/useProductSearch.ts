import { computed } from "vue";
import { useRoute, useRouter } from "#app";
import {
  type AdvancedSearchParams,
} from "~/services/productService";

export const useProductSearch = () => {
  const route = useRoute();
  const router = useRouter();

  /* ---------- Derived values from query string ---------- */
  const page = computed(() => Number(route.query.page || 1));
  const limit = computed(() => Number(route.query.limit || 12));
  const sortOption = computed(() => (route.query.sort as string) || "");
  const searchQuery = computed(() => (route.query.query as string) || "");
  const maxPrice = computed(() =>
    route.query.maxPrice ? Number(route.query.maxPrice) : undefined
  );
  const minPrice = computed(() =>
    route.query.minPrice ? Number(route.query.minPrice) : undefined
  );
  const companyName = computed(() => (route.query.companyName as string) || "");
  const categoryIds = computed(() => {
    const cat = route.query.categoryIds;
    if (Array.isArray(cat)) return cat as string[];
    return cat ? [cat as string] : [];
  });

  /* ---------- Build parameters for API call ---------- */
  const buildParams = (): AdvancedSearchParams => {
    const params: AdvancedSearchParams = {
      page: page.value,
      limit: limit.value,
    };

    if (searchQuery.value) params.query = searchQuery.value;
    if (maxPrice.value) params.maxPrice = maxPrice.value;
    if (minPrice.value) params.minPrice = minPrice.value;
    if (companyName.value) params.companyName = companyName.value;
    if (categoryIds.value.length > 0) params.categoryIds = categoryIds.value;
    if (sortOption.value) params.sort = sortOption.value;

    return params;
  };

  /* ---------- Update query string while preserving existing values ---------- */
  const updateQueryString = (newParams: Record<string, any> = {}) => {
    const query: Record<string, any> = { ...route.query };

    const updateField = (key: string) => {
      if (newParams[key] !== undefined) {
        if (newParams[key] === null || newParams[key] === "" || (Array.isArray(newParams[key]) && newParams[key].length === 0)) {
          delete query[key];
        } else {
          query[key] = newParams[key];
        }
      }
    };

    ['query', 'minPrice', 'maxPrice', 'companyName', 'categoryIds', 'sort'].forEach(updateField);

    query.page = newParams.page ?? 1;
    query.limit = newParams.limit ?? limit.value;

    router.replace({ query });
  };

  const clearAllFilters = () => {
    router.replace({ query: { query: route.query.query } });
  };

  const onFiltersFromSidebar = (filters: {
    minPrice?: number;
    maxPrice?: number;
    companyName?: string;
    categoryIds?: string[];
  }) => {
    updateQueryString({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      companyName: filters.companyName,
      categoryIds: filters.categoryIds,
    });
  };

  const onSortChange = (value: string) => {
    updateQueryString({ sort: value });
  };

  const changePage = (newPage: number) => {
    updateQueryString({ page: newPage });
  };

  return {
    page,
    limit,
    sortOption,
    searchQuery,
    minPrice,
    maxPrice,
    companyName,
    categoryIds,
    buildParams,
    updateQueryString,
    clearAllFilters,
    onFiltersFromSidebar,
    onSortChange,
    changePage,
  };
};
