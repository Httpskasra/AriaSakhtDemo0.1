<template>
  <div class="landing-page space-y-16 pb-20">
    <HeroSection />
    
    <div class="section-container">
      <MarketplaceCategories />
    </div>

    <BannerArea />

    <div class="section-container">
      <SharedAsyncState
        v-if="featuredProductsError"
        state="error"
        title="نمایش پیشنهادهای ویژه انجام نشد"
        message="دریافت محصولات تخفیف‌دار با مشکل مواجه شد."
        @retry="refreshFeaturedProducts" />
      <FeaturedProducts v-else :products="featuredProducts" :loading="featuredProductsLoading" />
    </div>

    <div class="section-container">
      <MarketplaceAdvantages />
    </div>

    <div class="section-container">
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
