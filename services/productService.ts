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
export const advancedSearchProducts = async (params: AdvancedSearchParams) => {
  const $axios = useApi();

  // Filter out undefined values
  const cleanParams: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleanParams[key] = value;
    }
  });

  try {
    const response = await $axios.get<any>("/products/advanced-search", {
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

    let items: Product[] = [];
    let total = 0;

    // اگر response یک آرایه ساده است
    if (Array.isArray(response.data)) {
      items = response.data;
      total = items.length;
    }
    // اگر response یک object است
    else if (response.data?.items) {
      items = response.data.items;
      total = response.data.total;
    }
    // fallback
    else {
      items = [];
      total = 0;
    }

    // انجام pagination client-side
    const page = cleanParams.page || 1;
    const limit = cleanParams.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      data: {
        items: paginatedItems,
        total: total,
        page: page,
        limit: limit,
      },
    };
  } catch (error) {
    console.error("خطا در advanced search:", error);
    return {
      data: {
        items: [],
        total: 0,
        page: cleanParams.page || 1,
        limit: cleanParams.limit || 12,
      },
    };
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
  return await $axios.get<PaginatedResponse<Product>>("/products/offers", {
    params: { limit, page },
  });
};
