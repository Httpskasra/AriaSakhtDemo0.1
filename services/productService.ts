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
  query?: string; // متن جستجو
  maxPrice?: number; // حداکثر قیمت
  companyName?: string; // نام شرکت
  categoryIds?: string[]; // آرایه categoryIds
  page?: number;
  limit?: number;
  sort?: string; // مثال: "basePrice:desc"
}

export const advancedSearchProducts = async (params: AdvancedSearchParams) => {
  const $axios = useApi();

  return await $axios.get<PaginatedResponse<Product>>(
    "/products/advanced-search",
    {
      params,
      // اگر بک‌اندت روی شکل آرایه حساس است، این را کاستوم کن
      // paramsSerializer: { indexes: false },
    }
  );
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
