<script setup lang="ts">
import type { Product } from '~/types/product';

const props = defineProps<{ product: Product; loading?: boolean }>();
const { addProductToCart, loading: cartLoading } = useAddToCart();
const productId = computed(() => props.product._id || props.product.id || '');
const stockQuantity = computed(() => Math.max(0, Number(props.product.stock?.quantity || 0)));
const isOutOfStock = computed(() => stockQuantity.value <= 0);
const hasVariants = computed(() => Boolean(props.product.variants?.length));
const ratingCount = computed(() => Math.max(0, Number(props.product.totalRatings || 0)));
const ratingValue = computed(() => Number(props.product.avgRate || 0));
const hasRatings = computed(() => ratingCount.value > 0 && Number.isFinite(ratingValue.value));
const discountPercent = computed(() => Math.min(Math.max(Number(props.product.discount || 0), 0), 100));
const basePrice = computed(() => Math.max(0, Number(props.product.basePrice || 0)));
const discountAmount = computed(() => Math.round((basePrice.value * discountPercent.value) / 100));
const finalPrice = computed(() => Math.max(0, Number(props.product.finalPrice ?? basePrice.value - discountAmount.value)));
const currencyCode = computed(() => String(props.product.currency || 'IRR').toUpperCase());
const currencyLabel = computed(() => ({ IRR: 'ریال', IRT: 'تومان', USD: 'دلار', EUR: 'یورو' }[currencyCode.value] || currencyCode.value));
const hasDiscount = computed(() => discountPercent.value > 0 && basePrice.value > finalPrice.value);
const companyName = computed(() => {
  if (typeof props.product.companyId === 'object' && props.product.companyId?.name) return props.product.companyId.name;
  return 'اطلاعات تأمین‌کننده در دسترس نیست';
});
const availabilityLabel = computed(() => isOutOfStock.value ? 'ناموجود' : 'موجود');
const imageSource = computed(() => props.product.images?.[0]?.url || '/products/building-material.jpg');

const formatPrice = (value: number) => new Intl.NumberFormat('fa-IR').format(Math.round(Math.max(0, value)));

const handleImageError = (event: string | Event) => {
  if (typeof event === 'string') return;
  const image = event.target as HTMLImageElement;
  if (image.src.endsWith('/products/building-material.jpg')) return;
  image.src = '/products/building-material.jpg';
};

const handleAddToCart = async () => {
  if (!productId.value || isOutOfStock.value) return;
  if (hasVariants.value) {
    await navigateTo(`/products/${encodeURIComponent(productId.value)}`);
    return;
  }
  await addProductToCart({
    productId: productId.value,
    quantity: 1,
    companyId: typeof props.product.companyId === 'string' ? props.product.companyId : props.product.companyId?._id,
    priceAtAdd: finalPrice.value,
  });
};
</script>

<template>
  <article class="catalog-product-card">
    <div class="catalog-product-card__media">
      <NuxtLink :to="`/products/${productId}`" class="catalog-product-card__image-link" :aria-label="`مشاهده ${product.name}`">
        <NuxtImg
          :src="imageSource"
          :alt="product.name"
          class="catalog-product-card__image"
          loading="lazy"
          width="480"
          height="480"
          sizes="sm:100vw md:50vw lg:25vw"
          format="webp"
          @error="handleImageError" />
        <span v-if="hasDiscount" class="catalog-product-card__discount font-num">{{ discountPercent }}٪ تخفیف</span>
        <span v-if="isOutOfStock" class="catalog-product-card__unavailable">ناموجود</span>
      </NuxtLink>
      <FavoriteButton v-if="productId" :product-id="productId" class="catalog-product-card__favorite" />
    </div>

    <div class="catalog-product-card__body">
      <div class="catalog-product-card__meta">
        <span class="catalog-product-card__sku font-num" dir="ltr">کد: {{ product.sku || '—' }}</span>
        <span v-if="hasRatings" class="catalog-product-card__rating" :aria-label="`امتیاز ${ratingValue.toFixed(1)} از ۵، ${ratingCount.toLocaleString('fa-IR')} نظر`">
          <UIcon name="i-lucide-star" aria-hidden="true" />
          <span class="font-num">{{ ratingValue.toFixed(1) }}</span>
          <span class="font-num">({{ ratingCount.toLocaleString('fa-IR') }})</span>
        </span>
        <span v-else class="catalog-product-card__rating catalog-product-card__rating--empty">بدون امتیاز</span>
      </div>

      <NuxtLink :to="`/products/${productId}`" class="catalog-product-card__title-link">
        <h3 class="catalog-product-card__title">{{ product.name }}</h3>
      </NuxtLink>

      <div class="catalog-product-card__supplier" :title="companyName">
        <UIcon name="i-lucide-building-2" aria-hidden="true" />
        <span>{{ companyName }}</span>
      </div>

      <div class="catalog-product-card__availability" :class="{ 'catalog-product-card__availability--unavailable': isOutOfStock }" role="status">
        <UIcon :name="isOutOfStock ? 'i-lucide-package-x' : 'i-lucide-package-check'" aria-hidden="true" />
        <span>{{ availabilityLabel }}</span>
        <span v-if="!isOutOfStock" class="catalog-product-card__stock font-num">موجودی: {{ stockQuantity.toLocaleString('fa-IR') }}</span>
      </div>

      <div class="catalog-product-card__footer">
        <div class="catalog-product-card__prices">
          <span v-if="hasDiscount" class="catalog-product-card__old-price font-num">{{ formatPrice(basePrice) }} {{ currencyLabel }}</span>
          <div class="catalog-product-card__current-price">
            <span v-if="hasVariants" class="catalog-product-card__from">از</span>
            <strong class="font-num">{{ formatPrice(finalPrice) }}</strong>
            <span>{{ currencyLabel }}</span>
          </div>
        </div>
        <ActionButton
          :icon="hasVariants ? 'i-lucide-list-checks' : 'i-lucide-shopping-cart'"
          :label="isOutOfStock ? 'ناموجود' : hasVariants ? 'انتخاب گزینه‌ها' : 'افزودن به سبد'"
          :aria-label="isOutOfStock ? 'محصول ناموجود است' : hasVariants ? 'انتخاب گزینه‌های محصول' : 'افزودن به سبد خرید'"
          tone="primary"
          :loading="cartLoading"
          :disabled="cartLoading || isOutOfStock"
          @click.prevent="handleAddToCart" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.catalog-product-card {
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-premium);
  transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease;
}

