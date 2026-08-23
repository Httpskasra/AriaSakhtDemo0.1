<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useProductById } from '~/composables/useGetProductByID';
import { useAddToCart } from '~/composables/useAddToCart';

const route = useRoute();
const id = route.params.id as string;
const { data: product, loading, error } = useProductById(id);
const { addProductToCart, loading: cartLoading } = useAddToCart();
const selectedImageIndex = ref(0);
const localImageFallback = '/products/building-material.jpg';

// C4: Dynamic SEO Meta Tags
watch(product, (newVal) => {
  if (newVal) {
    useSeoMeta({
      title: newVal.name,
      ogTitle: newVal.name,
      description: newVal.description || `خرید ${newVal.name} با بهترین قیمت در تجاریس`,
      ogDescription: newVal.description,
      ogImage: newVal.images?.[0]?.url || localImageFallback,
      twitterCard: 'summary_large_image',
    });
  }
}, { immediate: true });

const handleAddToCart = async () => {
  if (!product.value) return;
  await addProductToCart({
    productId: product.value.id || product.value._id,
    quantity: 1,
    companyId: typeof product.value.companyId === 'string' ? product.value.companyId : product.value.companyId._id,
    priceAtAdd: product.value.finalPrice || product.value.basePrice
  });
};

const images = computed(() => product.value?.images?.length ? product.value.images : [{ url: localImageFallback }]);
const mainImage = computed(() => images.value[selectedImageIndex.value]?.url || localImageFallback);
const productRating = computed(() => Math.max(0, Math.min(5, Number(product.value?.avgRate || 0))));
const isOutOfStock = computed(() => (product.value?.stock?.quantity ?? 0) <= 0);
const isLightboxOpen = ref(false);
watch(() => product.value?.images, () => { selectedImageIndex.value = 0; }, { immediate: true });
const selectImage = (index: number) => { selectedImageIndex.value = index; };
</script>

<template>
  <div class="product-detail-page">
    <div v-if="loading" class="product-detail-state product-detail-state--loading">
      <UIcon name="i-lucide-loader-circle" class="size-icon-hero animate-spin text-primary" />
    </div>

    <div v-else-if="error" class="product-detail-state product-detail-state--error">
      <p class="product-detail-state__message">{{ error }}</p>
      <UButton color="gray" variant="ghost" class="mt-4" to="/products">بازگشت به فروشگاه</UButton>
    </div>

    <div v-else-if="product" class="product-detail-card premium-card">
      <div class="product-detail-layout">
        <!-- Product Images -->
        <div class="product-gallery">
          <button type="button" class="product-gallery__main" @click="isLightboxOpen = true" aria-label="مشاهده تصویر بزرگ محصول">
            <NuxtImg :src="mainImage" :alt="`${product.name} - تصویر ${selectedImageIndex + 1}`" class="w-full h-full object-cover" width="800" height="800" />
            <div v-if="isOutOfStock" class="product-gallery__badge product-gallery__badge--danger">
              ناموجود
            </div>
            <div v-else-if="product.discount" class="product-gallery__badge product-gallery__badge--success">
              {{ product.discount }}% تخفیف
            </div>
          </button>
          
          <div class="product-gallery__thumbnails">
            <button v-for="(img, index) in images" :key="`${img.url}-${index}`" type="button" class="product-gallery__thumbnail" :class="{ 'product-gallery__thumbnail--active': index === selectedImageIndex }" :aria-label="`انتخاب تصویر ${index + 1}`" :aria-pressed="index === selectedImageIndex" @click="selectImage(index)">
              <NuxtImg :src="img.url" :alt="`${product.name} - تصویر ${index + 1}`" class="w-full h-full object-cover transition-opacity" :class="index === selectedImageIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'" width="200" height="200" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-summary">
          <h1 class="product-summary__title">{{ product.name }}</h1>
          <p class="product-summary__sku font-num">شناسه کالا: {{ product.sku }}</p>

          <div class="product-summary__rating">
            <div class="product-summary__stars">
              <UIcon name="i-lucide-star" v-for="i in 5" :key="i" class="size-icon-action" :class="{ 'product-summary__star--active': i <= Math.round(productRating) }" />
            </div>
            <span class="product-summary__rating-label font-num" :aria-label="`امتیاز ${productRating} از ۵`">{{ productRating.toFixed(1) }} از ۵ ({{ product.totalRatings || 0 }} نظر)</span>
          </div>

          <div class="product-summary__price-card">
            <div v-if="product.discount" class="product-summary__old-price font-num">
              {{ product.basePrice.toLocaleString() }} ریال
            </div>
            <div class="product-summary__price font-num">
              {{ (product.finalPrice || product.basePrice).toLocaleString() }} <span>ریال</span>
            </div>
          </div>

          <div class="product-summary__description">
            {{ product.description }}
          </div>

          <div class="product-summary__actions">
            <UButton
              size="xl"
              :color="isOutOfStock ? 'gray' : 'primary'"
              block
              :disabled="isOutOfStock || cartLoading"
              :loading="cartLoading"
              @click="handleAddToCart"
              class="product-summary__cart-button"
            >
              {{ isOutOfStock ? 'ناموجود' : 'افزودن به سبد خرید' }}
            </UButton>
            <FavoriteButton v-if="product.id || product._id" :product-id="product.id || product._id || ''" class="product-summary__favorite" />
          </div>
        </div>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <UModal v-model="isLightboxOpen" fullscreen>
      <div class="product-lightbox">
        <UButton color="white" variant="ghost" icon="i-lucide-x" class="absolute top-6 right-6 z-50 scale-150" @click="isLightboxOpen = false" />
        <NuxtImg :src="mainImage" :alt="`${product?.name || 'محصول'} - تصویر بزرگ`" class="product-lightbox__image" width="1200" height="1200" />
      </div>
    </UModal>
  </div>
