<template>
  <section aria-labelledby="landing-hero-title" class="relative overflow-hidden bg-slate-900 py-14 pb-24 sm:py-18 sm:pb-28">
    <div class="pointer-events-none absolute inset-0 z-0 opacity-20">
      <img
        src="/products/bg.png"
        alt="نمایش محیط صنعتی و ساخت‌وساز در پلتفرم تجاریس"
        data-ai-hint="industrial construction"
        class="h-full w-full object-cover grayscale"
      />
      <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
    </div>

    <div class="section-container relative z-10">
      <div class="max-w-4xl">
        <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-yellow opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-brand-yellow"></span>
          </span>
          <span class="text-xs font-bold tracking-wide text-white">بازار آنلاین تامین‌کنندگان صنعتی و ساختمانی</span>
        </div>

        <h1 id="landing-hero-title" class="mb-6 text-4xl font-black leading-[1.2] text-white sm:text-5xl lg:text-6xl">
          هوشمندانه خرید کنید،<br />
          <span class="text-primary-500">حرفه‌ای بسازید.</span>
        </h1>

        <p class="mb-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          از میان تأمین‌کنندگان معتبر، سریع‌ترین مسیر خرید و استعلام را پیدا کنید.
        </p>

        <div class="mb-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <UButton to="/products" size="xl" color="primary" label="شروع خرید" icon="i-lucide-shopping-bag" />
          <UButton to="/dashboard/company/register" size="xl" color="neutral" variant="outline" label="فروشنده شوید" icon="i-lucide-store" />
        </div>

        <p class="max-w-2xl text-sm leading-relaxed text-slate-400">
          جست‌وجوی کالا، ارتباط با فروشندگان ثبت‌شده و ثبت درخواست تأمین از یک مسیر واحد انجام می‌شود.
        </p>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 z-0 h-32 w-full bg-linear-to-t from-slate-50 to-transparent"></div>
  </section>
</template>
