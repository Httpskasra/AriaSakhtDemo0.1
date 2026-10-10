<template>
  <section class="landing-promos" aria-label="مسیرهای خرید و تأمین">
    <div class="section-container landing-promos__grid">
      <NuxtLink
        to="/products"
        class="promo-card promo-card--products group"
      >
        <div class="promo-card__visual" aria-hidden="true">
          <NuxtImg
            src="/banner/v-banner.webp"
            alt=""
            class="promo-card__image"
            loading="lazy"
          />
        </div>
        <div class="promo-card__scrim" aria-hidden="true"></div>
        <div class="promo-card__content">
          <span class="promo-card__eyebrow">کاتالوگ تجاریس</span>
          <h2>مشاهده کالاهای صنعتی و ساختمانی</h2>
          <p>کالاهای ثبت‌شده در بازار تجاریس را سریع‌تر پیدا و بررسی کنید.</p>
          <span class="promo-card__action">مشاهده کالاها <UIcon name="i-lucide-arrow-left" aria-hidden="true" /></span>
        </div>
      </NuxtLink>

      <NuxtLink to="/wholesale" class="promo-card promo-card--rfq group">
        <UIcon name="i-lucide-handshake" class="promo-card__accent-icon" aria-hidden="true" />
        <div class="promo-card__content">
          <span class="promo-card__eyebrow">تأمین پروژه</span>
          <h2>درخواست تأمین از تجاریس</h2>
          <p>اگر کالای موردنیازتان را پیدا نکردید، درخواست تأمین خود را برای تیم تجاریس ارسال کنید.</p>
          <span class="promo-card__action">ثبت درخواست تأمین <UIcon name="i-lucide-arrow-left" aria-hidden="true" /></span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.landing-promos { padding-block:calc(var(--landing-section-space) / 2); }
.landing-promos__grid { display:grid; grid-template-columns:1fr; gap:var(--landing-grid-gap); align-items:stretch; }
.promo-card { position:relative; display:flex; min-height:11rem; height:100%; align-items:center; overflow:hidden; border:1px solid var(--color-border); border-radius:var(--radius-card); box-shadow:var(--shadow-raised); color:var(--color-bg-surface); isolation:isolate; transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.promo-card:hover { border-color:var(--color-info-border); box-shadow:var(--shadow-raised); transform:translateY(-2px); }
.promo-card:focus-visible { outline:3px solid color-mix(in srgb, var(--color-brand-blue) 30%, transparent); outline-offset:3px; }
.promo-card--products { background:var(--color-text-heading); }
.promo-card--rfq { padding:clamp(1rem, 2vw, 1.35rem); background:var(--color-brand-blue); }
.promo-card__visual { position:absolute; inset-block:0; inset-inline-start:0; z-index:-2; width:46%; overflow:hidden; }
.promo-card__image { display:block; width:100%; height:100%; object-fit:cover; object-position:left center; }
.promo-card__scrim { position:absolute; inset:0; z-index:-1; background:linear-gradient(90deg, color-mix(in srgb, var(--color-text-heading) 40%, transparent), var(--color-text-heading) 58%); }
.promo-card__content { position:relative; z-index:1; width:min(100%, 31rem); padding:clamp(1rem, 2.2vw, 1.5rem); direction:rtl; }
.promo-card--rfq .promo-card__content { padding:0; }
.promo-card__eyebrow { display:inline-flex; min-height:1.7rem; align-items:center; margin-bottom:.75rem; padding:.2rem .55rem; border-radius:var(--radius-pill); background:color-mix(in srgb, var(--color-brand-yellow) 90%, white); color:var(--color-text-heading); font-size:.68rem; font-weight: var(--font-weight-extrabold); }
.promo-card h2 { margin:0; color:var(--color-bg-surface); font-size:clamp(1.25rem, 2.5vw, 1.85rem); font-weight: var(--font-weight-extrabold); line-height:var(--line-height-section); }
.promo-card p { max-width:29rem; margin:.6rem 0 1.15rem; color:color-mix(in srgb, var(--color-bg-surface) 84%, transparent); font-size:.8rem; line-height:1.9; }
.promo-card__action { display:inline-flex; min-height:2.5rem; align-items:center; gap:.4rem; padding:.45rem .8rem; border-radius:var(--radius-compact-list-item); background:var(--color-bg-surface); color:var(--color-text-heading); font-size:.76rem; font-weight: var(--font-weight-extrabold); }
.promo-card__action :deep(svg) { width:1rem; color:var(--color-brand-blue); }
.promo-card--rfq .promo-card__action { color:var(--color-brand-blue); }
.promo-card__accent-icon { position:absolute; inset-block-start:-1.25rem; inset-inline-start:-1.25rem; z-index:0; width:7.5rem; height:7.5rem; color:color-mix(in srgb, var(--color-bg-surface) 13%, transparent); transform:rotate(-12deg); }

@media (min-width: 768px) {
  .landing-promos__grid { grid-template-columns:minmax(0, 1fr) minmax(0, 2fr); }
  .promo-card--products { grid-column:2; grid-row:1; }
  .promo-card--rfq { grid-column:1; grid-row:1; }
}

@media (max-width: 767px) {
  .promo-card--products, .promo-card--rfq { grid-column:auto; }
  .promo-card__visual { width:100%; height:8.5rem; inset-block-start:auto; opacity:.32; }
  .promo-card__scrim { background:linear-gradient(180deg, var(--color-text-heading) 10%, color-mix(in srgb, var(--color-text-heading) 86%, transparent) 100%); }
  .promo-card__content { align-self:flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .promo-card { transition:none; }
}
</style>
