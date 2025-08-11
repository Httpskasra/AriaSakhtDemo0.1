// services/productService.ts
import axios from "axios";
import type { Product } from "~/types/product";
export const getAllProducts = async () => {
  return await axios.get<Product[]>("/products");
};

export const getProductById = async (id: string | number) => {
  return await axios.get<Product>(`/products/${id}`);
};

export const createProduct = async (productData: any) => {
  return await axios.post("/products", productData);
};

export const updateProduct = async (id: string | number, productData: any) => {
  return await axios.put(`/products/${id}`, productData);
};

export const deleteProduct = async (id: string | number) => {
  return await axios.delete(`/products/${id}`);
};
