<script setup lang="ts">
import type { Product } from '~/types/product'
import { useAddToCart } from '~/composables/useAddToCart'

defineProps<{
  products: Product[] | null
  loading: boolean
}>()

const { addProductToCart } = useAddToCart()
const addFeaturedProductToCart = async (product: Product) => {
  const companyId = typeof product.companyId === 'string' ? product.companyId : product.companyId?._id
  if (!product._id || !companyId) return
  await addProductToCart({ productId: product._id, quantity: 1, companyId, priceAtAdd: product.finalPrice || product.basePrice })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}
</script>

<template>
  <section aria-labelledby="featured-products-heading" class="space-y-6">
    <h2 id="featured-products-heading" class="text-2xl font-black text-slate-900">محصولات ویژه</h2>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="premium-card overflow-hidden">
          <div class="aspect-square animate-pulse bg-slate-200"></div>
          <div class="space-y-3 p-5">
            <div class="h-5 w-3/4 animate-pulse rounded bg-slate-200"></div>
            <div class="h-4 w-1/2 animate-pulse rounded bg-slate-100"></div>
            <div class="flex justify-between pt-4">
              <div class="h-6 w-24 animate-pulse rounded bg-slate-200"></div>
              <div class="h-6 w-12 animate-pulse rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="products && products.length > 0">
        <NuxtLink
          v-for="product in products"
          :key="product._id"
          :to="`/products/${product._id}`"
          class="premium-card group flex h-full flex-col overflow-hidden"
        >
          <div class="relative aspect-square overflow-hidden bg-slate-100">
            <NuxtImg
              :src="product.images?.[0]?.url || '/products/building-material.jpg'"
              :alt="product.name"
              class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              data-ai-hint="product image"
            />
            <div v-if="product.discount" class="absolute left-3 top-3 rounded-compact-list-item bg-red-500 px-2 py-1 font-num text-xs font-bold text-white shadow-lg">
              {{ product.discount }}٪ تخفیف
            </div>
          </div>

          <div class="flex flex-1 flex-col justify-between p-5">
            <div class="space-y-2">
              <div class="truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {{ typeof product.companyId === 'object' ? product.companyId.name : 'تامین‌کننده معتبر' }}
              </div>
              <h3 class="h-12 line-clamp-2 font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-blue">
                {{ product.name }}
              </h3>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
              <div class="space-y-0.5 text-left rtl:text-right">
                <div v-if="product.discount" class="font-num text-[10px] text-slate-400 line-through decoration-red-400/50">
                  {{ formatPrice(product.basePrice) }}
                </div>
                <div class="flex items-baseline gap-1 font-num text-lg font-black text-slate-900">
                  {{ formatPrice(product.finalPrice || product.basePrice) }}
                  <span class="text-[10px] font-medium text-slate-500">تومان</span>
                </div>
              </div>
              <UButton
                type="button"
                size="sm"
                color="primary"
                variant="soft"
                icon="i-lucide-shopping-cart"
                square
                aria-label="افزودن به سبد خرید"
                @click.prevent.stop="addFeaturedProductToCart(product)"
                class="transition-colors group-hover:bg-brand-blue group-hover:text-white"
              />
            </div>
          </div>
        </NuxtLink>
      </template>

      <div v-else class="col-span-full py-20 text-center">
        <UIcon name="i-lucide-package-search" class="mx-auto mb-4 size-icon-hero text-slate-200" />
        <h3 class="heading-md text-slate-400">محصولی یافت نشد</h3>
      </div>
    </div>
  </section>
</template>
