import { ref } from "vue";
import { addToCart } from "~/services/cartService";
import type { CartItemDto } from "~/types/product";

export const useAddToCart = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const addProductToCart = async (cartItem: CartItemDto) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await addToCart(cartItem);
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

  return {
    loading,
    error,
    success,
    addProductToCart,
  };
};
