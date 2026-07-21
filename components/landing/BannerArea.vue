<script setup lang="ts">
import placeholderImages from '~/lib/placeholder-images.json';
</script>

<template>
  <section class="py-16">
    <div class="section-container grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 relative overflow-hidden rounded-3xl h-[300px] group cursor-pointer shadow-lg shadow-blue-600/5">
        <NuxtImg :src="placeholderImages.banner_ad" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div class="absolute inset-0 bg-gradient-to-l from-slate-900 via-transparent to-transparent flex items-center pr-12">
          <div class="max-w-xs">
            <span class="inline-block px-3 py-1 bg-yellow-400 text-black text-xs font-black rounded-lg mb-4 uppercase tracking-wider">پیشنهاد ویژه</span>
            <h3 class="text-3xl font-black text-white mb-2 leading-tight">تامین مصالح پروژه‌های انبوه‌سازی</h3>
            <p class="text-slate-200 text-sm mb-6">تخفیف‌های استثنایی برای خریدهای تناژ بالا</p>
            <UButton color="white" class="font-bold px-6">مشاهده کالاها</UButton>
          </div>
        </div>
      </div>
      
      <div class="bg-blue-600 rounded-3xl p-8 flex flex-col justify-center text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-blue-600/20">
        <UIcon name="i-lucide-sparkles" class="absolute -top-6 -left-6 size-32 text-white/10 rotate-12" />
        <h3 class="text-2xl font-black mb-4 leading-snug">سامانه استعلام قیمت تجاریس</h3>
        <p class="text-blue-100 text-sm mb-8 leading-relaxed">کمتر از ۳۰ دقیقه از چندین تامین‌کننده معتبر، پیش‌فاکتور دریافت کنید.</p>
        <UButton variant="solid" class="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl w-fit">
          ثبت استعلام جدید
        </UButton>
      </div>
    </div>
  </section>
</template>