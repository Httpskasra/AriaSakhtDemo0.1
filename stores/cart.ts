import { defineStore } from 'pinia';
import type { Cart } from '~/types/product';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null);
  const invalidated = ref(0);
  const itemCount = computed(() => cart.value?.items.reduce((total, item) => total + Number(item.quantity || 0), 0) || 0);

  function setCart(next: Cart | null): void { cart.value = next; }
  function invalidate(): void { invalidated.value += 1; }
  function clear(): void { cart.value = null; invalidated.value += 1; }

  return { cart, invalidated, itemCount, setCart, invalidate, clear };
});