</template>

<style scoped>
.product-detail-page { width: min(100% - 2rem, 90rem); margin-inline: auto; padding-block: 2rem; }
.product-detail-state { display: grid; min-height: 18rem; place-items: center; gap: .75rem; padding: 1.5rem; border-radius: var(--radius-card); text-align: center; }
.product-detail-state--loading { color: var(--color-brand-blue); }
.product-detail-state--error { background: var(--color-danger-bg); color: var(--color-danger-fg); }
.product-detail-state__message { font-weight: 700; }
.product-detail-card { padding: clamp(1.25rem, 3vw, 2.5rem); }
.product-detail-layout { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1.5rem, 5vw, 3rem); }
.product-gallery { display: grid; gap: 1rem; }
.product-gallery__main { position: relative; display: block; width: 100%; aspect-ratio: 1; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-light); cursor: zoom-in; }
.product-gallery__main:focus-visible, .product-gallery__thumbnail:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.product-gallery__main img, .product-gallery__thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.product-gallery__badge { position: absolute; inset-block-start: 1rem; padding: .3rem .7rem; border-radius: var(--radius-pill); color: var(--color-bg-surface); font-size: .75rem; font-weight: 800; }
.product-gallery__badge--danger { inset-inline-end: 1rem; background: var(--color-danger-fg); }
.product-gallery__badge--success { inset-inline-start: 1rem; background: var(--color-success-fg); }
.product-gallery__thumbnails { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; }
.product-gallery__thumbnail { aspect-ratio: 1; overflow: hidden; border: 2px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); opacity: .72; }
.product-gallery__thumbnail--active { border-color: var(--color-brand-blue); opacity: 1; }
.product-summary { display: flex; min-width: 0; flex-direction: column; }
.product-summary__title { margin: 0 0 .35rem; color: var(--color-text-heading); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; }
.product-summary__sku { margin-bottom: 1.5rem; color: var(--color-text-muted); font-size: .8rem; }
.product-summary__rating { display: flex; align-items: center; gap: .5rem; margin-bottom: 1.5rem; }
.product-summary__stars { display: flex; color: var(--color-brand-yellow); }
.product-summary__star--active { fill: currentColor; }
.product-summary__rating > span { color: var(--color-text-muted); font-size: .8rem; }
.product-summary__price-card { margin-bottom: 2rem; padding: 1.25rem; border-radius: var(--radius-card); background: var(--color-bg-light); }
.product-summary__old-price { margin-bottom: .25rem; color: var(--color-text-muted); font-size: 1rem; text-decoration: line-through; }
.product-summary__price { color: var(--color-brand-blue); font-size: clamp(1.75rem, 4vw, 2.25rem); font-weight: 900; }
.product-summary__price span { font-size: .875rem; font-weight: 600; }
.product-summary__description { margin-bottom: 2rem; color: var(--color-text-body); line-height: 2; }
.product-summary__actions { display: flex; align-items: center; gap: 1rem; margin-top: auto; padding-top: 2rem; border-top: 1px solid var(--color-border); }
.product-summary__cart-button { flex: 1; min-height: 3.5rem; }
.product-summary__favorite { width: 3.5rem; height: 3.5rem; }
.product-lightbox { position: relative; display: flex; height: 100%; align-items: center; justify-content: center; background: var(--color-overlay-strong); }
.product-lightbox__image { max-width: 100%; max-height: 90vh; object-fit: contain; }

@media (max-width: 1024px) { .product-detail-layout { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .product-detail-page { width: min(100% - 1rem, 90rem); padding-block: 1rem; } .product-detail-card { padding: 1rem; } .product-summary__actions { align-items: stretch; flex-direction: column; } .product-summary__favorite { width: 100%; } }
</style>
