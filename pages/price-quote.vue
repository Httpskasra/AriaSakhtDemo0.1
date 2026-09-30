<script setup lang="ts">
useHead({ title: 'استعلام قیمت | تجاریس' });
</script>

<template>
  <div class="public-page" dir="rtl">
    <PublicPageHeader icon="i-lucide-badge-dollar-sign" title="استعلام قیمت" description="برای دریافت قیمت و شرایط تأمین، مشخصات کالای موردنیازتان را ثبت کنید." />
    <main class="section-container request-page__content">
      <div class="request-page__intro panel-surface">
        <div class="request-page__icon" aria-hidden="true"><UIcon name="i-lucide-search-check" /></div>
        <div><p class="section-kicker">خرید مطمئن‌تر</p><h2 class="section-title">قیمت مناسب پروژه‌تان را پیدا کنید</h2><p>درخواست شما در پنل ثبت می‌شود و پاسخ تیم تجاریس را همان‌جا مشاهده می‌کنید؛ دیگر نیازی به پیگیری از طریق پیام‌های پراکنده نیست.</p></div>
      </div>
      <CustomerRequestForm type="price_quote" title="ثبت درخواست استعلام قیمت" description="مقدار، واحد و محل تحویل را دقیق وارد کنید تا پاسخ قابل استفاده‌تری دریافت کنید." />
    </main>
  </div>
</template>

<style scoped>
.request-page__content { display: grid; gap: 1.25rem; padding-block: 2rem 4rem; }
.request-page__intro { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem; }
.request-page__intro p:last-child { margin-top: .5rem; color: var(--color-text-body); line-height: 2; }
.request-page__icon { display: grid; flex: 0 0 3rem; width: 3rem; height: 3rem; place-items: center; border-radius: var(--radius-card); background: var(--color-info-bg); color: var(--color-brand-blue); font-size: 1.4rem; }
</style>
