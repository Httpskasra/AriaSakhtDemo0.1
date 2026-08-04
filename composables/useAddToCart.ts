import { ref } from 'vue';
import { useState } from '#app';
import type { CartItemDto } from '~/types/product';
import { addToCart, createCart } from '~/services/cartService';
import { useUser } from '~/composables/useUser';
import { useCartStore } from '~/stores/cart';

export const useAddToCart = () => {
  const { user, fetchUser } = useUser();
  const cartStore = useCartStore();
  const toast = useToast();
  const loading = useState('cart:add:loading', () => false);
  const error = ref<string | null>(null);
  const success = ref(false);
  const cartBump = useState('cart-bump', () => 0);

  const addProductToCart = async (cartItem: CartItemDto) => {
    if (loading.value) return null;
    if (!user.value?.userId) await fetchUser();
    if (!user.value?.userId) {
      error.value = 'لطفا وارد سایت شوید';
      toast.add({ title: 'خطا', description: error.value, color: 'red' });
      return null;
    }

    loading.value = true;
    error.value = null;
    success.value = false;
    try {
      let response;
      try {
        response = await addToCart(cartItem);
      } catch (requestError: any) {
        // Compatibility fallback for older backends without atomic cart creation.
        if (requestError?.response?.status !== 404) throw requestError;
        await createCart({ items: [] });
        response = await addToCart(cartItem);
      }
      success.value = true;
      if (response.data) cartStore.setCart(response.data);
      else cartStore.invalidate();
      cartBump.value++;
      toast.add({ title: 'موفقیت', description: 'محصول با موفقیت به سبد خرید اضافه شد', color: 'success' });
      return response.data;
    } catch (requestError: any) {
      error.value = requestError?.response?.data?.message || requestError?.message || 'خطا در افزودن محصول به سبد خرید';
      toast.add({ title: 'خطا', description: error.value, color: 'red' });
      throw requestError;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, success, cartBump, addProductToCart };
};
