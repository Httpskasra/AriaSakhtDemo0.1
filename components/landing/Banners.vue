<script setup lang="ts">
// Simulation of a CMS-driven banner area
const banners = [
  {
    title: 'فروش ویژه مصالح پایه',
    subtitle: 'تا ۲۰٪ تخفیف برای خریدهای عمده سیمان و گچ',
    image: 'https://picsum.photos/seed/tejaris-banner1/800/400',
    color: 'bg-slate-900',
    colSpan: 'lg:col-span-2'
  },
  {
    title: 'تجهیزات ایمنی کار',
    subtitle: 'استاندارد جهانی، قیمت رقابتی',
    image: 'https://picsum.photos/seed/tejaris-banner2/400/400',
    color: 'bg-brand-blue',
    colSpan: 'lg:col-span-1'
  }
];
</script>

<template>
  <section class="py-16">
    <div class="section-container">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          v-for="banner in banners" 
          :key="banner.title"
          class="relative rounded-[2rem] overflow-hidden group h-64"
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
              <UButton
                color="white"
                variant="solid"
                class="mt-4 font-bold text-slate-900 hover:bg-brand-yellow hover:text-slate-900"
              >
                مشاهده محصولات
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
