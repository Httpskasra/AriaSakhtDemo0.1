<template>
  <section class="py-16">
    <div class="section-container grid gap-6 md:grid-cols-3">
      <NuxtLink
        to="/products"
        class="group relative h-[var(--banner-height-mobile)] overflow-hidden rounded-card shadow-raised transition-transform duration-700 hover:-translate-y-1 md:col-span-2 md:h-[var(--banner-height-desktop)]"
      >
        <NuxtImg
          src="/banner/hBanner.webp"
          alt="کاتالوگ کالاهای صنعتی و ساختمانی در پلتفرم تجاریس"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div class="absolute inset-0 flex items-end bg-gradient-to-l from-slate-900 via-transparent to-transparent p-6 sm:p-8 md:items-center md:pr-12">
          <div class="max-w-xs">
            <span class="mb-4 inline-flex items-center rounded-field bg-brand-yellow px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-900">کاتالوگ تجاریس</span>
            <h3 class="mb-2 text-2xl font-black leading-tight text-white sm:text-3xl">مشاهده کالاهای صنعتی و ساختمانی</h3>
            <p class="mb-6 text-sm leading-relaxed text-slate-200 sm:text-base">کاتالوگ کالاهای ثبت‌شده در بازار تجاریس را بررسی کنید.</p>
            <span class="inline-flex items-center rounded-brand bg-white px-6 py-2 font-bold text-slate-900">مشاهده کالاها</span>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/contact" class="group relative flex flex-col justify-center overflow-hidden rounded-card bg-brand-blue p-8 text-white shadow-raised">
        <UIcon name="i-lucide-sparkles" class="absolute -top-6 -left-6 size-32 rotate-12 text-white/10" />
        <h3 class="mb-4 text-2xl font-black leading-snug">درخواست تأمین از تجاریس</h3>
        <p class="mb-8 text-sm leading-relaxed text-slate-100">اگر کالای موردنیازتان را پیدا نکردید، درخواست تأمین خود را برای تیم تجاریس ارسال کنید.</p>
        <span class="inline-flex w-fit items-center rounded-brand bg-white px-6 py-3 font-bold text-brand-blue transition-colors hover:bg-slate-50">
          ثبت درخواست تأمین
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
