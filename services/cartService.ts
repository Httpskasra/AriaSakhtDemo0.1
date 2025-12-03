// services/cartService.ts
import type { Cart, CartItemDto } from "~/types/product";

const useApi = () => {
  const { $axios } = useNuxtApp();
  return $axios;
};

/**
 * دریافت سبد خریدی فعال کاربر
 */
export const getActiveCart = async () => {
  const $axios = useApi();
  return await $axios.get<Cart>("/carts/active");
};

/**
 * دریافت سبد خریدی با جزئیات محصولات
 */
export const getPopulatedCart = async () => {
  const $axios = useApi();
  return await $axios.get<Cart>("/carts/populated");
};

/**
 * دریافت خلاصه سبد خریدی (قیمت کل، تعداد، etc)
 */
export const getCartSummary = async () => {
  const $axios = useApi();
  return await $axios.get("/carts/summary");
};

/**
 * ایجاد سبد خریدی جدید
 */
export const createCart = async (cartData: { status: string }) => {
  const $axios = useApi();
  return await $axios.post<Cart>("/carts", cartData);
};

/**
 * به‌روزرسانی سبد خریدی
 */
export const updateCart = async (id: string, updates: any) => {
  const $axios = useApi();
  return await $axios.patch<Cart>(`/carts/${id}`, updates);
};

/**
 * اضافه کردن محصول به سبد خریدی
 */
export const addToCart = async (cartItem: CartItemDto) => {
  const $axios = useApi();
  return await $axios.post("/carts/items", cartItem);
};

/**
 * حذف محصول از سبد خریدی
 */
export const removeFromCart = async (productId: string) => {
  const $axios = useApi();
  return await $axios.delete(`/carts/items/${productId}`);
};

/**
 * پاک کردن کل سبد خریدی
 */
export const clearCart = async () => {
  const $axios = useApi();
  return await $axios.delete("/carts/clear");
};

/**
 * تکمیل خریدار (checkout)
 */
export const checkoutCart = async (checkoutData: any) => {
  const $axios = useApi();
  return await $axios.post("/carts/checkout", checkoutData);
};
