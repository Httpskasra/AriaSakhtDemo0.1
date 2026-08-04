<template>
  <footer class="site-footer border-t border-slate-200 bg-white">
    <div class="section-container">
      <div class="site-footer__main grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div class="space-y-4">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="flex size-9 items-center justify-center rounded-field bg-primary-500">
              <UIcon name="i-lucide-layers" class="size-icon-action text-white" />
            </div>
            <span class="text-xl font-black tracking-tighter text-slate-800">تجاریس</span>
          </NuxtLink>
          <p class="text-sm leading-relaxed text-slate-500">
            تجاریس بازار آنلاین تخصصی صنعت و ساختمان است؛ خریداران را مستقیماً به تولیدکنندگان و تأمین‌کنندگان ثبت‌شده متصل می‌کنیم.
          </p>
        </div>

        <div>
          <h4 class="mb-4 font-bold text-slate-800">خدمات تجاریس</h4>
          <ul class="space-y-2.5 text-sm text-slate-600">
            <li><NuxtLink to="/products" class="transition-colors hover:text-primary-500">خرید عمده</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">استعلام قیمت</NuxtLink></li>
            <li><NuxtLink to="/dashboard/company/register" class="transition-colors hover:text-primary-500">ثبت‌نام تأمین‌کنندگان</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">تأمین مالی زنجیره‌ای</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 font-bold text-slate-800">پشتیبانی</h4>
          <ul class="space-y-2.5 text-sm text-slate-600">
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">سوالات متداول</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">شرایط و قوانین</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">پشتیبانی</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">گزارش تخلف</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 font-bold text-slate-800">ارتباط با تجاریس</h4>
          <div class="flex flex-wrap gap-2">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              :aria-label="link.label"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 rounded-field border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              <UIcon :name="link.icon" class="size-icon-compact" />
              <span>{{ link.label }}</span>
            </a>
          </div>

          <div class="mt-5">
            <h4 class="mb-3 font-bold text-slate-800">نماد اعتماد</h4>
            <div class="flex max-w-[220px] items-center gap-2 rounded-card border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              <UIcon name="i-lucide-shield-check" class="size-icon-inline shrink-0 text-emerald-700" aria-hidden="true" />
              <span>اطلاعات مجوزها و اعتماد کسب‌وکار</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 py-5 md:flex-row">
        <p class="text-xs font-medium text-slate-400">تمامی حقوق برای پلتفرم صنعتی تجاریس محفوظ است. © ۱۴۰۳</p>
        <p class="text-xs font-num text-slate-300">v1.0.4 - Premium B2B Marketplace</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { label: 'اینستاگرام', href: 'https://www.instagram.com/', icon: 'i-lucide-instagram' },
  { label: 'تلگرام', href: 'https://t.me/', icon: 'i-lucide-send' },
  { label: 'لینکداین', href: 'https://www.linkedin.com/', icon: 'i-lucide-linkedin' },
  { label: 'ایکس', href: 'https://x.com/', icon: 'i-lucide-twitter' },
];
</script>

<style scoped>
.site-footer__main {
  padding-block: 2.5rem;
}

@media (max-width: 639px) {
  .site-footer__main {
    padding-block: 2rem;
  }
}
</style>
