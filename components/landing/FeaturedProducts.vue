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
    <h2 id="featured-products-heading" class="featured-products__heading">محصولات ویژه</h2>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="premium-card overflow-hidden">
          <div class="featured-product-skeleton__image"></div>
          <div class="space-y-3 p-5">
            <div class="featured-product-skeleton__line featured-product-skeleton__line--wide"></div>
            <div class="featured-product-skeleton__line featured-product-skeleton__line--medium"></div>
            <div class="flex justify-between pt-4">
              <div class="featured-product-skeleton__line featured-product-skeleton__line--price"></div>
              <div class="featured-product-skeleton__line featured-product-skeleton__line--small"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="products && products.length > 0">
        <article
          v-for="product in products"
          :key="product._id"
          class="premium-card group flex h-full flex-col overflow-hidden"
        >
          <NuxtLink :to="`/products/${product._id}`" :aria-label="`مشاهده ${product.name}`">
            <div class="featured-product__image">
              <NuxtImg
                :src="product.images?.[0]?.url || '/products/building-material.jpg'"
                :alt="product.name"
                class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                data-ai-hint="product image"
              />
              <div v-if="product.discount" class="featured-product__discount font-num">
                {{ product.discount }}٪ تخفیف
              </div>
            </div>
          </NuxtLink>

          <div class="flex flex-1 flex-col justify-between p-5">
            <div class="space-y-2">
              <div class="featured-product__vendor">
                {{ typeof product.companyId === 'object' ? product.companyId.name : 'تأمین‌کننده معتبر' }}
              </div>
              <NuxtLink :to="`/products/${product._id}`" class="featured-product__name">
                {{ product.name }}
              </NuxtLink>
            </div>

            <div class="featured-product__footer">
              <div class="space-y-0.5 text-left rtl:text-right">
                <div v-if="product.discount" class="featured-product__old-price font-num">
                  {{ formatPrice(product.basePrice) }}
                </div>
                <div class="featured-product__price font-num">
                  {{ formatPrice(product.finalPrice || product.basePrice) }}
                  <span class="featured-product__currency">ریال</span>
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
                class="featured-product__cart"
              />
            </div>
          </div>
        </article>
      </template>

      <div v-else class="featured-products__empty">
        <UIcon name="i-lucide-package-search" />
        <h3>محصولی یافت نشد</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-products__heading { margin: 0; color: var(--color-text-heading); font-size: 1.5rem; font-weight: 900; }
.featured-product-skeleton__image { aspect-ratio: 1; background: var(--color-border-strong); animation: featured-pulse 1.4s ease-in-out infinite; }
.featured-product-skeleton__line { height: .75rem; border-radius: var(--radius-compact-list-item); background: var(--color-border-strong); animation: featured-pulse 1.4s ease-in-out infinite; }
.featured-product-skeleton__line--wide { width: 75%; height: 1.25rem; }
.featured-product-skeleton__line--medium { width: 50%; }
.featured-product-skeleton__line--price { width: 6rem; height: 1.5rem; }
.featured-product-skeleton__line--small { width: 3rem; }
.featured-product__image { position: relative; overflow: hidden; aspect-ratio: 1; background: var(--color-bg-light); }
.featured-product__discount { position: absolute; inset-block-start: .75rem; inset-inline-start: .75rem; padding: .25rem .5rem; border-radius: var(--radius-compact-list-item); color: var(--color-bg-surface); background: var(--color-danger-fg); font-size: .7rem; font-weight: 800; box-shadow: var(--shadow-raised); }
.featured-product__vendor { overflow: hidden; color: var(--color-text-muted); font-size: .65rem; font-weight: 800; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; }
.featured-product__name { display: block; height: 3rem; overflow: hidden; color: var(--color-text-heading); font-weight: 800; line-height: 1.5; transition: color .16s ease; }
.featured-product__name:hover { color: var(--color-brand-blue); }
.featured-product__footer { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border); }
.featured-product__old-price { color: var(--color-text-muted); font-size: .65rem; text-decoration: line-through; text-decoration-color: var(--color-danger-fg); }
.featured-product__price { color: var(--color-text-heading); font-size: 1.1rem; font-weight: 900; }
.featured-product__currency { color: var(--color-text-muted); font-size: .65rem; font-weight: 600; }
.featured-product__cart { transition: background-color .16s ease, color .16s ease; }
.featured-product__empty { grid-column: 1 / -1; padding-block: 5rem; color: var(--color-text-disabled); text-align: center; }
.featured-product__empty :deep(svg) { width: var(--spacing-icon-hero); height: var(--spacing-icon-hero); margin-inline: auto; margin-bottom: 1rem; }
.featured-product__empty h3 { margin: 0; color: var(--color-text-muted); font-size: 1.1rem; font-weight: 800; }
@keyframes featured-pulse { 50% { opacity: .45; } }
</style>
