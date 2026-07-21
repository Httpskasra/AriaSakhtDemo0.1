<template>
  <div class="landing-page space-y-16 pb-20">
    <HeroSection />
    
    <div class="section-container">
      <MarketplaceCategories />
    </div>

    <div class="section-container">
      <BannerArea />
    </div>

    <div class="section-container">
      <FeaturedProducts />
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
definePageMeta({
  title: 'مرکز مبادلات کالا و خدمات صنعتی'
})
</script>