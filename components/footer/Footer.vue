<template>
  <footer class="border-t border-slate-100 bg-white pt-16">
    <div class="section-container">
      <div class="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="flex size-9 items-center justify-center rounded-field bg-primary-500">
              <UIcon name="i-lucide-layers" class="size-icon-action text-white" />
            </div>
            <span class="text-xl font-black tracking-tighter text-slate-800">تجاریس</span>
          </NuxtLink>
          <p class="text-sm leading-relaxed text-slate-500">
            تجاریس بازار آنلاین تخصصی در حوزه صنعت و ساختمان است که با هدف حذف واسطه‌ها و شفافیت قیمت، خریداران را به تولیدکنندگان متصل می‌کند.
          </p>
        </div>

        <div>
          <h4 class="mb-6 font-bold text-slate-800">خدمات تجاریس</h4>
          <ul class="space-y-4 text-sm text-slate-600">
            <li><NuxtLink to="/products" class="transition-colors hover:text-primary-500">خرید عمده</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">استعلام قیمت</NuxtLink></li>
            <li><NuxtLink to="/dashboard/company/register" class="transition-colors hover:text-primary-500">ثبت نام فروشندگان</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">تامین مالی زنجیره‌ای</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="mb-6 font-bold text-slate-800">پشتیبانی</h4>
          <ul class="space-y-4 text-sm text-slate-600">
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">سوالات متداول</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">شرایط و قوانین</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">تماس با ما</NuxtLink></li>
            <li><NuxtLink to="/contact" class="transition-colors hover:text-primary-500">گزارش تخلف</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="mb-6 font-bold text-slate-800">شبکه‌های اجتماعی</h4>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              :aria-label="link.label"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 rounded-field border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              <UIcon :name="link.icon" class="size-icon-compact" />
              <span>{{ link.label }}</span>
            </a>
          </div>

          <div class="mt-8">
            <h4 class="mb-6 font-bold text-slate-800">نمادهای اعتماد</h4>
            <div class="flex max-w-[180px] items-center justify-center rounded-card border border-slate-100 bg-slate-50 p-4">
              <a
                referrerpolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=757913&Code=vD6SnU7LKkt7EG32Ebd2IUcg96mhskZV"
                rel="noopener noreferrer"
                aria-label="نماد اعتماد اینماد برای پلتفرم تجاریس"
              >
                <img
                  referrerpolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=757913&Code=vD6SnU7LKkt7EG32Ebd2IUcg96mhskZV"
                  alt="نماد اعتماد اینماد برای پلتفرم تجاریس"
                  width="180"
                  height="180"
                  class="h-auto w-full cursor-pointer"
                  loading="lazy"
                  code="vD6SnU7LKkt7EG32Ebd2IUcg96mhskZV"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 border-t border-slate-50 py-8 md:flex-row">
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
