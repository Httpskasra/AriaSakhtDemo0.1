// services/productService.ts
import axios from "axios";
import type { Product } from "~/types/product";

export const getAllProducts = async (limit?: number, page?: number) => {
  const { $axios } = useNuxtApp();
  return await $axios.get<Product[]>("/products", {
    params: { limit, page },
  });
};

export const getProductById = async (id: string | number) => {
  const { $axios } = useNuxtApp();

  return await $axios.get<Product>(`/products/${id}`);
};

export const createProduct = async (productData: any) => {
  const { $axios } = useNuxtApp();

  return await $axios.post("/products", productData);
};

export const updateProduct = async (id: string | number, productData: any) => {
  const { $axios } = useNuxtApp();

  return await $axios.patch(`/products/${id}`, productData);
};

export const deleteProduct = async (id: string | number) => {
  const { $axios } = useNuxtApp();

  return await $axios.delete(`/products/${id}`);
};

export const searchProducts = async (
  query: string,
  limit?: number,
  page?: number
) => {
  const { $axios } = useNuxtApp();

  return await $axios.get<Product[]>("/products/search", {
    params: { query, limit, page },
  });
};

export const getProductsByCompanyId = async (
  companyId: string,
  limit?: number,
  page?: number,
  sort?: string
) => {
  const { $axios } = useNuxtApp();

  return await $axios.get<Product[]>(`/products/company/${companyId}`, {
    params: { limit, page, sort },
  });
};

export const getTopProducts = async (limit?: number) => {
  const { $axios } = useNuxtApp();

  return await $axios.get<Product[]>("/products/top-sales", {
    params: { limit },
  });
};

export const getOfferProducts = async (limit?: number, page?: number) => {
  const { $axios } = useNuxtApp();

  return await $axios.get<Product[]>("/products/offers", {
    params: { limit, page },
  });
};
