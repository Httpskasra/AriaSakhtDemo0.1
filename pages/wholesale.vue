<script setup lang="ts">
useHead({ title: 'خرید عمده | تجاریس' });
</script>

<template>
  <div class="public-page" dir="rtl">
    <PublicPageHeader icon="i-lucide-truck" title="خرید عمده" description="برای خرید پروژه‌ای و عمده، درخواست اختصاصی خود را ثبت کنید تا شرایط تأمین بررسی شود." />
    <main class="section-container request-page__content">
      <div class="wholesale-benefits">
        <article class="panel-surface wholesale-benefit"><UIcon name="i-lucide-boxes" /><div><strong>تأمین متناسب با حجم پروژه</strong><p>مقدار و زمان‌بندی موردنیاز را ثبت کنید.</p></div></article>
        <article class="panel-surface wholesale-benefit"><UIcon name="i-lucide-badge-check" /><div><strong>پاسخ قابل پیگیری</strong><p>نتیجه درخواست در پنل کاربری شما نمایش داده می‌شود.</p></div></article>
        <article class="panel-surface wholesale-benefit"><UIcon name="i-lucide-handshake" /><div><strong>هماهنگی با تأمین‌کنندگان</strong><p>تیم تجاریس بهترین گزینه‌های موجود را بررسی می‌کند.</p></div></article>
      </div>
      <CustomerRequestForm type="wholesale" title="ثبت درخواست خرید عمده" description="نام کالا، مقدار، واحد و محل تحویل را وارد کنید تا بررسی تأمین آغاز شود." />
    </main>
  </div>
</template>

<style scoped>
.request-page__content { display: grid; gap: 1.25rem; padding-block: 2rem 4rem; }
.wholesale-benefits { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.wholesale-benefit { display: flex; align-items: flex-start; gap: .75rem; padding: 1.1rem; }
.wholesale-benefit > :deep(svg) { flex: 0 0 1.4rem; color: var(--color-brand-blue); font-size: 1.35rem; }
.wholesale-benefit strong { color: var(--color-text-heading); font-size: .9rem; }
.wholesale-benefit p { margin-top: .35rem; color: var(--color-text-muted); font-size: .75rem; line-height: 1.8; }
@media (max-width: 760px) { .wholesale-benefits { grid-template-columns: 1fr; } }
</style>
