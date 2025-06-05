// services/productService.ts
import axios from "axios";
import type { Product } from "~/types/product";
export const getAllProducts = async () => {
  return await axios.get<Product[]>("/api/products");
};

export const getProductById = async (id: string | number) => {
  return await axios.get<Product>(`/api/products/${id}`);
};

export const createProduct = async (productData: any) => {
  return await axios.post("/api/products", productData);
};

export const updateProduct = async (id: string | number, productData: any) => {
  return await axios.put(`/api/products/${id}`, productData);
};

export const deleteProduct = async (id: string | number) => {
  return await axios.delete(`/api/products/${id}`);
};
