<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useProductById } from "~/composables/useGetProductByID";
import { useAddToCart } from "~/composables/useAddToCart";
import type { Product, ProductImage, ProductVariant, ProductVariantSelection } from "~/types/product";

const route = useRoute();
const productId = computed(() => String(route.params.id || ""));
const { data: product, loading, error, errorStatus, fetchProduct } = await useProductById(productId);
const { addProductToCart, loading: cartLoading } = useAddToCart();
const runtimeConfig = useRuntimeConfig();

const fallbackImage = "/products/building-material.jpg";
const selectedImageIndex = ref(0);
const isLightboxOpen = ref(false);
const lightboxOpener = ref<HTMLElement | null>(null);
const previousBodyOverflow = ref("");
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
const companyId = computed(() => {
  const value = product.value?.companyId;
  return typeof value === "string" ? value : value?._id || "";
});
const hasCompany = computed(() => {
  const value = product.value?.companyId;
  return typeof value === "object" && Boolean(value?.name);
});
const companyName = computed(() => {
  const value = product.value?.companyId;
  return typeof value === "object" && value?.name ? value.name : "اطلاعات تأمین‌کننده در دسترس نیست";
});
const productCategories = computed(() => Array.isArray(product.value?.categories) ? product.value.categories : []);
const categoryLabels = computed(() => productCategories.value
  .filter(Boolean)
  .map((category) => typeof category === "object" ? category?.name || "" : "")
  .filter(Boolean));
