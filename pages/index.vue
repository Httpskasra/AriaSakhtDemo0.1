<template>
  <div class="landing-page">
    <HeroSection />

    <div class="section-container landing-page__section">
      <MarketplaceCategories />
    </div>

    <BannerArea />

    <div v-if="showOffersSection" class="section-container landing-page__section landing-page__featured-products">
      <SharedAsyncState
        v-if="landingProducts?.offers.error"
        state="error"
        title="نمایش پیشنهادهای ویژه انجام نشد"
        message="دریافت محصولات تخفیف‌دار با مشکل مواجه شد."
        @retry="refreshLandingProducts"
      />
      <LandingProductRail
        v-else
        id="featured-products-heading"
        title="پیشنهادهای ویژه"
        subtitle="محصولات تخفیف‌دار با قیمت نهایی به‌روز"
        :products="landingProducts?.offers.products"
        :loading="landingProductsLoading"
        badge="پیشنهاد ویژه"
        badge-tone="offer"
      />
    </div>

    <div v-if="showLatestSection" class="section-container landing-page__section">
      <SharedAsyncState
        v-if="landingProducts?.latest.error"
        state="error"
        title="نمایش جدیدترین محصولات انجام نشد"
        message="دریافت آخرین محصولات ثبت‌شده با مشکل مواجه شد."
        @retry="refreshLandingProducts"
      />
      <LandingProductRail
        v-else
        id="latest-products-heading"
        title="جدیدترین‌ها"
        subtitle="تازه‌ترین کالاهای فعال اضافه‌شده به بازار"
        :products="landingProducts?.latest.products"
        :loading="landingProductsLoading"
        badge="جدید"
        badge-tone="new"
      />
    </div>

    <div v-if="showPopularSection" class="section-container landing-page__section">
      <SharedAsyncState
        v-if="landingProducts?.popular.error"
        state="error"
        title="نمایش پرفروش‌ترین‌ها انجام نشد"
        message="دریافت رتبه فروش محصولات با مشکل مواجه شد."
        @retry="refreshLandingProducts"
      />
      <LandingProductRail
        v-else
        id="popular-products-heading"
        title="پرفروش‌ترین‌ها"
        subtitle="محصولاتی که بیشترین تعداد فروش ثبت‌شده را داشته‌اند"
        :products="landingProducts?.popular.products"
        :loading="landingProductsLoading"
        badge="پرفروش"
        badge-tone="popular"
      />
    </div>

    <div v-if="showRatedSection" class="section-container landing-page__section">
      <SharedAsyncState
        v-if="landingProducts?.rated.error"
        state="error"
        title="نمایش محبوب‌ترین‌ها انجام نشد"
        message="دریافت امتیاز محصولات با مشکل مواجه شد."
        @retry="refreshLandingProducts"
      />
      <LandingProductRail
        v-else
        id="rated-products-heading"
        title="محبوب‌ترین‌ها"
        subtitle="محصولاتی با بالاترین امتیاز ثبت‌شده از سوی کاربران"
        :products="landingProducts?.rated.products"
        :loading="landingProductsLoading"
        badge="محبوب"
        badge-tone="popular"
      />
    </div>

    <div class="section-container landing-page__section">
      <MarketplaceAdvantages />
    </div>

    <div class="section-container landing-page__section">
      <FeaturedVendors />
    </div>

    <CTASection />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getLatestProducts, getOfferProducts, getPopularProducts, getTopProducts } from '~/services/productService';
import type { Product } from '~/types/product';

type LandingProductResult = {
  products: Product[];
  error: boolean;
};

type LandingProductData = {
  offers: LandingProductResult;
  latest: LandingProductResult;
  popular: LandingProductResult;
  rated: LandingProductResult;
};

const emptyResult = (): LandingProductResult => ({ products: [], error: false });
const readResult = <T,>(result: PromiseSettledResult<T>, fallback: T): { products: T; error: boolean } => ({
  products: result.status === 'fulfilled' ? result.value : fallback,
  error: result.status === 'rejected',
});

const { data: landingProducts, pending: landingProductsLoading, refresh: refreshLandingProducts } = await useAsyncData<LandingProductData>(
  'landing-product-sections',
  async () => {
    const [offers, latest, popular, rated] = await Promise.allSettled([
      getOfferProducts(8, 1).then(response => response.items),
      getLatestProducts(8).then(response => response.items),
      getTopProducts(8).then(response => response.data),
      getPopularProducts(8).then(response => response.data),
    ]);

    return {
      offers: readResult(offers, []),
      latest: readResult(latest, []),
      popular: readResult(popular, []),
      rated: readResult(rated, []),
    };
  },
  { default: () => ({ offers: emptyResult(), latest: emptyResult(), popular: emptyResult(), rated: emptyResult() }) },
);

const showOffersSection = computed(() => Boolean(
  landingProductsLoading.value
  || landingProducts.value?.offers.error
  || landingProducts.value?.offers.products.length,
));
const showLatestSection = computed(() => Boolean(
  landingProductsLoading.value
  || landingProducts.value?.latest.error
  || landingProducts.value?.latest.products.length,
));
const showPopularSection = computed(() => Boolean(
  landingProductsLoading.value
  || landingProducts.value?.popular.error
  || landingProducts.value?.popular.products.length,
));
const showRatedSection = computed(() => Boolean(
  landingProductsLoading.value
  || landingProducts.value?.rated.error
  || landingProducts.value?.rated.products.length,
));

definePageMeta({
  title: 'مرکز مبادلات کالا و خدمات صنعتی',
});
</script>
