<template>
  <section class="py-4">
    <div class="flex items-end justify-between mb-10">
      <div>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 mb-3">دسته‌بندی‌های صنعتی</h2>
        <p class="text-slate-500 text-sm md:text-base">دسترسی سریع به طیف گسترده کالاهای ساختمانی و تجهیزات فنی</p>
      </div>
      <UButton variant="link" color="primary" trailing-icon="i-lucide-arrow-left" label="مشاهده همه" />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      <NuxtLink 
        v-for="cat in categories" 
        :key="cat.name"
        to="/products"
        class="premium-card p-6 flex flex-col items-center text-center group cursor-pointer"
      >
        <div class="size-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary-50 transition-colors">
          <UIcon :name="cat.icon" class="size-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
        </div>
        <h3 class="text-sm font-bold text-slate-800 mb-1.5">{{ cat.name }}</h3>
        <span class="text-[10px] text-slate-400 font-num uppercase tracking-wider">{{ cat.count }} کالا</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const categories = [
  { name: 'آهن آلات', icon: 'i-lucide-building-2', count: '۱۲,۴۰۰' },
  { name: 'تجهیزات برقی', icon: 'i-lucide-plug', count: '۸,۹۰۰' },
  { name: 'شیرآلات و لوله', icon: 'i-lucide-droplets', count: '۱۵,۶۰۰' },
  { name: 'مصالح پایه', icon: 'i-lucide-layers', count: '۵,۲۰۰' },
  { name: 'ابزارآلات', icon: 'i-lucide-wrench', count: '۲۲,۰۰۰' },
  { name: 'تهویه مطبوع', icon: 'i-lucide-fan', count: '۳,۴۰۰' }
]
</script>