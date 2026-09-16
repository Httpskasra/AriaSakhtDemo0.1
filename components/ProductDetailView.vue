<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useProductById } from "~/composables/useGetProductByID";
import { useAddToCart } from "~/composables/useAddToCart";
import type { Product, ProductImage } from "~/types/product";

const route = useRoute();
const productId = computed(() => String(route.params.id || ""));
const { data: product, loading, error, fetchProduct } = await useProductById(productId);
const { addProductToCart, loading: cartLoading } = useAddToCart();

const fallbackImage = "/products/building-material.jpg";
const selectedImageIndex = ref(0);
const isLightboxOpen = ref(false);
const quantity = ref(1);
const selectedVariants = ref<Record<string, string>>({});

const images = computed<ProductImage[]>(() => {
  const productImages = product.value?.images?.filter((image) => Boolean(image?.url)) || [];
  return productImages.length ? productImages : [{ url: fallbackImage }];
});
const mainImage = computed(() => images.value[selectedImageIndex.value]?.url || fallbackImage);
const stockQuantity = computed(() => Math.max(0, Number(product.value?.stock?.quantity || 0)));
const isOutOfStock = computed(() => stockQuantity.value <= 0);
const isAvailable = computed(() => product.value?.status === "active" && !isOutOfStock.value);
const rating = computed(() => Math.max(0, Math.min(5, Number(product.value?.avgRate || 0))));
const finalPrice = computed(() => Number(product.value?.finalPrice ?? product.value?.basePrice ?? 0));
const companyId = computed(() => {
  const value = product.value?.companyId;
  return typeof value === "string" ? value : value?._id || "";
});
const companyName = computed(() => {
  const value = product.value?.companyId;
  return typeof value === "object" && value?.name ? value.name : "تأمین‌کننده معتبر";
});
const categoryLabels = computed(() => (product.value?.categories || []).map((category) => {
  if (typeof category === "string") return category;
  return category.name || category._id || category.id || "دسته‌بندی";
}));
const categoryIds = computed(() => (product.value?.categories || []).map((category) => (
  typeof category === "string" ? category : category._id || category.id || ""
)).filter(Boolean));
const statusLabel = computed(() => {
  const labels: Record<NonNullable<Product["status"]>, string> = {
    active: "فعال",
    inactive: "غیرفعال",
    draft: "پیش‌نویس",
    archived: "آرشیو",
    deleted: "حذف‌شده",
  };
  return labels[product.value?.status || "inactive"] || "نامشخص";
});
const availabilityLabel = computed(() => {
  if (product.value?.status !== "active") return "در حال حاضر قابل سفارش نیست";
  if (isOutOfStock.value) return "ناموجود";
  if (stockQuantity.value <= 5) return `تنها ${stockQuantity.value.toLocaleString("fa-IR")} عدد باقی مانده`;
  return "موجود و آماده سفارش";
});
const displayAttributes = computed(() => Object.entries(product.value?.attributes || {}));
const displayTags = computed(() => product.value?.tags || []);
const selectedVariant = computed(() => {
  const entries = Object.entries(selectedVariants.value).filter(([, value]) => value);
  return entries.length ? { name: entries[0][0], value: entries[0][1] } : undefined;
});
const productUrl = computed(() => `/products/${encodeURIComponent(productId.value)}`);

useSeoMeta({
  title: () => product.value?.name || "جزئیات محصول",
  description: () => product.value?.description?.slice(0, 160) || "مشاهده جزئیات محصول در تجاریس",
  ogTitle: () => product.value?.name || "جزئیات محصول",
  ogDescription: () => product.value?.description?.slice(0, 160) || "مشاهده جزئیات محصول در تجاریس",
  ogImage: () => images.value[0]?.url || fallbackImage,
  ogUrl: () => productUrl.value,
});

watch(images, (nextImages) => {
  if (selectedImageIndex.value >= nextImages.length) selectedImageIndex.value = 0;
}, { immediate: true });
watch(product, () => {
  quantity.value = 1;
  selectedVariants.value = {};
}, { immediate: true });

function selectImage(index: number) {
  selectedImageIndex.value = index;
}

function changeQuantity(delta: number) {
  const next = quantity.value + delta;
  quantity.value = Math.min(Math.max(1, next), Math.max(1, stockQuantity.value));
}

async function handleAddToCart() {
  if (!product.value || !productId.value || !isAvailable.value || cartLoading.value) return;
  try {
    await addProductToCart({
      productId: productId.value,
      quantity: quantity.value,
      companyId: companyId.value || undefined,
      priceAtAdd: finalPrice.value,
      variant: selectedVariant.value,
    });
  } catch {
    // useAddToCart already reports the actionable error to the user.
  }
}

