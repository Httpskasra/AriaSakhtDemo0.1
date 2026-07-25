// services/productService.ts
import type { Product } from "~/types/product";

const useApi = () => {
  const { $axios } = useNuxtApp();
  return $axios;
};

// اگر بک‌اندت ساختار دیگه‌ای برمی‌گردونه، اینو تنظیم کن
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminProductListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
}

export const listAdminProducts = async (
  params: AdminProductListParams = {},
) => {
  const $axios = useApi();
  const { data } = await $axios.get<Product[] | PaginatedResponse<Product>>(
    "/products/admin/all-products",
    { params },
  );

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: params.page || 1,
      limit: params.limit || data.length,
    } satisfies PaginatedResponse<Product>;
  }

  return data;
};

export type ProductSearchResponse = {
  data: PaginatedResponse<Product>;
};

/** Normalizes the product endpoints that may return either a bare array or a paginated payload. */
export const normalizeProductPage = (
  payload: Product[] | PaginatedResponse<Product> | null | undefined,
  page = 1,
  limit = 12,
): PaginatedResponse<Product> => {
  const isPaginated = !Array.isArray(payload) && Array.isArray(payload?.items);
  const paginatedPayload = isPaginated ? payload as PaginatedResponse<Product> : undefined;
  const items = Array.isArray(payload) ? payload : paginatedPayload?.items || [];
  const total = paginatedPayload?.total ?? items.length;
  const startIndex = (page - 1) * limit;

  return {
    items: isPaginated ? items : items.slice(startIndex, startIndex + limit),
    total,
    page: paginatedPayload?.page ?? page,
    limit: paginatedPayload?.limit ?? limit,
  };
};

/* ================== محصولات ساده ================== */

export const getAllProducts = async (limit?: number, page?: number) => {
  const $axios = useApi();
  return await $axios.get<PaginatedResponse<Product>>("/products", {
    params: { limit, page },
  });
};

export const getProductById = async (id: string | number) => {
  const $axios = useApi();
  return await $axios.get<Product>(`/products/${id}`);
};

/* ================== سرچ ساده ================== */

export const searchProducts = async (params: {
  query: string;
  limit?: number;
  page?: number;
}) => {
  const $axios = useApi();
  return await $axios.get<PaginatedResponse<Product>>("/products/search", {
    params,
  });
};

/* ====== سرچ بر اساس قیمت و شرکت (Swagger: /search-by-price-company) ====== */

export const searchByPriceAndCompany = async (params: {
  maxPrice?: number;
  companyName?: string;
  limit?: number;
  page?: number;
  sort?: string; // مثال: "basePrice:desc"
}) => {
  const $axios = useApi();
  return await $axios.get<PaginatedResponse<Product>>(
    "/products/search-by-price-company",
    { params }
  );
};

/* ================== Advanced Search ================== */

export interface AdvancedSearchParams {
  query?: string; // متن جستجو (کوئری جستجو)
  maxPrice?: number; // حداکثر قیمت
  companyName?: string; // نام شرکت
  categoryIds?: string[]; // آرایه categoryIds
  page?: number;
  limit?: number;
  sort?: string; // مثال: "basePrice:desc"
}

/**
 * Advanced search for products matching Swagger specification
 * Parameters are properly serialized for query string compatibility
 *
 * مسئله: API فقط آرایه برمی‌گردونه نه PaginatedResponse
 * راه‌حل: تبدیل به PaginatedResponse و pagination client-side
 */
export const advancedSearchProducts = async (
  params: AdvancedSearchParams,
): Promise<ProductSearchResponse> => {
  const $axios = useApi();

  // Filter out undefined values
  const cleanParams: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleanParams[key] = value;
    }
  });

  try {
    const response = await $axios.get<Product[] | PaginatedResponse<Product>>("/products/advanced-search", {
      params: cleanParams,
      paramsSerializer: {
        serialize: (params: Record<string, any>) => {
          const queryParts: string[] = [];

          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // برای آرایه‌ها: categoryIds[]=id1&categoryIds[]=id2
              value.forEach((item) => {
                queryParts.push(
                  `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
                );
              });
            } else if (value !== undefined && value !== null && value !== "") {
              // برای مقادیر عادی
              queryParts.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
              );
            }
          });

          return queryParts.join("&");
        },
      },
    });

    const page = cleanParams.page || 1;
    const limit = cleanParams.limit || 12;

    return {
      data: normalizeProductPage(response.data, page, limit),
    };
  } catch (error) {
    console.error("خطا در advanced search:", error);
    throw error;
  }
};

/* ================== Top sales & offers ================== */

export const getTopProducts = async (limit?: number) => {
  const $axios = useApi();
  return await $axios.get<Product[]>("/products/top-sales", {
    params: { limit },
  });
};

export const getOfferProducts = async (limit?: number, page?: number) => {
  const $axios = useApi();
  const response = await $axios.get<Product[] | PaginatedResponse<Product>>("/products/offers", {
    params: { limit, page },
  });
  return normalizeProductPage(response.data, page || 1, limit || 12);
};
