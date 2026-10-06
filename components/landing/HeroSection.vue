<template>
  <section aria-labelledby="landing-hero-title" class="landing-hero">
    <div class="landing-hero__background" aria-hidden="true">
      <img src="/products/bg.png" alt="" />
      <div class="landing-hero__overlay"></div>
    </div>

    <div class="section-container landing-hero__container">
      <div class="landing-hero__content">
        <p class="landing-hero__eyebrow">
          <span class="landing-hero__eyebrow-dot" aria-hidden="true"></span>
          بازار تخصصی صنعت و ساختمان
        </p>

        <h1 id="landing-hero-title" class="landing-hero__title">
          هوشمندانه خرید کنید،<br />
          <span>حرفه‌ای بسازید.</span>
        </h1>

        <p class="landing-hero__description">
          کالاهای صنعتی و ساختمانی را جستجو کنید، تأمین‌کننده مناسب را پیدا کنید و خریدتان را با اطمینان پیش ببرید.
        </p>

        <div class="landing-hero__search" aria-label="جستجوی کالا">
          <GlobalProductSearch variant="default" />
        </div>

        <div class="landing-hero__actions">
          <UButton to="/products" size="lg" color="primary" icon="i-lucide-search" class="landing-hero__primary-action">
            مشاهده محصولات
          </UButton>
          <UButton to="/dashboard/company/register" size="lg" color="neutral" variant="outline" icon="i-lucide-handshake" class="landing-hero__secondary-action">
            تأمین‌کننده شوید
          </UButton>
        </div>

        <ul class="landing-hero__benefits" aria-label="مزیت‌های خرید در تجاریس">
          <li><UIcon name="i-lucide-search-check" aria-hidden="true" /><span>جستجوی سریع کالا</span></li>
          <li><UIcon name="i-lucide-file-search" aria-hidden="true" /><span>استعلام و مقایسه</span></li>
          <li><UIcon name="i-lucide-package-check" aria-hidden="true" /><span>خرید و پیگیری</span></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.landing-hero {
  position: relative;
  overflow: hidden;
  min-height: 29rem;
  background: var(--color-text-heading);
  isolation: isolate;
}

.landing-hero__background,
.landing-hero__background img,
.landing-hero__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.landing-hero__background { z-index: -1; }
.landing-hero__background img { object-fit: cover; filter: grayscale(100%); opacity: .32; }
.landing-hero__overlay { background: linear-gradient(90deg, color-mix(in srgb, var(--color-text-heading) 96%, transparent) 0%, color-mix(in srgb, var(--color-text-heading) 88%, transparent) 48%, color-mix(in srgb, var(--color-text-heading) 68%, transparent) 100%); }

.landing-hero__container {
  display: flex;
  align-items: center;
  min-height: 29rem;
  padding-block: clamp(2.75rem, 5.5vw, 4.5rem);
}

.landing-hero__content { width: min(100%, 54rem); margin-inline-start: clamp(0rem, 6vw, 5.5rem); }
.landing-hero__eyebrow { display: inline-flex; min-height: 2rem; align-items: center; gap: .55rem; margin: 0 0 1.25rem; padding: .35rem .8rem; border: 1px solid color-mix(in srgb, var(--color-bg-surface) 18%, transparent); border-radius: var(--radius-pill); background: color-mix(in srgb, var(--color-bg-surface) 8%, transparent); color: var(--color-bg-surface); font-size: .78rem; font-weight: 700; }
.landing-hero__eyebrow-dot { width: .5rem; height: .5rem; border-radius: var(--radius-circle); background: var(--color-brand-yellow); }
.landing-hero__title { margin: 0; color: var(--color-bg-surface); font-size: clamp(2rem, 4.35vw, 3.7rem); font-weight: 800; line-height: 1.23; letter-spacing: -.035em; }
.landing-hero__title span { color: var(--color-brand-yellow); }
.landing-hero__description { max-width: 36rem; margin: 1rem 0 1.25rem; color: var(--color-border-strong); font-size: clamp(.92rem, 1.25vw, 1.05rem); line-height: 1.95; }
.landing-hero__search { width: min(100%, 40rem); margin-bottom: .85rem; }
.landing-hero__search :deep(.search-input input) { border-color: color-mix(in srgb, var(--color-bg-surface) 24%, transparent); box-shadow: var(--shadow-overlay); }
.landing-hero__search :deep(.search-input input:hover), .landing-hero__search :deep(.search-input input:focus-visible) { border-color: var(--color-brand-blue); }
.landing-hero__actions { display: flex; flex-wrap: wrap; gap: .75rem; }
.landing-hero__actions :deep(button), .landing-hero__actions :deep(a) { min-height: 3rem; }
.landing-hero__primary-action { min-width: 10rem; }
.landing-hero__secondary-action { border-color: color-mix(in srgb, var(--color-bg-surface) 42%, transparent); color: var(--color-bg-surface); }
.landing-hero__secondary-action:hover { border-color: var(--color-bg-surface); background: color-mix(in srgb, var(--color-bg-surface) 12%, transparent); color: var(--color-bg-surface); }
.landing-hero__benefits { display: flex; flex-wrap: wrap; gap: .8rem 1.35rem; margin: 1.35rem 0 0; padding: 0; color: var(--color-border-strong); font-size: .82rem; list-style: none; }
.landing-hero__benefits li { display: inline-flex; align-items: center; gap: .4rem; }
.landing-hero__benefits :deep(svg) { width: 1rem; color: var(--color-brand-yellow); }

@media (max-width: 767px) {
  .landing-hero { min-height: auto; }
  .landing-hero__container { min-height: auto; padding-block: 2.5rem 2.75rem; }
  .landing-hero__content { margin-inline-start: 0; }
  .landing-hero__eyebrow { margin-bottom: 1rem; font-size: .7rem; }
  .landing-hero__title { font-size: clamp(2rem, 10vw, 3rem); letter-spacing: -.025em; }
  .landing-hero__description { margin-block: 1rem 1.25rem; font-size: .88rem; line-height: 1.9; }
  .landing-hero__search { margin-bottom: .8rem; }
  .landing-hero__actions { display: grid; grid-template-columns: 1fr; gap: .6rem; }
  .landing-hero__primary-action { width: 100%; }
  .landing-hero__secondary-action { width: 100%; }
  .landing-hero__benefits { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .5rem; margin-top: 1.35rem; font-size: .68rem; text-align: center; }
  .landing-hero__benefits li { flex-direction: column; gap: .3rem; }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .landing-hero { min-height: 26rem; }
  .landing-hero__container { min-height: 26rem; padding-block: 2.5rem; }
  .landing-hero__content { margin-inline-start: 2rem; }
  .landing-hero__title { font-size: clamp(2rem, 5vw, 3.1rem); }
}

@media (prefers-reduced-motion: reduce) {
  .landing-hero * { transition: none; animation: none; }
}
</style>
