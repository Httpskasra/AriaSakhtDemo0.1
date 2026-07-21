<template>
  <footer class="bg-white border-t border-slate-100 pt-16">
    <div class="section-container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <!-- Brand Info -->
        <div class="space-y-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="size-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-layers" class="text-white size-5" />
            </div>
            <span class="text-xl font-black text-slate-800 tracking-tighter">تجاریس</span>
          </NuxtLink>
          <p class="text-slate-500 text-sm leading-relaxed">
            تجاریس بزرگترین بازار آنلاین تخصصی در حوزه صنعت و ساختمان است که با هدف حذف واسطه‌ها و شفافیت قیمت، خریداران را به تولیدکنندگان متصل می‌کند.
          </p>
          <div class="flex gap-4">
            <UButton variant="soft" color="neutral" square icon="i-simple-icons-instagram" />
            <UButton variant="soft" color="neutral" square icon="i-simple-icons-telegram" />
            <UButton variant="soft" color="neutral" square icon="i-simple-icons-linkedin" />
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-bold text-slate-800 mb-6">خدمات تجاریس</h4>
          <ul class="space-y-4 text-sm text-slate-600">
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">خرید عمده</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">استعلام قیمت</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">ثبت نام فروشندگان</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">تامین مالی زنجیره‌ای</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-800 mb-6">پشتیبانی</h4>
          <ul class="space-y-4 text-sm text-slate-600">
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">سوالات متداول</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">شرایط و قوانین</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">تماس با ما</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">گزارش تخلف</NuxtLink></li>
          </ul>
        </div>

        <!-- Trust Badges -->
        <div>
          <h4 class="font-bold text-slate-800 mb-6">نمادهای اعتماد</h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4">
              <NuxtImg src="https://picsum.photos/seed/trust1/100/100" class="opacity-50 grayscale hover:grayscale-0 transition-all" />
            </div>
            <div class="aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4">
              <NuxtImg src="https://picsum.photos/seed/trust2/100/100" class="opacity-50 grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-50 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-slate-400 font-medium">تمامی حقوق برای پلتفرم صنعتی تجاریس محفوظ است. © ۱۴۰۳</p>
        <p class="text-xs text-slate-300 font-num">v1.0.4 - Premium B2B Marketplace</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer logic
</script>