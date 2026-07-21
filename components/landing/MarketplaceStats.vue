<script setup lang="ts">
/**
 * Marketplace Statistics Section
 * Rebuilt for stability and industrial trust.
 */
const stats = [
  { label: 'تامین‌کننده فعال', value: '۲,۴۵۰+', icon: 'i-lucide-users', color: 'blue' },
  { label: 'محصولات صنعتی', value: '۱۸,۰۰۰+', icon: 'i-lucide-package', color: 'blue' },
  { label: 'معاملات موفق', value: '۵۰,۰۰۰+', icon: 'i-lucide-activity', color: 'blue' },
  { label: 'پروژه فعال', value: '۱۲۰+', icon: 'i-lucide-trending-up', color: 'blue' },
];
</script>

<template>
  <section class="py-12 bg-white">
    <div class="section-container">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <div 
          v-for="stat in stats" 
          :key="stat.label"
          class="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
        >
          <div class="size-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UIcon :name="stat.icon" class="size-6 text-brand-blue" />
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 font-num">{{ stat.value }}</div>
            <div class="text-sm font-medium text-slate-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>