const categoryIds = computed(() => productCategories.value.map((category) => {
  if (typeof category === "string") return category;
  if (!category || typeof category !== "object") return "";
  return category._id || category.id || "";
}).filter(Boolean));
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
const displayTags = computed(() => product.value?.tags || []);
const currencyCode = computed(() => String(product.value?.currency || "IRR").toUpperCase());
const currencyLabel = computed(() => ({ IRR: "ریال", IRT: "تومان", USD: "دلار", EUR: "یورو" }[currencyCode.value] || currencyCode.value));
const basePrice = computed(() => Math.max(0, Number(product.value?.basePrice || 0)));
const discountPercent = computed(() => Math.min(Math.max(Number(product.value?.discount || 0), 0), 100));
const discountedBasePrice = computed(() => {
  return Math.max(basePrice.value - (basePrice.value * discountPercent.value) / 100, 0);
});
const effectiveBasePrice = computed(() => {
  const persistedPrice = Number(product.value?.finalPrice);
  return Number.isFinite(persistedPrice) && persistedPrice >= 0 ? persistedPrice : discountedBasePrice.value;
});
const selectedVariantSelections = computed<ProductVariantSelection[]>(() => (
  (product.value?.variants || [])
    .map((variant) => ({
      name: variant.name,
      value: selectedVariants.value[variantKey(variant)] || "",
    }))
    .filter((selection) => selection.value)
));
const hasVariants = computed(() => Boolean(product.value?.variants?.length));
const variantsComplete = computed(() => (
  !hasVariants.value || selectedVariantSelections.value.length === product.value?.variants.length
));
const selectedVariantAdjustment = computed(() => selectedVariantSelections.value.reduce((total, selection) => {
  const variant = product.value?.variants?.find((candidate) => candidate.name === selection.name);
  const option = variant?.options.find((candidate) => candidate.value === selection.value);
  return total + Math.max(0, Number(option?.priceModifier || 0));
}, 0));
const finalPrice = computed(() => Math.round(effectiveBasePrice.value + selectedVariantAdjustment.value));
const hasDiscount = computed(() => discountPercent.value > 0 && basePrice.value > effectiveBasePrice.value);
const hasRatings = computed(() => Number(product.value?.totalRatings || 0) > 0 || rating.value > 0);
const stockSummary = computed(() => {
  if (product.value?.status !== "active") return "امکان خرید در این وضعیت وجود ندارد";
  if (isOutOfStock.value) return "موجودی این محصول تمام شده است";
  return `موجودی: ${stockQuantity.value.toLocaleString("fa-IR")} عدد`;
});
const variantSelectionHint = computed(() => {
  if (!hasVariants.value) return "";
  const remaining = (product.value?.variants || []).filter((variant) => !selectedVariants.value[variantKey(variant)]).length;
  return remaining ? `${remaining.toLocaleString("fa-IR")} گزینه دیگر را انتخاب کنید` : "همه گزینه‌ها انتخاب شده‌اند";
});
const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "https://tejaris.ir").replace(/\/$/, ""));
const productUrl = computed(() => `${siteUrl.value}/products/${encodeURIComponent(productId.value)}`);
const absoluteImageUrl = (url: string) => /^https?:\/\//i.test(url) ? url : `${siteUrl.value}${url.startsWith("/") ? "" : "/"}${url}`;
const productSchema = computed(() => {
  const current = product.value;
  if (!current) return {};
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: current.name,
    description: current.description || undefined,
    sku: current.sku || undefined,
    image: images.value.map((image) => absoluteImageUrl(image.url)),
    offers: {
      "@type": "Offer",
      url: productUrl.value,
      priceCurrency: currencyCode.value,
      price: finalPrice.value,
      availability: isAvailable.value ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
});

useSeoMeta({
  title: () => product.value?.name || "جزئیات محصول",
  description: () => product.value?.description?.slice(0, 160) || "مشاهده جزئیات محصول در تجاریس",
  ogTitle: () => product.value?.name || "جزئیات محصول",
  ogDescription: () => product.value?.description?.slice(0, 160) || "مشاهده جزئیات محصول در تجاریس",
  ogImage: () => absoluteImageUrl(images.value[0]?.url || fallbackImage),
  ogUrl: () => productUrl.value,
});
useHead(() => ({
  meta: [{ property: "og:type", content: "product" }],
  link: [{ rel: "canonical", href: productUrl.value }],
  script: [{ type: "application/ld+json", children: JSON.stringify(productSchema.value) }],
}));

watch(images, (nextImages) => {
  if (selectedImageIndex.value >= nextImages.length) selectedImageIndex.value = 0;
}, { immediate: true });
watch(product, () => {
  quantity.value = 1;
  selectedVariants.value = {};
}, { immediate: true });

function selectImage(index: number) {
  if (!images.value[index]) return;
  selectedImageIndex.value = index;
  nextTick(() => {
    document.querySelector<HTMLElement>(`[data-product-thumbnail="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}

function moveImage(delta: number) {
  if (images.value.length < 2) return;
  const next = (selectedImageIndex.value + delta + images.value.length) % images.value.length;
  selectImage(next);
}

function openLightbox() {
  lightboxOpener.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  isLightboxOpen.value = true;
}

function focusLightbox() {
  document.getElementById("product-lightbox")?.focus();
}

function closeLightbox() {
  isLightboxOpen.value = false;
}

function restoreLightboxFocus() {
  lightboxOpener.value?.focus();
  lightboxOpener.value = null;
}

function handleLightboxTab(event: KeyboardEvent) {
  const lightbox = document.getElementById("product-lightbox");
  if (!lightbox) return;
  const focusable = [...lightbox.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex=\"-1\"])")]
    .filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleLightboxKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeLightbox();
    return;
  }
  if (event.key === "Tab") {
    handleLightboxTab(event);
    return;
  }
  if (images.value.length < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  moveImage(event.key === "ArrowLeft" ? 1 : -1);
}

watch(isLightboxOpen, (isOpen) => {
  if (!import.meta.client) return;
  if (isOpen) {
    previousBodyOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nextTick(focusLightbox);
  } else {
    document.body.style.overflow = previousBodyOverflow.value;
    nextTick(restoreLightboxFocus);
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = previousBodyOverflow.value;
});

function changeQuantity(delta: number) {
  const next = quantity.value + delta;
  quantity.value = Math.min(Math.max(1, next), Math.max(1, stockQuantity.value));
}

function variantKey(variant: ProductVariant) {
  return variant.id || variant.name;
}

function selectVariant(variant: ProductVariant, value: string) {
  selectedVariants.value = { ...selectedVariants.value, [variantKey(variant)]: value };
}

function handleVariantKeydown(event: KeyboardEvent, variant: ProductVariant, optionIndex: number) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const last = variant.options.length - 1;
  const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? last : Math.min(last, Math.max(0, optionIndex + (event.key === "ArrowLeft" ? 1 : -1)));
  const nextOption = variant.options[nextIndex];
  selectVariant(variant, nextOption.value);
  requestAnimationFrame(() => document.getElementById(`variant-${variantKey(variant)}-${nextIndex}`)?.focus());
}

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("fa-IR");
}

async function handleAddToCart() {
  if (!product.value || !productId.value || !isAvailable.value || cartLoading.value) return;
  if (!variantsComplete.value) {
    useToast().add({ title: "گزینه‌های محصول کامل نیست", description: "برای ادامه، همه گزینه‌های خرید را انتخاب کنید.", color: "warning" });
    return;
  }
  try {
    const selections = selectedVariantSelections.value;
    await addProductToCart({
      productId: productId.value,
      quantity: quantity.value,
      companyId: companyId.value || undefined,
      priceAtAdd: finalPrice.value,
      variants: selections.length ? selections : undefined,
      variant: selections.length === 1 ? selections[0] : undefined,
    });
  } catch {
    // useAddToCart already reports the actionable error to the user.
  }
}

function retry() {
  void fetchProduct();
}

function handleImageError(event: string | Event) {
  if (typeof event === "string") return;
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
      <p class="product-detail-state__message">{{ errorStatus === 404 ? "محصول موردنظر پیدا نشد." : error }}</p>
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
            <button type="button" class="product-gallery__main" aria-haspopup="dialog" @click="openLightbox" :aria-label="`مشاهده تصویر بزرگ ${product.name}`">
              <NuxtImg :src="mainImage" :alt="`${product.name} - تصویر ${selectedImageIndex + 1}`" width="800" height="800" sizes="sm:100vw md:50vw lg:40vw" format="webp" @error="handleImageError" />
              <span v-if="isOutOfStock" class="product-gallery__badge product-gallery__badge--danger">ناموجود</span>
              <span class="product-gallery__zoom"><UIcon name="i-lucide-expand" aria-hidden="true" /> بزرگ‌نمایی</span>
            </button>
            <div v-if="images.length > 1" class="product-gallery__controls">
              <UButton type="button" color="neutral" variant="soft" icon="i-lucide-chevron-right" aria-label="تصویر قبلی" @click="moveImage(-1)" />
              <span aria-live="polite">{{ (selectedImageIndex + 1).toLocaleString("fa-IR") }} از {{ images.length.toLocaleString("fa-IR") }}</span>
              <UButton type="button" color="neutral" variant="soft" icon="i-lucide-chevron-left" aria-label="تصویر بعدی" @click="moveImage(1)" />
            </div>
            <div v-if="images.length > 1" class="product-gallery__thumbnails" role="list" aria-label="انتخاب تصویر">
              <div v-for="(image, index) in images" :key="`${image.url}-${index}`" role="listitem">
                <button type="button" class="product-gallery__thumbnail" :class="{ 'product-gallery__thumbnail--active': index === selectedImageIndex }" :data-product-thumbnail="index" :aria-label="`نمایش تصویر ${index + 1}`" :aria-pressed="index === selectedImageIndex" @click="selectImage(index)">
                  <NuxtImg :src="image.url" :alt="`${product.name} - تصویر ${index + 1}`" width="160" height="160" loading="lazy" sizes="80px" format="webp" @error="handleImageError" />
                </button>
              </div>
            </div>
          </section>

          <section class="product-summary" aria-label="اطلاعات و خرید محصول">
            <div class="product-summary__eyebrow">
              <span class="product-status" :class="{ 'product-status--muted': !isAvailable }">
                <span class="product-status__dot" aria-hidden="true"></span>{{ statusLabel }}
              </span>
              <span class="product-summary__sku font-num" dir="ltr">SKU: {{ product.sku || "—" }}</span>
            </div>
            <div class="product-summary__identity">
              <h1 id="product-title" class="product-summary__title">{{ product.name }}</h1>
              <div class="product-summary__identity-meta">
                <div class="product-summary__supplier" :class="{ 'product-summary__supplier--muted': !hasCompany }">
                  <span class="product-summary__meta-label">تأمین‌کننده</span>
                  <p class="product-summary__company"><UIcon name="i-lucide-building-2" aria-hidden="true" /> {{ companyName }}</p>
                </div>
                <div v-if="hasRatings" class="product-summary__rating" aria-label="امتیاز محصول">
                  <span class="product-summary__stars" aria-hidden="true">
                    <UIcon v-for="star in 5" :key="star" name="i-lucide-star" :class="{ 'product-summary__star--active': star <= Math.round(rating) }" />
                  </span>
                  <span class="font-num">{{ rating.toFixed(1) }} از ۵</span>
                  <span class="font-num">({{ (product.totalRatings || 0).toLocaleString("fa-IR") }} نظر)</span>
                </div>
                <span v-else class="product-summary__rating product-summary__rating--empty">هنوز امتیازی ثبت نشده است</span>
              </div>
            </div>

            <div class="product-summary__price-card">
              <div class="product-summary__price-heading">
                <span class="product-summary__price-label">قیمت واحد</span>
                <span v-if="hasDiscount" class="product-summary__discount font-num">{{ discountPercent }}٪ تخفیف</span>
              </div>
              <div class="product-summary__price-line" aria-live="polite" aria-atomic="true">
                <strong class="product-summary__price font-num">{{ formatPrice(finalPrice) }} <small>{{ currencyLabel }}</small></strong>
                <span v-if="hasDiscount" class="product-summary__old-price font-num">{{ formatPrice(basePrice) }} {{ currencyLabel }}</span>
              </div>
              <span v-if="hasVariants" class="product-summary__price-note">
                {{ selectedVariantAdjustment ? `شامل ${formatPrice(selectedVariantAdjustment)} ${currencyLabel} افزایش گزینه‌ها` : "قیمت پایه پس از تخفیف" }}
              </span>
              <div class="product-summary__availability-row" role="status" aria-live="polite">
                <span class="product-summary__availability" :class="{ 'product-summary__availability--danger': !isAvailable }"><UIcon name="i-lucide-package-check" aria-hidden="true" /> {{ availabilityLabel }}</span>
                <span class="product-summary__stock font-num">{{ stockSummary }}</span>
              </div>
            </div>

            <div v-if="product.variants?.length" class="product-variants">
              <div class="product-variants__header">
                <div>
                  <h2>گزینه‌های خرید</h2>
                  <p>گزینه مناسب محصول را انتخاب کنید تا قیمت نهایی نمایش داده شود.</p>
                </div>
                <span class="product-variants__progress">{{ variantSelectionHint }}</span>
              </div>
              <fieldset v-for="variant in product.variants" :key="variant.id || variant.name" class="product-variant">
                <legend>{{ variant.name }}</legend>
                <div class="product-variant__options" role="radiogroup" :aria-label="`انتخاب ${variant.name}`">
                  <button
                    v-for="option in variant.options"
                    :key="option.value"
                    type="button"
                    role="radio"
                    class="product-variant__option"
                    :class="{ 'product-variant__option--selected': selectedVariants[variantKey(variant)] === option.value }"
                    :aria-checked="selectedVariants[variantKey(variant)] === option.value"
                    :id="`variant-${variantKey(variant)}-${variant.options.indexOf(option)}`"
                    :tabindex="selectedVariants[variantKey(variant)] === option.value || (!selectedVariants[variantKey(variant)] && variant.options.indexOf(option) === 0) ? 0 : -1"
                    @click="selectVariant(variant, option.value)"
                    @keydown="handleVariantKeydown($event, variant, variant.options.indexOf(option))">
                    <span class="product-variant__option-value">{{ option.value }}</span>
                    <span class="product-variant__option-price">
                      {{ Number(option.priceModifier || 0) > 0 ? `+${formatPrice(Number(option.priceModifier))} ${currencyLabel}` : "بدون افزایش" }}
                    </span>
                  </button>
                </div>
              </fieldset>
            </div>

            <div class="product-summary__purchase-block">
              <div class="product-summary__actions">
                <div v-if="isAvailable" class="product-summary__quantity-group">
                  <span id="product-quantity-label" class="product-summary__meta-label">تعداد سفارش</span>
                  <div class="quantity-control" role="group" aria-labelledby="product-quantity-label">
                    <button type="button" :disabled="quantity >= stockQuantity" aria-label="افزایش تعداد" @click="changeQuantity(1)">+</button>
                    <output class="font-num" aria-live="polite">{{ quantity.toLocaleString("fa-IR") }}</output>
                    <button type="button" :disabled="quantity <= 1" aria-label="کاهش تعداد" @click="changeQuantity(-1)">−</button>
                  </div>
                </div>
                <UButton type="button" size="xl" color="primary" class="product-summary__cart-button" :disabled="!isAvailable || !variantsComplete || cartLoading" :loading="cartLoading" @click="handleAddToCart">
                  <UIcon name="i-lucide-shopping-cart" aria-hidden="true" /> {{ !isAvailable ? "در حال حاضر قابل سفارش نیست" : variantsComplete ? "افزودن به سبد خرید" : "انتخاب گزینه‌های خرید" }}
                </UButton>
              </div>
              <div class="product-summary__secondary-actions">
                <NuxtLink to="/price-quote" class="product-summary__inquiry-link"><UIcon name="i-lucide-badge-dollar-sign" aria-hidden="true" /> استعلام قیمت و شرایط تأمین</NuxtLink>
                <FavoriteButton v-if="productId" :product-id="productId" class="product-summary__favorite" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section class="product-detail-sections" aria-label="اطلاعات و شرایط محصول">
        <section class="product-overview" aria-labelledby="product-overview-title">
          <header class="product-section-header">
            <div>
              <span class="product-section-header__eyebrow">شناخت و بررسی کالا</span>
              <h2 id="product-overview-title">درباره محصول</h2>
            </div>
            <span class="product-section-header__rule" aria-hidden="true"></span>
          </header>

          <div class="product-overview__grid">
            <article class="product-overview__description">
              <h3>توضیحات</h3>
              <p v-if="product.description" class="product-description">{{ product.description }}</p>
              <p v-else class="product-overview__empty">
                <UIcon name="i-lucide-file-text" aria-hidden="true" />
                توضیحی برای این محصول ثبت نشده است.
              </p>
            </article>
            <article class="product-overview__details">
              <h3>اطلاعات کلیدی</h3>
              <dl class="product-meta-list">
                <div><dt>شناسه کالا</dt><dd class="font-num">{{ product.sku || "—" }}</dd></div>
                <div><dt>وضعیت انتشار</dt><dd>{{ statusLabel }}</dd></div>
                <div><dt>موجودی</dt><dd class="font-num">{{ stockQuantity.toLocaleString("fa-IR") }} عدد</dd></div>
                <div><dt>تأمین‌کننده</dt><dd>{{ companyName }}</dd></div>
                <div><dt>واحد قیمت</dt><dd>{{ currencyLabel }}</dd></div>
              </dl>
            </article>
          </div>

          <div v-if="categoryLabels.length || displayTags.length" class="product-taxonomy">
            <div v-if="categoryLabels.length" class="product-taxonomy-group"><strong>دسته‌بندی‌ها</strong><div><span v-for="category in categoryLabels" :key="category" class="product-chip">{{ category }}</span></div></div>
            <div v-if="displayTags.length" class="product-taxonomy-group"><strong>برچسب‌ها</strong><div><span v-for="tag in displayTags" :key="tag" class="product-chip product-chip--muted">#{{ tag }}</span></div></div>
          </div>
        </section>

        <section class="product-tabs-section" aria-labelledby="product-tabs-title">
          <header class="product-section-header">
            <div>
              <span class="product-section-header__eyebrow">جزئیات، قوانین و بازخورد</span>
              <h2 id="product-tabs-title">اطلاعات تکمیلی</h2>
            </div>
            <span class="product-section-header__rule" aria-hidden="true"></span>
          </header>
          <InfoContainer :data="product" embedded />
        </section>

        <RelatedProducts v-if="categoryIds.length" :category-ids="categoryIds" :current-product-id="productId" />
      </section>
    </template>

    <div v-if="isLightboxOpen" class="product-lightbox-overlay" role="presentation" @click.self="closeLightbox">
      <div
        id="product-lightbox"
        class="product-lightbox"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :aria-label="`نمایش تصاویر ${product?.name || 'محصول'}`"
        @keydown="handleLightboxKeydown">
        <UButton type="button" color="neutral" variant="soft" icon="i-lucide-x" class="product-lightbox__close" aria-label="بستن تصویر" @click="closeLightbox" />
        <div class="product-lightbox__stage">
          <UButton v-if="images.length > 1" type="button" color="neutral" variant="soft" icon="i-lucide-chevron-right" class="product-lightbox__navigation product-lightbox__navigation--previous" aria-label="تصویر قبلی" @click="moveImage(-1)" />
          <NuxtImg :src="mainImage" :alt="`${product?.name || 'محصول'} - تصویر بزرگ ${selectedImageIndex + 1}`" class="product-lightbox__image" sizes="90vw" format="webp" @error="handleImageError" />
          <UButton v-if="images.length > 1" type="button" color="neutral" variant="soft" icon="i-lucide-chevron-left" class="product-lightbox__navigation product-lightbox__navigation--next" aria-label="تصویر بعدی" @click="moveImage(1)" />
        </div>
        <div class="product-lightbox__toolbar">
          <span v-if="images.length > 1" aria-live="polite">{{ (selectedImageIndex + 1).toLocaleString("fa-IR") }} از {{ images.length.toLocaleString("fa-IR") }}</span>
          <span v-else>تصویر محصول</span>
          <span class="product-lightbox__hint">برای جابه‌جایی از کلیدهای جهت‌دار استفاده کنید</span>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.product-detail-page { width: min(calc(100% - 2rem), var(--layout-content-max)); margin-inline: auto; padding-block: 1.25rem 4rem; }
.product-breadcrumb { display: flex; align-items: center; gap: .45rem; margin-bottom: 1rem; color: var(--color-text-muted); font-size: .78rem; overflow: hidden; }
.product-breadcrumb a { color: var(--color-brand-blue); white-space: nowrap; }
.product-breadcrumb span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-breadcrumb svg { flex: 0 0 auto; }

.product-detail-card, .product-tabs-section { background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-raised); }
.product-detail-card { padding: clamp(1rem, 2.6vw, 2rem); }
.product-detail-layout { display: grid; direction: ltr; grid-template-columns: minmax(0, .95fr) minmax(22rem, 1.05fr); gap: clamp(1.5rem, 4vw, 3.5rem); }
.product-gallery, .product-summary { min-width: 0; direction: rtl; }
.product-gallery { grid-column: 1; align-self: start; }
.product-summary { grid-column: 2; display: flex; flex-direction: column; }
.product-gallery__main { position: relative; display: block; width: 100%; aspect-ratio: 1.18; overflow: hidden; padding: 0; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-light); cursor: zoom-in; touch-action: manipulation; }
.product-gallery__main img { width: 100%; height: 100%; object-fit: contain; object-position: center; padding: clamp(.6rem, 2.4vw, 1.5rem); }
.product-gallery__main:focus-visible, .product-gallery__thumbnail:focus-visible, .product-lightbox__close:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.product-gallery__controls { display: flex; align-items: center; justify-content: center; gap: .65rem; margin-top: .65rem; color: var(--color-text-muted); font-size: .75rem; }
.product-gallery__controls :deep(button) { min-width: 2.5rem; min-height: 2.5rem; }
.product-gallery__badge { position: absolute; inset-block-start: 1rem; padding: .35rem .7rem; border-radius: var(--radius-pill); color: var(--color-bg-surface); font-size: .72rem; font-weight: 800; }
.product-gallery__badge--danger { inset-inline-end: 1rem; background: var(--color-danger-fg); }
.product-gallery__zoom { position: absolute; inset-inline-start: 1rem; inset-block-end: 1rem; display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .55rem; border-radius: var(--radius-pill); color: var(--color-text-body); background: color-mix(in srgb, var(--color-bg-surface) 88%, transparent); font-size: .7rem; }
.product-gallery__thumbnails { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .6rem; margin-top: .75rem; }
.product-gallery__thumbnails > div { min-width: 0; }
.product-gallery__thumbnail { display: block; width: 100%; aspect-ratio: 1; overflow: hidden; padding: .2rem; border: 2px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); opacity: .72; cursor: pointer; transition: border-color .16s ease, opacity .16s ease, box-shadow .16s ease; touch-action: manipulation; }
.product-gallery__thumbnail img { width: 100%; height: 100%; object-fit: contain; }
.product-gallery__thumbnail--active { border-color: var(--color-brand-blue); opacity: 1; }

.product-summary__eyebrow, .product-summary__rating, .product-summary__company, .product-summary__supplier { display: flex; align-items: center; gap: .5rem; }
.product-summary__eyebrow { justify-content: space-between; margin-bottom: 1rem; padding-bottom: .75rem; border-bottom: 1px solid var(--color-border); }
.product-summary__sku { max-width: 55%; color: var(--color-text-muted); font-size: .75rem; overflow-wrap: anywhere; }
.product-status { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-success-fg); font-size: .75rem; font-weight: 700; }
.product-status--muted { color: var(--color-text-muted); }
.product-status__dot { width: .45rem; height: .45rem; border-radius: var(--radius-pill); background: currentColor; }
.product-summary__identity { display: grid; gap: .7rem; }
.product-summary__title { margin: 0; color: var(--color-text-heading); font-size: clamp(1.45rem, 2.55vw, 2.15rem); font-weight: 900; line-height: 1.45; overflow-wrap: anywhere; }
.product-summary__identity-meta { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.product-summary__supplier { display: grid; min-width: 0; gap: .25rem; }
.product-summary__supplier--muted { opacity: .82; }
.product-summary__meta-label { color: var(--color-text-muted); font-size: .68rem; font-weight: 700; }
.product-summary__company { min-width: 0; margin: 0; color: var(--color-text-body); font-size: .82rem; font-weight: 700; overflow-wrap: anywhere; }
.product-summary__company--muted { color: var(--color-text-muted); font-style: italic; }
.product-summary__rating { color: var(--color-text-muted); font-size: .78rem; }
.product-summary__rating--empty { align-self: flex-end; font-size: .72rem; }
.product-summary__stars { display: inline-flex; color: var(--color-border-strong); }
.product-summary__stars svg { width: 1rem; height: 1rem; }
.product-summary__star--active { color: var(--color-brand-yellow); fill: currentColor; }
.product-summary__price-card { display: grid; gap: .45rem; margin-block: 1.35rem; padding: 1rem 1.1rem; border: 1px solid var(--color-info-border); border-radius: var(--radius-card); background: var(--color-info-bg); }
.product-summary__price-heading, .product-summary__price-line, .product-summary__availability-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
.product-summary__price-line { align-items: baseline; flex-wrap: wrap; }
.product-summary__price-label { color: var(--color-text-muted); font-size: .72rem; font-weight: 700; }
.product-summary__discount { padding: .25rem .5rem; border-radius: var(--radius-pill); color: var(--color-danger-fg); background: var(--color-danger-bg); font-size: .7rem; font-weight: 800; }
.product-summary__old-price { color: var(--color-text-muted); font-size: .8rem; text-decoration: line-through; white-space: nowrap; }
.product-summary__price { color: var(--color-brand-blue); font-size: clamp(1.65rem, 3.5vw, 2.15rem); font-weight: 900; }
.product-summary__price small { color: var(--color-text-muted); font-size: .8rem; font-weight: 700; }
.product-summary__price-note { color: var(--color-text-muted); font-size: .72rem; }
.product-summary__availability { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-success-fg); font-size: .75rem; font-weight: 700; }
.product-summary__availability--danger { color: var(--color-danger-fg); }
.product-summary__stock { color: var(--color-text-muted); font-size: .72rem; text-align: end; }
.product-variants { display: grid; gap: .8rem; margin-bottom: .25rem; }
.product-variants__header { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; padding: .25rem 0 .1rem; }
.product-variants__header h2 { margin: 0; color: var(--color-text-heading); font-size: .95rem; font-weight: 800; }
.product-variants__header p { margin: .25rem 0 0; color: var(--color-text-muted); font-size: .72rem; line-height: 1.7; }
.product-variants__progress { flex: 0 0 auto; padding: .3rem .55rem; border-radius: var(--radius-pill); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: .7rem; font-weight: 700; }
.product-variant { min-width: 0; padding: .75rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); }
.product-variant legend { padding-inline: .25rem; color: var(--color-text-heading); font-size: .8rem; font-weight: 800; }
.product-variant__options { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: .5rem; }
.product-variant__option { display: grid; min-height: 3.35rem; gap: .25rem; padding: .6rem .7rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-field); color: var(--color-text-body); background: var(--color-bg-surface); text-align: start; cursor: pointer; transition: border-color .16s ease, background-color .16s ease, box-shadow .16s ease; }
.product-variant__option:hover { border-color: var(--color-brand-blue); background: var(--color-info-bg); }
.product-variant__option:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.product-variant__option--selected { border-color: var(--color-brand-blue); background: var(--color-info-bg); box-shadow: inset 0 0 0 1px var(--color-brand-blue); }
.product-variant__option-value { color: var(--color-text-heading); font-size: .82rem; font-weight: 800; }
.product-variant__option-price { color: var(--color-text-muted); font-size: .68rem; }
.product-summary__purchase-block { margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--color-border); }
.product-summary__actions { display: flex; align-items: flex-end; gap: .65rem; }
.product-summary__quantity-group { display: grid; flex: 0 0 auto; gap: .35rem; }
.product-summary__cart-button { flex: 1; min-height: 3.25rem; }
.product-summary__cart-button :deep(svg) { width: 1.15rem; height: 1.15rem; }
.product-summary__secondary-actions { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-top: .7rem; }
.product-summary__inquiry-link { display: inline-flex; align-items: center; gap: .4rem; min-height: 2.5rem; padding: .5rem .7rem; border-radius: var(--radius-field); color: var(--color-brand-blue); font-size: .76rem; font-weight: 700; transition: background-color .16s ease, color .16s ease; }
.product-summary__inquiry-link:hover { background: var(--color-info-bg); }
.product-summary__inquiry-link:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.product-summary__favorite { flex: 0 0 3.25rem; min-height: 3.25rem; }
.quantity-control { display: inline-flex; align-items: center; justify-content: space-between; min-width: 7.5rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-field); background: var(--color-bg-surface); }
.quantity-control button { width: 2.5rem; min-height: 2.75rem; color: var(--color-brand-blue); font-size: 1.2rem; font-weight: 800; touch-action: manipulation; }
.quantity-control button:disabled { color: var(--color-text-disabled); cursor: not-allowed; }
.quantity-control button:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.quantity-control span, .quantity-control output { min-width: 2rem; color: var(--color-text-heading); font-weight: 800; text-align: center; }

.product-detail-sections { display: grid; gap: 2rem; margin-top: 1.75rem; }
.product-overview { padding-block: clamp(1.25rem, 3vw, 2rem); border-block: 1px solid var(--color-border); background: transparent; }
.product-tabs-section { display: grid; gap: .25rem; padding: clamp(1.1rem, 2.5vw, 1.75rem); }
.product-section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
.product-section-header__eyebrow { display: block; margin-bottom: .25rem; color: var(--color-text-muted); font-size: .72rem; font-weight: 700; }
.product-section-header h2 { margin: 0; color: var(--color-text-heading); font-size: clamp(1.05rem, 2vw, 1.3rem); font-weight: 900; }
.product-section-header__rule { width: 2.5rem; height: .25rem; flex: 0 0 auto; border-radius: var(--radius-pill); background: var(--color-brand-blue); }
.product-overview__grid { display: grid; direction: ltr; grid-template-columns: minmax(0, 1.2fr) minmax(16rem, .8fr); gap: clamp(1.5rem, 4vw, 3rem); }
.product-overview__description, .product-overview__details { min-width: 0; direction: rtl; }
.product-overview__details { padding-inline-end: clamp(1.5rem, 4vw, 3rem); border-inline-end: 1px solid var(--color-border); }
.product-overview h3 { margin: 0 0 .8rem; color: var(--color-text-heading); font-size: .9rem; font-weight: 800; }
.product-description { max-width: 68ch; margin: 0; color: var(--color-text-body); line-height: 2.1; white-space: pre-line; overflow-wrap: anywhere; }
.product-overview__empty { display: flex; align-items: center; gap: .5rem; max-width: 42rem; margin: 0; color: var(--color-text-muted); line-height: 1.9; }
.product-overview__empty svg { flex: 0 0 auto; color: var(--color-brand-blue); }
.product-meta-list, .product-attributes-grid { display: grid; gap: .55rem; margin: 0; }
.product-meta-list div, .product-attributes-grid div { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding-block: .55rem; border-bottom: 1px solid var(--color-border); }
.product-meta-list div:last-child, .product-attributes-grid div:last-child { border-bottom: 0; }
.product-meta-list dt, .product-attributes-grid dt { color: var(--color-text-muted); font-size: .78rem; }
.product-meta-list dd, .product-attributes-grid dd { min-width: 0; margin: 0; color: var(--color-text-heading); font-size: .82rem; font-weight: 700; text-align: end; overflow-wrap: anywhere; }
.product-attributes-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 1.25rem; }
.product-taxonomy { display: grid; gap: .7rem; margin-top: 1.5rem; padding-top: 1.1rem; border-top: 1px solid var(--color-border); }
.product-taxonomy-group { display: flex; align-items: flex-start; gap: 1rem; }
.product-taxonomy-group strong { flex: 0 0 6rem; color: var(--color-text-muted); font-size: .78rem; }
.product-taxonomy-group > div { display: flex; flex-wrap: wrap; gap: .45rem; }
.product-chip { display: inline-flex; max-width: 100%; padding: .35rem .65rem; border-radius: var(--radius-pill); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: .75rem; overflow-wrap: anywhere; }
.product-chip--muted { color: var(--color-text-body); background: var(--color-bg-light); }
.product-detail-state { display: grid; min-height: 14rem; place-items: center; gap: .75rem; padding: 2rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); text-align: center; }
.product-detail-state--loading { color: var(--color-brand-blue); background: var(--color-bg-surface); }
.product-detail-state--error { color: var(--color-danger-fg); background: var(--color-danger-bg); }
.product-detail-state__message { margin: 0; font-weight: 700; }
.product-detail-state__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; }
.product-lightbox-overlay { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 1rem; background: color-mix(in srgb, var(--color-overlay-strong) 86%, transparent); }
.product-lightbox { position: relative; display: grid; grid-template-rows: minmax(0, 1fr) auto; width: min(94vw, 68rem); max-width: 100%; max-height: calc(100dvh - 2rem); padding: .75rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); box-shadow: var(--shadow-raised); }
.product-lightbox:focus-visible { outline: none; box-shadow: var(--shadow-raised), var(--focus-ring); }
.product-lightbox__stage { position: relative; display: grid; width: 100%; height: min(68vh, 42rem); min-height: 16rem; place-items: center; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); }
.product-lightbox__image { display: block; width: auto; max-width: calc(100% - 5rem); height: auto; max-height: calc(100% - 2rem); object-fit: contain; user-select: none; }
.product-lightbox__close { position: absolute; inset-block-start: 1rem; inset-inline-end: 1rem; z-index: 2; }
.product-lightbox__navigation { position: absolute; inset-block-start: 50%; z-index: 1; min-width: 2.75rem; min-height: 2.75rem; transform: translateY(-50%); }
.product-lightbox__navigation--previous { inset-inline-start: .75rem; }
.product-lightbox__navigation--next { inset-inline-end: .75rem; }
.product-lightbox__toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem .25rem .1rem; color: var(--color-text-muted); font-size: .75rem; }
.product-lightbox__hint { font-size: .68rem; }

@media (max-width: 1024px) {
  .product-detail-layout { grid-template-columns: 1fr; }
  .product-summary { grid-column: auto; order: 1; }
  .product-gallery { grid-column: auto; order: 2; }
  .product-gallery__main { max-width: 42rem; margin-inline: auto; }
  .product-overview__grid { grid-template-columns: 1fr; }
  .product-overview__details { padding-inline-end: 0; padding-top: 1.25rem; border-inline-end: 0; border-top: 1px solid var(--color-border); }
}

@media (max-width: 640px) {
  .product-detail-page { width: min(calc(100% - 1rem), var(--layout-content-max)); padding-block: .75rem 2.5rem; }
  .product-detail-card, .product-tabs-section { padding: .85rem; }
  .product-detail-sections { gap: 1rem; margin-top: 1rem; }
  .product-summary__identity-meta { align-items: flex-start; flex-direction: column; }
  .product-summary__actions { flex-wrap: wrap; }
  .product-summary__quantity-group { flex: 1; }
  .product-summary__cart-button { order: 1; flex-basis: 100%; }
  .product-summary__secondary-actions { align-items: stretch; }
  .product-summary__inquiry-link { flex: 1; }
  .product-summary__favorite { flex: 1; }
  .quantity-control { width: 100%; }
  .product-taxonomy-group { flex-direction: column; gap: .5rem; }
  .product-variants__header { flex-direction: column; }
  .product-variants__progress { align-self: flex-start; }
  .product-variant__options { grid-template-columns: 1fr 1fr; }
  .product-gallery__thumbnails { display: flex; overflow-x: auto; padding-bottom: .25rem; scroll-snap-type: inline proximity; }
  .product-gallery__thumbnails > div { flex: 0 0 4.5rem; scroll-snap-align: start; }
  .product-gallery__main { aspect-ratio: 1; }
  .product-lightbox-overlay { padding: .5rem; }
  .product-lightbox { width: calc(100vw - 1rem); max-height: calc(100dvh - 1rem); padding: .5rem; }
  .product-lightbox__stage { height: min(64vh, 32rem); min-height: 14rem; }
  .product-lightbox__image { max-width: calc(100% - 3.5rem); max-height: calc(100% - 1rem); }
  .product-lightbox__navigation { min-width: 2.5rem; min-height: 2.5rem; }
  .product-lightbox__navigation--previous { inset-inline-start: .35rem; }
  .product-lightbox__navigation--next { inset-inline-end: .35rem; }
  .product-lightbox__toolbar { padding-top: .6rem; }
  .product-lightbox__hint { display: none; }
  .product-section-header { align-items: flex-start; flex-direction: column; gap: .6rem; }
  .product-section-header__rule { width: 2rem; }
  .product-attributes-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) { .product-gallery__thumbnail, .product-gallery__main, .product-status, .product-variant__option { transition: none; } }
</style>
