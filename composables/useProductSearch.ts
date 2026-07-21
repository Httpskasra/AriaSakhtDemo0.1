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
    if (companyName.value) params.companyName = companyName.value;
    if (categoryIds.value.length > 0) params.categoryIds = categoryIds.value;
    if (sortOption.value) params.sort = sortOption.value;

    return params;
  };

  /* ---------- Update query string while preserving existing values ---------- */
  const updateQueryString = (newParams: Record<string, any> = {}) => {
    // Start with a clean slate of current query values
    const query: Record<string, any> = { ...route.query };

    // Explicitly handle each field to allow clearing or updating
    const updateField = (key: string) => {
      if (newParams[key] !== undefined) {
        if (newParams[key] === null || newParams[key] === "" || (Array.isArray(newParams[key]) && newParams[key].length === 0)) {
          delete query[key];
        } else {
          query[key] = newParams[key];
        }
      }
    };

    ['query', 'maxPrice', 'companyName', 'categoryIds', 'sort'].forEach(updateField);

    // Reset to page 1 if any filter changed, unless page is explicitly provided
    query.page = newParams.page ?? 1;
    query.limit = newParams.limit ?? limit.value;

    router.replace({ query });
  };

  const onFiltersFromSidebar = (filters: {
    maxPrice?: number;
    companyName?: string;
    categoryIds?: string[];
  }) => {
    updateQueryString({
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
