<template>
  <section class="relative bg-slate-900 pt-20 pb-32 overflow-hidden">
    <!-- Industrial Background Element -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <NuxtImg 
        src="https://picsum.photos/seed/tejaris-ind/1920/1080" 
        data-ai-hint="industrial construction" 
        class="w-full h-full object-cover grayscale"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
    </div>

    <div class="section-container relative z-10">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
          </span>
          <span class="text-white text-xs font-bold tracking-wide">بزرگترین شبکه تامین‌کنندگان صنعتی ایران</span>
        </div>

        <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.2] mb-8">
          هوشمندانه خرید کنید،<br/>
          <span class="text-primary-500">حرفه‌ای بسازید.</span>
        </h1>

        <p class="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
          تجاریس پل ارتباطی مستقیم میان سازندگان، پیمانکاران و معتبرترین تولیدکنندگان تجهیزات صنعتی و ساختمانی کشور است.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <UButton size="xl" color="primary" class="px-10 rounded-xl shadow-xl shadow-primary-500/20 font-bold" label="شروع خرید" icon="i-lucide-shopping-bag" />
          <UButton size="xl" variant="outline" class="px-10 rounded-xl text-white border-white/20 hover:bg-white/5 font-bold" label="فروشنده شوید" icon="i-lucide-store" />
        </div>

        <!-- Dynamic Marketplace Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col border-r border-white/10 pr-6 first:border-0">
            <span class="text-white text-2xl font-black font-num mb-1">{{ stat.value }}</span>
            <span class="text-slate-400 text-xs font-medium">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-0"></div>
  </section>
</template>

<script setup>
const stats = [
  { label: 'تامین‌کننده فعال', value: '+۴,۵۰۰' },
  { label: 'کالای صنعتی', value: '+۱۲۵,۰۰۰' },
  { label: 'پروژه موفق', value: '+۱۰,۲۰۰' },
  { label: 'ضمانت بازگشت', value: '۱۰۰٪' }
]
</script>