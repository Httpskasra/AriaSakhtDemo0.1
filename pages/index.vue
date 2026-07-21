<template>
  <main class="min-h-screen bg-slate-50 overflow-x-hidden">
    <!-- Main Banner Section -->
    <section class="container mx-auto px-4 pt-6">
      <Banners />
    </section>

    <!-- Categories Grid Section -->
    <section class="container mx-auto px-4 mt-12 overflow-hidden">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-800">دسته‌بندی‌های صنعتی</h2>
        <NuxtLink to="/products" class="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
          مشاهده همه
          <UIcon name="i-lucide-arrow-left" />
        </NuxtLink>
      </div>
      <CategorySec />
    </section>

    <!-- Full Recommendation / Featured -->
    <section class="mt-16 bg-white py-12">
      <div class="container mx-auto px-4">
        <FullRecommend />
      </div>
    </section>

    <!-- Popular Products -->
    <section class="container mx-auto px-4 mt-16 pb-20">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar/Right side content -->
        <div class="w-full md:w-1/4">
          <Right />
        </div>
        
        <!-- Main Product Grid -->
        <div class="w-full md:w-3/4">
          <div class="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <h2 class="text-2xl font-bold text-slate-800">محصولات پرطرفدار</h2>
          </div>
          <MostPopular />
        </div>
      </div>
    </section>

    <!-- Blog and Info -->
    <section class="bg-slate-100 py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Blog />
          <Usefuls />
        </div>
      </div>
    </section>

    <!-- Newsletter / Connect -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <ConnectUs />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'تجاریس - مرکز مبادلات کالا و خدمات صنعتی',
  meta: [
    { name: 'description', content: 'پلتفرم جامع تامین تجهیزات، قطعات و مواد اولیه صنعتی ایران' }
  ]
})
</script>
