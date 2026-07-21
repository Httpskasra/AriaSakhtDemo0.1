<template>
  <section class="py-10">
    <div class="bg-slate-900 rounded-[2rem] p-10 md:p-16 overflow-hidden relative shadow-2xl">
      <!-- Glow effect -->
      <div class="absolute -top-24 -right-24 size-96 bg-primary-500/20 blur-[120px] rounded-full"></div>
      
      <div class="relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-black text-white mb-4">چرا از تجاریس خرید می‌کنیم؟</h2>
          <p class="text-slate-400 max-w-xl mx-auto">مزایای اختصاصی برای خریداران عمده و سازندگان پروژه‌های ساختمانی</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="adv in advantages" :key="adv.title" class="flex flex-col items-center text-center">
            <div class="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/10">
              <UIcon :name="adv.icon" class="size-7 text-brand-yellow" />
            </div>
            <h3 class="text-lg font-bold text-white mb-3">{{ adv.title }}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const advantages = [
  { 
    title: 'تضمین اصالت و سلامت', 
    icon: 'i-lucide-shield-check', 
    desc: 'تمامی کالاهای عرضه شده توسط کارشناسان فنی تجاریس بررسی و تایید می‌شوند.' 
  },
  { 
    title: 'پرداخت امن و اقساطی', 
    icon: 'i-lucide-wallet', 
    desc: 'امکان خرید اعتباری و پرداخت امن از طریق کیف پول تجاریس برای پیمانکاران.' 
  },
  { 
    title: 'لجستیک هوشمند کشوری', 
    icon: 'i-lucide-truck', 
    desc: 'ارسال سریع به تمام نقاط ایران با بهینه‌ترین هزینه حمل و نقل برای بارهای حجیم.' 
  }
]
</script>