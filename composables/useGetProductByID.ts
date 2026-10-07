import { computed, unref, type ComputedRef, type Ref } from 'vue';
import type { Product } from '~/types/product';
import { getProductById } from '~/services/productService';

type ProductId = string | Ref<string> | ComputedRef<string>;

function getApiStatus(error: any): number | undefined {
  return error?.info?.status ?? error?.response?.status ?? error?.statusCode;
}

async function loadProduct(id: string): Promise<Product> {
  // During SSR the browser cannot be used to reach the public API URL in all
  // deployments. Prefer the internal Docker address, but keep the public
  // address as a safe fallback so a temporary container-network/DNS issue
  // does not turn a public product page into an HTTP 500 response.
  if (process.server) {
    const config = useRuntimeConfig();
    const internalBase = String(config.serverApiBase || '').replace(/\/$/, '');
    const publicBase = String(config.public.apiBase || '').replace(/\/$/, '');
    const siteBase = String(config.public.siteUrl || '').replace(/\/$/, '');
    const siteApiBase = siteBase ? `${siteBase}/api` : '';
    const encodedId = encodeURIComponent(id);
    const candidateBases = [...new Set([internalBase, publicBase, siteApiBase].filter(Boolean))];
    let lastError: unknown;

    for (const base of candidateBases) {
      try {
        return await $fetch<Product>(`${base}/products/${encodedId}`, {
          headers: useRequestHeaders(['cookie', 'user-agent']),
        });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Product API is unavailable');
  }

  const response = await getProductById(id);
  return response.data;
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
        return await loadProduct(productId.value);
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
