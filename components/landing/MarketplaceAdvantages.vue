<template>
  <section class="py-10">
    <div class="bg-slate-900 rounded-card p-10 md:p-16 overflow-hidden relative shadow-2xl">
      <!-- Glow effect -->
      <div class="absolute -top-24 -right-24 size-96 bg-primary-500/20 blur-[120px] rounded-full"></div>

      <div class="relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-black text-white mb-4">چرا از تجاریس خرید کنیم؟</h2>
          <p class="text-slate-400 max-w-xl mx-auto">مزایای اختصاصی برای خریداران عمده و سازندگان پروژه‌های ساختمانی</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="adv in advantages" :key="adv.title" class="flex flex-col items-center text-center">
            <div class="size-14 bg-white/5 rounded-card flex items-center justify-center mb-6 ring-1 ring-white/10">
              <UIcon :name="adv.icon" class="size-icon-empty-state text-brand-yellow" />
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
    title: 'بررسی اطلاعات کالا و فروشنده',
    icon: 'i-lucide-shield-check',
    desc: 'اطلاعات کالا و تأمین‌کننده از مسیرهای ثبت‌شده پلتفرم بررسی می‌شود؛ برای جزئیات بیشتر با تیم تجاریس تماس بگیرید.'
  },
  {
    title: 'مسیر پرداخت و پیگیری سفارش',
    icon: 'i-lucide-wallet',
    desc: 'فرایند خرید، پرداخت و پیگیری سفارش از داخل پنل کاربری انجام می‌شود.'
  },
  {
    title: 'هماهنگی تأمین و ارسال',
    icon: 'i-lucide-truck',
    desc: 'برای سفارش‌های حجیم، هماهنگی ارسال بر اساس شرایط کالا، فروشنده و مقصد انجام می‌شود.'
  }
]
</script>