function retry() {
  void fetchProduct();
}

function handleImageError(event: Event) {
  const image = event.target as HTMLImageElement;
  if (image.src.endsWith(fallbackImage)) return;
  image.src = fallbackImage;
}
</script>

<template>
  <main class="product-detail-page" dir="rtl">
    <div v-if="loading" class="product-detail-state product-detail-state--loading" role="status" aria-live="polite">
      <UIcon name="i-lucide-loader-circle" class="size-icon-hero animate-spin" aria-hidden="true" />
      <span>در حال بارگذاری اطلاعات محصول…</span>
    </div>

    <div v-else-if="error" class="product-detail-state product-detail-state--error" role="alert">
      <UIcon name="i-lucide-circle-alert" class="size-icon-hero" aria-hidden="true" />
      <p class="product-detail-state__message">{{ error }}</p>
      <div class="product-detail-state__actions">
        <UButton type="button" color="primary" @click="retry">تلاش دوباره</UButton>
        <UButton type="button" color="neutral" variant="soft" to="/products">بازگشت به فروشگاه</UButton>
      </div>
    </div>

    <template v-else-if="product">
      <nav class="product-breadcrumb" aria-label="مسیر صفحه">
        <NuxtLink to="/">خانه</NuxtLink>
        <UIcon name="i-lucide-chevron-left" aria-hidden="true" />
        <NuxtLink to="/products">فروشگاه</NuxtLink>
        <UIcon name="i-lucide-chevron-left" aria-hidden="true" />
        <span aria-current="page">{{ product.name }}</span>
      </nav>

      <section class="product-detail-card" aria-labelledby="product-title">
        <div class="product-detail-layout">
          <section class="product-gallery" aria-label="تصاویر محصول">
            <button type="button" class="product-gallery__main" @click="isLightboxOpen = true" aria-label="مشاهده تصویر بزرگ محصول">
              <img :src="mainImage" :alt="`${product.name} - تصویر ${selectedImageIndex + 1}`" width="800" height="800" @error="handleImageError" />
              <span v-if="isOutOfStock" class="product-gallery__badge product-gallery__badge--danger">ناموجود</span>
              <span v-else-if="product.discount" class="product-gallery__badge product-gallery__badge--success">{{ product.discount }}٪ تخفیف</span>
              <span class="product-gallery__zoom"><UIcon name="i-lucide-expand" aria-hidden="true" /> بزرگ‌نمایی</span>
            </button>
            <div class="product-gallery__thumbnails" role="list" aria-label="انتخاب تصویر">
              <button
                v-for="(image, index) in images"
                :key="`${image.url}-${index}`"
                type="button"
                class="product-gallery__thumbnail"
                :class="{ 'product-gallery__thumbnail--active': index === selectedImageIndex }"
                :aria-label="`نمایش تصویر ${index + 1}`"
                :aria-pressed="index === selectedImageIndex"
                @click="selectImage(index)">
                <img :src="image.url" :alt="`${product.name} - تصویر ${index + 1}`" width="160" height="160" loading="lazy" @error="handleImageError" />
              </button>
            </div>
          </section>

          <section class="product-summary">
            <div class="product-summary__eyebrow">
              <span class="product-status" :class="{ 'product-status--muted': !isAvailable }">
                <span class="product-status__dot" aria-hidden="true"></span>{{ statusLabel }}
              </span>
              <span class="product-summary__sku font-num">SKU: {{ product.sku }}</span>
            </div>
            <h1 id="product-title" class="product-summary__title">{{ product.name }}</h1>
            <p class="product-summary__company"><UIcon name="i-lucide-building-2" aria-hidden="true" /> {{ companyName }}</p>

            <div class="product-summary__rating" aria-label="امتیاز محصول">
              <span class="product-summary__stars" aria-hidden="true">
                <UIcon v-for="star in 5" :key="star" name="i-lucide-star" :class="{ 'product-summary__star--active': star <= Math.round(rating) }" />
              </span>
              <span class="font-num">{{ rating.toFixed(1) }} از ۵</span>
              <span class="font-num">({{ (product.totalRatings || 0).toLocaleString("fa-IR") }} نظر)</span>
            </div>

            <div class="product-summary__price-card">
              <span v-if="product.discount" class="product-summary__old-price font-num">{{ product.basePrice.toLocaleString("fa-IR") }} ریال</span>
              <strong class="product-summary__price font-num">{{ finalPrice.toLocaleString("fa-IR") }} <small>ریال</small></strong>
              <span class="product-summary__availability" :class="{ 'product-summary__availability--danger': !isAvailable }"><UIcon name="i-lucide-package-check" aria-hidden="true" /> {{ availabilityLabel }}</span>
            </div>

            <div v-if="product.variants?.length" class="product-variants">
              <div v-for="variant in product.variants" :key="variant.id || variant.name" class="product-variant">
                <label :for="`variant-${variant.name}`">{{ variant.name }}</label>
                <select :id="`variant-${variant.name}`" v-model="selectedVariants[variant.name]">
                  <option value="">انتخاب کنید</option>
                  <option v-for="option in variant.options" :key="option.value" :value="option.value">{{ option.value }}</option>
                </select>
              </div>
            </div>

            <div class="product-summary__actions">
              <div v-if="isAvailable" class="quantity-control" aria-label="تعداد محصول">
                <button type="button" :disabled="quantity >= stockQuantity" aria-label="افزایش تعداد" @click="changeQuantity(1)">+</button>
                <span class="font-num" aria-live="polite">{{ quantity.toLocaleString("fa-IR") }}</span>
                <button type="button" :disabled="quantity <= 1" aria-label="کاهش تعداد" @click="changeQuantity(-1)">−</button>
              </div>
              <UButton type="button" size="xl" color="primary" class="product-summary__cart-button" :disabled="!isAvailable || cartLoading" :loading="cartLoading" @click="handleAddToCart">
                <UIcon name="i-lucide-shopping-cart" aria-hidden="true" /> {{ isAvailable ? "افزودن به سبد خرید" : "در حال حاضر قابل سفارش نیست" }}
              </UButton>
              <FavoriteButton v-if="productId" :product-id="productId" class="product-summary__favorite" />
            </div>
          </section>
        </div>
      </section>

      <section class="product-detail-sections" aria-label="مشخصات کامل محصول">
        <div class="product-section-grid">
          <article class="product-information-card">
            <div class="product-section-heading"><UIcon name="i-lucide-file-text" aria-hidden="true" /><h2>درباره محصول</h2></div>
            <p class="product-description">{{ product.description || "توضیحی برای این محصول ثبت نشده است." }}</p>
          </article>
          <article class="product-information-card">
            <div class="product-section-heading"><UIcon name="i-lucide-list-checks" aria-hidden="true" /><h2>اطلاعات محصول</h2></div>
            <dl class="product-meta-list">
              <div><dt>شناسه کالا</dt><dd class="font-num">{{ product.sku || "—" }}</dd></div>
              <div><dt>وضعیت انتشار</dt><dd>{{ statusLabel }}</dd></div>
              <div><dt>موجودی</dt><dd class="font-num">{{ stockQuantity.toLocaleString("fa-IR") }} عدد</dd></div>
              <div><dt>تأمین‌کننده</dt><dd>{{ companyName }}</dd></div>
            </dl>
          </article>
        </div>

        <article v-if="displayAttributes.length" class="product-information-card">
          <div class="product-section-heading"><UIcon name="i-lucide-sliders-horizontal" aria-hidden="true" /><h2>مشخصات فنی</h2></div>
          <dl class="product-attributes-grid">
            <div v-for="([key, value]) in displayAttributes" :key="key"><dt>{{ key }}</dt><dd>{{ value }}</dd></div>
          </dl>
        </article>

        <article v-if="categoryLabels.length || displayTags.length" class="product-information-card product-taxonomy-card">
          <div v-if="categoryLabels.length" class="product-taxonomy-group"><strong>دسته‌بندی‌ها</strong><div><span v-for="category in categoryLabels" :key="category" class="product-chip">{{ category }}</span></div></div>
          <div v-if="displayTags.length" class="product-taxonomy-group"><strong>برچسب‌ها</strong><div><span v-for="tag in displayTags" :key="tag" class="product-chip product-chip--muted">#{{ tag }}</span></div></div>
        </article>

        <InfoContainer :data="product" />
        <RelatedProducts v-if="categoryIds.length" :category-ids="categoryIds" :current-product-id="productId" />
      </section>
    </template>

    <UModal v-model="isLightboxOpen" fullscreen>
      <div class="product-lightbox">
        <UButton type="button" color="neutral" variant="soft" icon="i-lucide-x" class="product-lightbox__close" aria-label="بستن تصویر" @click="isLightboxOpen = false" />
        <img :src="mainImage" :alt="(product?.name || 'محصول') + ' - تصویر بزرگ'" class="product-lightbox__image" @error="handleImageError" />
      </div>
    </UModal>
  </main>
