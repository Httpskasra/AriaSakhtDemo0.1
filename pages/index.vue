<template>
  <div>
    <!-- Hero Banner -->
    <Banner />

    <!-- Main Content Container -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-1/4 hidden lg:block">
          <FilterSidebar />
          <div class="mt-8">
            <Banners />
          </div>
        </aside>

        <!-- Main Product Sections -->
        <div class="w-full lg:w-3/4 space-y-12">
          <!-- Top Categories -->
          <section>
            <PopularCategory />
          </section>

          <!-- Featured Offers -->
          <section>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">پیشنهادات ویژه</h2>
              <NuxtLink to="/products" class="text-green-600 hover:underline">مشاهده همه</NuxtLink>
            </div>
            <FullRecommend />
          </section>

          <!-- Most Popular Products -->
          <section>
            <MostPopular />
          </section>

          <!-- Middle Ad Banners -->
          <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SingleBanner />
            <SingleBanner />
          </section>

          <!-- Blog and News -->
          <section>
            <Blog />
          </section>
        </div>
      </div>
    </div>

    <!-- Bottom Marketing Sections -->
    <Usefuls />
    <ConnectUs />
  </div>
</template>

<script setup>
// Tejaris Landing Page
useHead({
  title: 'تجاریس - بازار آنلاین تجهیزات صنعتی',
  meta: [
    { name: 'description', content: 'مرکز خرید و فروش کالاها و خدمات صنعتی، ساختمانی و ابزارآلات در سراسر ایران' }
  ]
})
</script>
