<script setup lang="ts">
import type { Product } from '~/types/product';

const props = withDefaults(defineProps<{
  product: Product;
  badge?: string;
  badgeTone?: 'offer' | 'new' | 'popular';
}>(), { badge: '', badgeTone: 'new' });

const { addProductToCart, loading: cartLoading } = useAddToCart();
const productId = computed(() => props.product._id || props.product.id || '');
const stockQuantity = computed(() => Math.max(0, Number(props.product.stock?.quantity || 0)));
const isOutOfStock = computed(() => stockQuantity.value <= 0);
const hasVariants = computed(() => Boolean(props.product.variants?.length));
const basePrice = computed(() => Math.max(0, Number(props.product.basePrice || 0)));
const discountPercent = computed(() => Math.min(Math.max(Number(props.product.discount || 0), 0), 100));
const finalPrice = computed(() => {
  const explicitPrice = Number(props.product.finalPrice);
  if (Number.isFinite(explicitPrice)) return Math.max(0, explicitPrice);
  return Math.max(0, Math.round(basePrice.value * (1 - discountPercent.value / 100)));
});
const hasDiscount = computed(() => discountPercent.value > 0 && finalPrice.value < basePrice.value);
const companyName = computed(() => typeof props.product.companyId === 'object'
  ? props.product.companyId?.name?.trim() || '' : '');
const currencyLabel = computed(() => ({
  IRR: 'ریال', IRT: 'تومان', USD: 'دلار', EUR: 'یورو',
}[String(props.product.currency || 'IRR').toUpperCase()] || String(props.product.currency || 'IRR').toUpperCase()));
const imageSource = computed(() => props.product.images?.[0]?.url || '/products/building-material.jpg');
const formatPrice = (value: number) => new Intl.NumberFormat('fa-IR').format(Math.round(value));

const handleImageError = (event: string | Event) => {
  if (typeof event === 'string') return;
  const image = event.target as HTMLImageElement;
  if (!image.src.endsWith('/products/building-material.jpg')) image.src = '/products/building-material.jpg';
};