</template>

<style scoped>
.product-detail-page { width: min(calc(100% - 2rem), 90rem); margin-inline: auto; padding-block: 1.25rem 3rem; }
.product-breadcrumb { display: flex; align-items: center; gap: .45rem; margin-bottom: 1rem; color: var(--color-text-muted); font-size: .78rem; overflow: hidden; }
.product-breadcrumb a { color: var(--color-brand-blue); white-space: nowrap; }
.product-breadcrumb span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-breadcrumb svg { flex: 0 0 auto; }
.product-detail-card, .product-information-card { background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-raised); }
.product-detail-card { padding: clamp(1rem, 3vw, 2.5rem); }
.product-detail-layout { display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(0, .98fr); gap: clamp(1.5rem, 5vw, 4rem); }
.product-gallery { min-width: 0; }
.product-gallery__main { position: relative; display: block; width: 100%; aspect-ratio: 1; overflow: hidden; padding: 0; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-light); cursor: zoom-in; }
.product-gallery__main img { width: 100%; height: 100%; object-fit: contain; padding: clamp(.75rem, 3vw, 2rem); }
.product-gallery__main:focus-visible, .product-gallery__thumbnail:focus-visible, .product-lightbox__close:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.product-gallery__badge { position: absolute; inset-block-start: 1rem; padding: .35rem .7rem; border-radius: var(--radius-pill); color: var(--color-bg-surface); font-size: .72rem; font-weight: 800; }
.product-gallery__badge--danger { inset-inline-end: 1rem; background: var(--color-danger-fg); }
.product-gallery__badge--success { inset-inline-start: 1rem; background: var(--color-success-fg); }
.product-gallery__zoom { position: absolute; inset-inline-start: 1rem; inset-block-end: 1rem; display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .55rem; border-radius: var(--radius-pill); color: var(--color-text-body); background: color-mix(in srgb, var(--color-bg-surface) 88%, transparent); font-size: .7rem; }
.product-gallery__thumbnails { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .65rem; margin-top: .75rem; }
.product-gallery__thumbnail { aspect-ratio: 1; overflow: hidden; padding: .2rem; border: 2px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); opacity: .72; cursor: pointer; }
.product-gallery__thumbnail img { width: 100%; height: 100%; object-fit: contain; }
.product-gallery__thumbnail--active { border-color: var(--color-brand-blue); opacity: 1; }
.product-summary { display: flex; min-width: 0; flex-direction: column; }
.product-summary__eyebrow, .product-summary__rating, .product-summary__company { display: flex; align-items: center; gap: .5rem; }
.product-summary__eyebrow { justify-content: space-between; margin-bottom: .8rem; }
.product-summary__sku { color: var(--color-text-muted); font-size: .75rem; }
.product-status { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-success-fg); font-size: .75rem; font-weight: 700; }
.product-status--muted { color: var(--color-text-muted); }
.product-status__dot { width: .45rem; height: .45rem; border-radius: 50%; background: currentColor; }
.product-summary__title { margin: 0; color: var(--color-text-heading); font-size: clamp(1.45rem, 3vw, 2.25rem); font-weight: 900; line-height: 1.45; }
.product-summary__company { margin: .5rem 0 1.25rem; color: var(--color-text-muted); font-size: .82rem; }
.product-summary__rating { margin-bottom: 1.35rem; color: var(--color-text-muted); font-size: .78rem; }
.product-summary__stars { display: inline-flex; color: var(--color-border-strong); }
.product-summary__stars svg { width: 1rem; height: 1rem; }
.product-summary__star--active { color: var(--color-brand-yellow); fill: currentColor; }
.product-summary__price-card { display: grid; gap: .25rem; margin-bottom: 1.25rem; padding: 1rem; border: 1px solid var(--color-info-border); border-radius: var(--radius-card); background: var(--color-info-bg); }
.product-summary__old-price { color: var(--color-text-muted); font-size: .8rem; text-decoration: line-through; }
.product-summary__price { color: var(--color-brand-blue); font-size: clamp(1.65rem, 4vw, 2.2rem); font-weight: 900; }
.product-summary__price small { color: var(--color-text-muted); font-size: .8rem; font-weight: 700; }
.product-summary__availability { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-success-fg); font-size: .75rem; font-weight: 700; }
.product-summary__availability--danger { color: var(--color-danger-fg); }
.product-variants { display: grid; gap: .75rem; margin-bottom: 1.25rem; }
.product-variant { display: grid; gap: .4rem; }
.product-variant label { color: var(--color-text-heading); font-size: .8rem; font-weight: 700; }
.product-variant select { min-height: 2.75rem; padding: .5rem .7rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-field); color: var(--color-text-body); background: var(--color-bg-surface); font: inherit; }
.product-summary__actions { display: flex; align-items: stretch; gap: .65rem; margin-top: auto; padding-top: 1.25rem; border-top: 1px solid var(--color-border); }
.product-summary__cart-button { flex: 1; min-height: 3.25rem; }
.product-summary__cart-button :deep(svg) { width: 1.15rem; height: 1.15rem; }
.product-summary__favorite { flex: 0 0 3.25rem; min-height: 3.25rem; }
.quantity-control { display: inline-flex; align-items: center; justify-content: space-between; min-width: 7.5rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-field); background: var(--color-bg-surface); }
.quantity-control button { width: 2.35rem; min-height: 2.75rem; color: var(--color-brand-blue); font-size: 1.2rem; font-weight: 800; }
.quantity-control button:disabled { color: var(--color-text-disabled); cursor: not-allowed; }
.quantity-control span { color: var(--color-text-heading); font-weight: 800; }
.product-detail-sections { display: grid; gap: 1rem; margin-top: 1rem; }
.product-section-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.product-information-card { padding: clamp(1rem, 2vw, 1.5rem); box-shadow: none; }
.product-section-heading { display: flex; align-items: center; gap: .5rem; margin-bottom: 1rem; color: var(--color-text-heading); }
.product-section-heading svg { color: var(--color-brand-blue); }
.product-section-heading h2 { margin: 0; font-size: 1rem; font-weight: 800; }
.product-description { margin: 0; color: var(--color-text-body); line-height: 2.1; white-space: pre-line; overflow-wrap: anywhere; }
.product-meta-list, .product-attributes-grid { display: grid; gap: .65rem; margin: 0; }
.product-meta-list div, .product-attributes-grid div { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-block: .55rem; border-bottom: 1px solid var(--color-border); }
.product-meta-list div:last-child, .product-attributes-grid div:last-child { border-bottom: 0; }
.product-meta-list dt, .product-attributes-grid dt { color: var(--color-text-muted); font-size: .78rem; }
.product-meta-list dd, .product-attributes-grid dd { margin: 0; color: var(--color-text-heading); font-size: .82rem; font-weight: 700; text-align: end; overflow-wrap: anywhere; }
.product-attributes-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 1.25rem; }
.product-taxonomy-card { display: grid; gap: 1rem; }
.product-taxonomy-group { display: flex; align-items: flex-start; gap: 1rem; }
.product-taxonomy-group strong { flex: 0 0 6rem; color: var(--color-text-muted); font-size: .78rem; }
.product-taxonomy-group > div { display: flex; flex-wrap: wrap; gap: .45rem; }
.product-chip { display: inline-flex; padding: .35rem .65rem; border-radius: var(--radius-pill); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: .75rem; }
.product-chip--muted { color: var(--color-text-body); background: var(--color-bg-light); }
.product-detail-state { display: grid; min-height: 20rem; place-items: center; gap: .75rem; padding: 2rem; border-radius: var(--radius-card); text-align: center; }
.product-detail-state--loading { color: var(--color-brand-blue); }
.product-detail-state--error { color: var(--color-danger-fg); background: var(--color-danger-bg); }
.product-detail-state__message { margin: 0; font-weight: 700; }
.product-detail-state__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; }
.product-lightbox { position: relative; display: grid; width: 100%; height: 100%; place-items: center; background: var(--color-overlay-strong); }
.product-lightbox__image { max-width: min(92vw, 75rem); max-height: 88vh; object-fit: contain; }
.product-lightbox__close { position: absolute; inset-block-start: 1rem; inset-inline-end: 1rem; z-index: 1; }

@media (max-width: 1024px) { .product-detail-layout { grid-template-columns: 1fr; } .product-gallery__main { max-width: 42rem; margin-inline: auto; } }
@media (max-width: 640px) { .product-detail-page { width: min(calc(100% - 1rem), 90rem); padding-block: .75rem 2rem; } .product-detail-card { padding: .75rem; } .product-section-grid, .product-attributes-grid { grid-template-columns: 1fr; } .product-summary__actions { flex-wrap: wrap; } .product-summary__cart-button { order: 1; flex-basis: 100%; } .product-summary__favorite { flex: 1; } .quantity-control { flex: 1; } .product-taxonomy-group { flex-direction: column; gap: .5rem; } }
@media (prefers-reduced-motion: reduce) { .product-gallery__thumbnail, .product-gallery__main, .product-status { transition: none; } }
</style>