.catalog-product-card:hover {
  border-color: var(--color-info-border);
  box-shadow: var(--shadow-raised);
  transform: translateY(-2px);
}

.catalog-product-card__media {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-light);
}

.catalog-product-card__image-link { display: block; aspect-ratio: 1; overflow: hidden; background: var(--color-bg-light); }
.catalog-product-card__image { display: block; width: 100%; height: 100%; padding: clamp(.9rem, 3vw, 1.5rem); object-fit: contain; transition: transform .25s ease; }
.catalog-product-card:hover .catalog-product-card__image { transform: scale(1.035); }

.catalog-product-card__discount,
.catalog-product-card__unavailable {
  position: absolute;
  inset-block-start: .75rem;
  padding: .35rem .6rem;
  border-radius: var(--radius-compact-list-item);
  color: var(--color-bg-surface);
  font-size: .72rem;
  font-weight: 800;
}

.catalog-product-card__discount { inset-inline-start: .75rem; background: var(--color-danger-fg); box-shadow: var(--shadow-raised); }
.catalog-product-card__unavailable { inset-inline-end: .75rem; background: color-mix(in srgb, var(--color-text-heading) 86%, transparent); }
.catalog-product-card__favorite { position: absolute; inset-block-start: .75rem; inset-inline-end: .75rem; z-index: 1; }
.catalog-product-card__favorite :deep(button) { min-width: 2.5rem; min-height: 2.5rem; border: 1px solid var(--color-border); background: color-mix(in srgb, var(--color-bg-surface) 92%, transparent); }

.catalog-product-card__body { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: .65rem; padding: 1rem; }
.catalog-product-card__meta { display: flex; align-items: center; justify-content: space-between; gap: .75rem; min-width: 0; }
.catalog-product-card__sku { min-width: 0; overflow: hidden; color: var(--color-text-muted); font-size: .68rem; text-overflow: ellipsis; white-space: nowrap; }
.catalog-product-card__rating { display: inline-flex; align-items: center; flex: 0 0 auto; gap: .2rem; color: var(--color-text-body); font-size: .7rem; font-weight: 700; }
.catalog-product-card__rating svg { width: .95rem; height: .95rem; color: var(--color-brand-yellow); fill: currentColor; }
.catalog-product-card__rating--empty { color: var(--color-text-muted); font-weight: 600; }
.catalog-product-card__title-link { min-width: 0; color: inherit; }
.catalog-product-card__title { display: -webkit-box; min-height: 3.1rem; margin: 0; overflow: hidden; color: var(--color-text-heading); font-size: .98rem; font-weight: 800; line-height: 1.6; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.catalog-product-card__title-link:hover .catalog-product-card__title { color: var(--color-brand-blue); }
.catalog-product-card__supplier { display: flex; align-items: center; gap: .4rem; min-width: 0; color: var(--color-text-muted); font-size: .76rem; }
.catalog-product-card__supplier svg { flex: 0 0 auto; width: 1rem; height: 1rem; color: var(--color-text-muted); }
.catalog-product-card__supplier span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.catalog-product-card__availability { display: flex; align-items: center; gap: .35rem; min-width: 0; color: var(--color-success-fg); font-size: .72rem; font-weight: 700; }
.catalog-product-card__availability--unavailable { color: var(--color-danger-fg); }
.catalog-product-card__availability svg { flex: 0 0 auto; width: 1rem; height: 1rem; }
.catalog-product-card__stock { overflow: hidden; color: var(--color-text-muted); font-size: .68rem; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.catalog-product-card__footer { display: flex; align-items: flex-end; justify-content: space-between; gap: .7rem; min-width: 0; margin-top: auto; padding-top: .8rem; border-top: 1px solid var(--color-border); }
.catalog-product-card__prices { display: grid; min-width: 0; gap: .15rem; }
.catalog-product-card__old-price { color: var(--color-text-muted); font-size: .68rem; text-decoration: line-through; text-decoration-color: var(--color-danger-fg); white-space: nowrap; }
.catalog-product-card__current-price { display: flex; align-items: baseline; gap: .25rem; color: var(--color-text-heading); white-space: nowrap; }
.catalog-product-card__current-price strong { font-size: clamp(1.05rem, 2vw, 1.3rem); font-weight: 900; }
.catalog-product-card__current-price > span:last-child { color: var(--color-text-muted); font-size: .68rem; font-weight: 700; }
.catalog-product-card__from { color: var(--color-text-muted); font-size: .7rem; font-weight: 700; }
.catalog-product-card__footer :deep(.action-button) { min-height: 2.75rem; flex: 0 0 auto; padding-inline: .85rem; }

@media (max-width: 380px) {
  .catalog-product-card__body { padding: .85rem; }
  .catalog-product-card__footer { align-items: stretch; flex-direction: column; }
  .catalog-product-card__footer :deep(.action-button) { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .catalog-product-card, .catalog-product-card__image { transition: none; }
  .catalog-product-card:hover { transform: none; }
}
</style>
