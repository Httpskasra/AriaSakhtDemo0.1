<template>
  <div class="landing-page">
    <HeroSection />
    
    <div class="section-container landing-page__section">
      <MarketplaceCategories />
    </div>

    <BannerArea />

    <div v-if="featuredProductsError || featuredProductsLoading || featuredProducts?.length" class="section-container landing-page__section landing-page__featured-products">
      <SharedAsyncState
        v-if="featuredProductsError"
        state="error"
        title="نمایش پیشنهادهای ویژه انجام نشد"
        message="دریافت محصولات تخفیف‌دار با مشکل مواجه شد."
        @retry="refreshFeaturedProducts" />
      <FeaturedProducts v-else :products="featuredProducts" :loading="featuredProductsLoading" />
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

<script setup>
import { getOfferProducts } from '~/services/productService';

const { data: featuredProducts, pending: featuredProductsLoading, error: featuredProductsError, refresh: refreshFeaturedProducts } = await useAsyncData(
  'landing-featured-products',
  async () => {
    const response = await getOfferProducts(8, 1);
    return response.items;
  },
  { default: () => [] },
);

definePageMeta({
  title: 'مرکز مبادلات کالا و خدمات صنعتی'
})
</script>
