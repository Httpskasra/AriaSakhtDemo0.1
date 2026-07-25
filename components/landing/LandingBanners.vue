<script setup lang="ts">
const banners = [
  {
    title: 'مصالح پایه ساختمانی',
    subtitle: 'مشاهده کالاهای ثبت‌شده در بازار تجاریس',
    image: '/banner/hBanner.webp',
    color: 'bg-slate-900',
    colSpan: 'lg:col-span-2'
  },
  {
    title: 'تجهیزات ایمنی کار',
    subtitle: 'بررسی کالاها و فروشندگان ثبت‌شده',
    image: '/banner/v-banner.webp',
    color: 'bg-brand-blue',
    colSpan: 'lg:col-span-1'
  }
];
</script>

<template>
  <section class="py-16">
    <div class="section-container">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="banner in banners"
          :key="banner.title"
          to="/products"
          class="relative rounded-card overflow-hidden group h-64"
          :class="banner.colSpan"
        >
          <NuxtImg
            :src="banner.image"
            :alt="banner.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-l from-slate-900/80 to-transparent flex flex-col justify-center p-10 text-white">
            <div class="max-w-xs space-y-3">
              <h3 class="text-2xl font-black">{{ banner.title }}</h3>
              <p class="text-sm opacity-90">{{ banner.subtitle }}</p>
              <span class="inline-flex mt-4 rounded-brand bg-white px-4 py-2 font-bold text-slate-900 hover:bg-brand-yellow hover:text-slate-900">
                مشاهده محصولات
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
