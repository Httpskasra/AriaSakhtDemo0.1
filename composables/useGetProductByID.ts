import { computed, unref, type ComputedRef, type Ref } from 'vue';
import type { Product } from '~/types/product';
import { getProductById } from '~/services/productService';

type ProductId = string | Ref<string> | ComputedRef<string>;

/** SSR-safe product loader keyed by the route product id. */
export async function useProductById(id: ProductId) {
  const productId = computed(() => String(unref(id) || ''));

  const { data, pending, error: asyncError, refresh } = await useAsyncData<Product>(
    computed(() => `product:${productId.value}`),
    async () => {
      if (!productId.value) {
        throw createError({ statusCode: 404, statusMessage: 'محصول یافت نشد', fatal: true });
      }

      try {
        const response = await getProductById(productId.value);
        return response.data;
      } catch (error: any) {
        if (error?.response?.status === 404) {
          throw createError({ statusCode: 404, statusMessage: 'محصول یافت نشد', fatal: true });
        }
        throw createError({
          statusCode: error?.response?.status || 500,
          statusMessage: error?.response?.data?.message || 'خطایی در بارگذاری محصول رخ داده است.',
        });
      }
    },
    { watch: [productId] },
  );

  const error = computed(() =>
    asyncError.value?.statusMessage || asyncError.value?.message || null,
  );

  return { data, loading: pending, error, fetchProduct: refresh };
}