const handleAddToCart = async () => {
  if (!productId.value || isOutOfStock.value) return;
  if (hasVariants.value) {
    await navigateTo('/products/' + encodeURIComponent(productId.value));
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
  <article class="landing-product-card">
    <div class="landing-product-card__media">
      <NuxtLink :to="'/products/' + productId" class="landing-product-card__image-link" :aria-label="'مشاهده ' + product.name">
        <NuxtImg :src="imageSource" :alt="product.name" class="landing-product-card__image" loading="lazy" width="480" height="360" sizes="sm:82vw md:50vw lg:25vw" format="webp" @error="handleImageError" />
        <span v-if="badge" :class="['landing-product-card__badge', 'landing-product-card__badge--' + badgeTone]">{{ badge }}</span>
        <span v-if="hasDiscount" class="landing-product-card__discount font-num">{{ discountPercent }}٪ تخفیف</span>
      </NuxtLink>
    </div>
    <div class="landing-product-card__body">
      <div class="landing-product-card__meta">
        <span v-if="companyName" class="landing-product-card__vendor" :title="companyName"><UIcon name="i-lucide-building-2" aria-hidden="true" />{{ companyName }}</span>
        <span v-if="product.avgRate && product.totalRatings" class="landing-product-card__rating font-num" :aria-label="'امتیاز ' + product.avgRate.toFixed(1) + ' از ۵ بر اساس ' + product.totalRatings + ' رأی'"><UIcon name="i-lucide-star" aria-hidden="true" />{{ product.avgRate.toFixed(1) }}<small>({{ product.totalRatings.toLocaleString('fa-IR') }})</small></span>
        <span v-if="product.totalSold" class="landing-product-card__sold font-num">{{ product.totalSold.toLocaleString('fa-IR') }} فروش</span>
      </div>
      <NuxtLink :to="'/products/' + productId" class="landing-product-card__title">{{ product.name }}</NuxtLink>
      <div class="landing-product-card__availability" :class="{ 'landing-product-card__availability--empty': isOutOfStock }">
        <UIcon :name="isOutOfStock ? 'i-lucide-package-x' : 'i-lucide-package-check'" aria-hidden="true" />
        <span>{{ isOutOfStock ? 'ناموجود' : 'موجود' }}</span>
        <span v-if="!isOutOfStock" class="font-num">{{ stockQuantity.toLocaleString('fa-IR') }} عدد</span>
      </div>
      <div class="landing-product-card__footer">
        <div class="landing-product-card__prices">
          <span v-if="hasDiscount" class="landing-product-card__old-price font-num">{{ formatPrice(basePrice) }} {{ currencyLabel }}</span>
          <strong class="landing-product-card__price font-num">{{ formatPrice(finalPrice) }} <small>{{ currencyLabel }}</small></strong>
        </div>
        <UButton size="sm" color="primary" variant="soft" :icon="hasVariants ? 'i-lucide-list-checks' : 'i-lucide-shopping-cart'" :label="isOutOfStock ? 'ناموجود' : hasVariants ? 'انتخاب' : 'افزودن'" :aria-label="isOutOfStock ? 'محصول ناموجود است' : hasVariants ? 'انتخاب گزینه‌های محصول' : 'افزودن به سبد خرید'" :loading="cartLoading" :disabled="cartLoading || isOutOfStock" @click.prevent.stop="handleAddToCart" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.landing-product-card { display:flex; min-width:0; height:100%; flex-direction:column; overflow:hidden; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); box-shadow:var(--shadow-premium); transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.landing-product-card:hover { border-color:var(--color-info-border); box-shadow:var(--shadow-raised); transform:translateY(-2px); }
.landing-product-card__media { position:relative; overflow:hidden; border-bottom:1px solid var(--color-border); background:var(--color-bg-light); }
.landing-product-card__image-link { display:block; aspect-ratio:1.32; overflow:hidden; }
.landing-product-card__image { display:block; width:100%; height:100%; padding:.6rem; object-fit:contain; transition:transform .25s ease; }
.landing-product-card:hover .landing-product-card__image { transform:scale(1.035); }
.landing-product-card__badge, .landing-product-card__discount { position:absolute; inset-block-start:.5rem; padding:.22rem .42rem; border-radius:var(--radius-pill); font-size:.58rem; font-weight:var(--font-weight-extrabold); }
.landing-product-card__badge { inset-inline-end:.5rem; }
.landing-product-card__badge--offer { color:var(--color-success-fg); background:var(--color-success-bg); }
.landing-product-card__badge--new { color:var(--color-info-fg); background:var(--color-info-bg); }
.landing-product-card__badge--popular { color:var(--color-warning-fg); background:var(--color-warning-bg); }
.landing-product-card__discount { inset-inline-start:.5rem; color:var(--color-bg-surface); background:var(--color-danger-fg); }
.landing-product-card__body { display:flex; min-width:0; flex:1; flex-direction:column; gap:.35rem; padding:.65rem .72rem .72rem; }
.landing-product-card__meta { display:flex; min-width:0; min-height:.95rem; align-items:center; justify-content:space-between; gap:.35rem; }
.landing-product-card__vendor { display:inline-flex; min-width:0; flex:1; align-items:center; gap:.22rem; overflow:hidden; color:var(--color-text-muted); font-size:.58rem; font-weight:var(--font-weight-bold); text-overflow:ellipsis; white-space:nowrap; }
.landing-product-card__vendor :deep(svg) { flex:0 0 auto; width:.72rem; color:var(--color-brand-blue); }
.landing-product-card__rating { display:inline-flex; flex:0 0 auto; align-items:center; gap:.14rem; color:var(--color-text-body); font-size:.57rem; font-weight:var(--font-weight-bold); }
.landing-product-card__rating :deep(svg) { width:.7rem; color:var(--color-brand-yellow); fill:currentColor; }
.landing-product-card__rating small { color:var(--color-text-muted); font-size:.5rem; font-weight:var(--font-weight-semibold); }
.landing-product-card__sold { flex:0 0 auto; color:var(--color-text-muted); font-size:.56rem; }
.landing-product-card__title { display:-webkit-box; min-height:2.35rem; overflow:hidden; color:var(--color-text-heading); font-size:.76rem; font-weight:var(--font-weight-extrabold); line-height:var(--line-height-section); -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.landing-product-card__title:hover { color:var(--color-brand-blue); }
.landing-product-card__availability { display:flex; align-items:center; gap:.22rem; color:var(--color-success-fg); font-size:.58rem; font-weight:var(--font-weight-bold); }
.landing-product-card__availability :deep(svg) { width:.75rem; }
.landing-product-card__availability span:last-child { color:var(--color-text-muted); font-weight:var(--font-weight-semibold); }
.landing-product-card__availability--empty { color:var(--color-danger-fg); }
.landing-product-card__footer { display:flex; align-items:flex-end; justify-content:space-between; gap:.35rem; margin-top:auto; padding-top:.5rem; border-top:1px solid var(--color-border); }
.landing-product-card__prices { display:grid; min-width:0; gap:.12rem; }
.landing-product-card__old-price { color:var(--color-text-muted); font-size:.54rem; text-decoration:line-through; text-decoration-color:var(--color-danger-fg); white-space:nowrap; }
.landing-product-card__price { color:var(--color-text-heading); font-size:.82rem; white-space:nowrap; }
.landing-product-card__price small { color:var(--color-text-muted); font-size:.52rem; font-weight:var(--font-weight-semibold); }
.landing-product-card__footer :deep(button) { min-height:2.05rem; padding-inline:.55rem; flex:0 0 auto; font-size:.62rem; }
@media (max-width:380px) { .landing-product-card__body { padding-inline:.65rem; } .landing-product-card__footer { align-items:stretch; flex-direction:column; } .landing-product-card__footer :deep(button) { width:100%; } }
@media (prefers-reduced-motion:reduce) { .landing-product-card, .landing-product-card__image { transition:none; } .landing-product-card:hover { transform:none; } }
</style>
