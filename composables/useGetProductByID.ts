import { computed, unref, type ComputedRef, type Ref } from 'vue';
import type { Product } from '~/types/product';
import { getProductById } from '~/services/productService';

type ProductId = string | Ref<string> | ComputedRef<string>;

function getApiStatus(error: any): number | undefined {
  return error?.info?.status ?? error?.response?.status ?? error?.statusCode;
}

/** SSR-safe product loader keyed by the route product id. */
export async function useProductById(id: ProductId) {
  const productId = computed(() => String(unref(id) || ''));

  const { data, pending, error: asyncError, refresh } = await useAsyncData<Product>(
    computed(() => `product:${productId.value}`),
    async () => {
      if (!productId.value) {
        throw createError({ statusCode: 404, statusMessage: 'محصول یافت نشد', fatal: false });
      }

      try {
        const response = await getProductById(productId.value);
        return response.data;
      } catch (error: any) {
        const status = getApiStatus(error);
        if (status === 404 || status === 400) {
          throw createError({ statusCode: 404, statusMessage: 'محصول موردنظر پیدا نشد.', fatal: false });
        }
        throw createError({
          statusCode: status || 500,
          statusMessage: error?.info?.message || error?.response?.data?.message || 'خطایی در بارگذاری محصول رخ داده است.',
          fatal: false,
        });
      }
    },
    { watch: [productId] },
  );

  const error = computed(() => asyncError.value?.statusMessage || asyncError.value?.message || null);
  const errorStatus = computed(() => asyncError.value?.statusCode || asyncError.value?.status || null);

  return { data, loading: pending, error, errorStatus, fetchProduct: refresh };
}
