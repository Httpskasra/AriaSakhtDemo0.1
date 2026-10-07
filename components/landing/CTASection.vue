<template>
  <section class="landing-cta">
    <div class="section-container">
      <div class="landing-cta__surface">
        <UIcon name="i-lucide-building-2" class="landing-cta__icon" aria-hidden="true" />

        <div class="landing-cta__content">
          <p class="landing-cta__eyebrow">برای شروع آماده‌اید؟</p>
          <h2>به بازار تخصصی ساختمان تجاریس بپیوندید</h2>
          <p class="landing-cta__description">تولیدکننده، پیمانکار یا خریدار عمده هستید؟ مسیر مناسب کسب‌وکار خود را از همین‌جا شروع کنید.</p>
          <div class="landing-cta__actions">
            <UButton to="/dashboard/company/register" size="lg" color="neutral" variant="solid" icon="i-lucide-handshake">تأمین‌کننده شوید</UButton>
            <UButton to="/price-quote" size="lg" color="neutral" variant="outline">استعلام قیمت</UButton>
          </div>
        </div>

        <div class="landing-cta__signals" aria-label="خدمات تجاریس">
          <div class="landing-cta__signal"><UIcon name="i-lucide-store" aria-hidden="true" /><span>ثبت درخواست تأمین</span></div>
          <div class="landing-cta__signal"><UIcon name="i-lucide-headphones" aria-hidden="true" /><span>پشتیبانی تخصصی</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.landing-cta { padding-block:calc(var(--landing-section-space) / 2); }
.landing-cta__surface { position:relative; display:grid; grid-template-columns:minmax(0, 1.7fr) minmax(13rem, .8fr); align-items:center; gap:1.5rem; overflow:hidden; padding:clamp(1.75rem, 3vw, 2.5rem); border-radius:var(--radius-card); background:var(--color-brand-blue); color:var(--color-bg-surface); }
.landing-cta__icon { position:absolute; inset-block-end:-3rem; inset-inline-end:-2rem; width:15rem; height:15rem; color:color-mix(in srgb, var(--color-bg-surface) 10%, transparent); transform:rotate(-12deg); }
.landing-cta__content { position:relative; z-index:1; max-width:42rem; }
.landing-cta__eyebrow { margin:0 0 .5rem; color:var(--color-brand-yellow); font-size:.75rem; font-weight:800; }
.landing-cta h2 { margin:0; color:var(--color-bg-surface); font-size:clamp(1.5rem, 2.6vw, 2.15rem); font-weight:900; line-height:1.45; }
.landing-cta__description { max-width:34rem; margin:.75rem 0 1.35rem; color:color-mix(in srgb, var(--color-bg-surface) 88%, transparent); font-size:.88rem; line-height:1.9; }
.landing-cta__actions { display:flex; flex-wrap:wrap; gap:.65rem; }
.landing-cta__actions :deep(button), .landing-cta__actions :deep(a) { min-height:2.75rem; }
.landing-cta__signals { position:relative; z-index:1; display:grid; min-width:13rem; gap:.65rem; }
.landing-cta__signal { display:flex; min-height:3rem; align-items:center; gap:.6rem; padding:.7rem .85rem; border:1px solid color-mix(in srgb, var(--color-bg-surface) 18%, transparent); border-radius:var(--radius-card); background:color-mix(in srgb, var(--color-bg-surface) 9%, transparent); color:var(--color-bg-surface); font-size:.75rem; font-weight:700; }
.landing-cta__signal :deep(svg) { width:1.15rem; color:var(--color-brand-yellow); }

@media (max-width: 767px) {
  .landing-cta__surface { display:flex; align-items:stretch; flex-direction:column; gap:1.5rem; padding:1.6rem; }
  .landing-cta__signals { grid-template-columns:repeat(2,minmax(0,1fr)); min-width:0; }
  .landing-cta__signal { min-width:0; font-size:.68rem; }
  .landing-cta__actions { display:grid; grid-template-columns:1fr; }
  .landing-cta__actions :deep(button), .landing-cta__actions :deep(a) { width:100%; }
}

@media (max-width: 359px) {
  .landing-cta__signals { grid-template-columns:1fr; }
}
</style>
