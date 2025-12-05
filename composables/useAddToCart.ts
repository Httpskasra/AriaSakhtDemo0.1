import { ref } from "vue";
import type { CartItemDto } from "~/types/product";

export const useAddToCart = () => {
  const { $axios } = useNuxtApp();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  /**
   * اضافه کردن محصول به سبد خریدی
   */
  const addProductToCart = async (cartItem: CartItemDto) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await $axios.post("/carts/items", {
        productId: cartItem.productId,
        quantity: cartItem.quantity || 1,
        variantId: cartItem.variantId,
        selectedVariant: cartItem.selectedVariant,
      });
      success.value = true;
      console.log("محصول به سبد خریدی افزوده شد:", response.data);
      return response.data;
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "خطا در افزودن محصول به سبد خریدی";
      console.error("خطا:", error.value);
    } finally {
      loading.value = false;
    }
  };

  /**
   * حذف محصول از سبد
   */
  const removeFromCart = async (productId: string) => {
    try {
      await $axios.delete(`/carts/items/${productId}`);
      return true;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "خطا در حذف محصول";
      throw err;
    }
  };

  /**
   * خالی کردن سبد
   */
  const clearCart = async () => {
    try {
      await $axios.delete("/carts/clear");
      return true;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "خطا در خالی کردن سبد";
      throw err;
    }
  };

  /**
   * دریافت سبد فعال
   */
  const getActiveCart = async () => {
    try {
      const response = await $axios.get("/carts/active");
      return response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "خطا در دریافت سبد";
      throw err;
    }
  };

  /**
   * دریافت سبد با جزئیات کامل
   */
  const getPopulatedCart = async () => {
    try {
      const response = await $axios.get("/carts/populated");
      return response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "خطا در دریافت سبد";
      throw err;
    }
  };

  /**
   * دریافت خلاصه سبد
   */
  const getCartSummary = async () => {
    try {
      const response = await $axios.get("/carts/summary");
      return response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "خطا در دریافت خلاصه سبد";
      throw err;
    }
  };

  /**
   * تسویه حساب (checkout)
   */
  const checkout = async () => {
    try {
      const response = await $axios.post("/carts/checkout");
      success.value = true;
      return response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "خطا در تسویه حساب";
      throw err;
    }
  };

  return {
    // State
    loading,
    error,
    success,
    // Methods
    addProductToCart,
    removeFromCart,
    clearCart,
    getActiveCart,
    getPopulatedCart,
    getCartSummary,
    checkout,
  };
};
