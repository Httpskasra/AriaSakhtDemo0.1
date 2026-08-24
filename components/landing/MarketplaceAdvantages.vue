<template>
  <section class="marketplace-advantages">
    <div class="marketplace-advantages__surface">
      <!-- Glow effect -->
      <div class="marketplace-advantages__glow" aria-hidden="true"></div>

      <div class="marketplace-advantages__content">
        <div class="marketplace-advantages__heading">
          <h2>چرا از تجاریس خرید کنیم؟</h2>
          <p>مزایای اختصاصی برای خریداران عمده و سازندگان پروژه‌های ساختمانی</p>
        </div>

        <div class="marketplace-advantages__grid">
          <div v-for="adv in advantages" :key="adv.title" class="marketplace-advantage">
            <div class="marketplace-advantage__icon">
              <UIcon :name="adv.icon" />
            </div>
            <h3>{{ adv.title }}</h3>
            <p>{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const advantages = [
  {
    title: 'بررسی اطلاعات کالا و فروشنده',
    icon: 'i-lucide-shield-check',
    desc: 'اطلاعات کالا و تأمین‌کننده از مسیرهای ثبت‌شده پلتفرم بررسی می‌شود؛ برای جزئیات بیشتر با تیم تجاریس تماس بگیرید.'
  },
  {
    title: 'مسیر پرداخت و پیگیری سفارش',
    icon: 'i-lucide-wallet',
    desc: 'فرایند خرید، پرداخت و پیگیری سفارش از داخل پنل کاربری انجام می‌شود.'
  },
  {
    title: 'هماهنگی تأمین و ارسال',
    icon: 'i-lucide-truck',
    desc: 'برای سفارش‌های حجیم، هماهنگی ارسال بر اساس شرایط کالا، فروشنده و مقصد انجام می‌شود.'
  }
]
</script>

<style scoped>
.marketplace-advantages { padding-block: 2.5rem; }
.marketplace-advantages__surface { position: relative; overflow: hidden; padding: clamp(2.5rem, 6vw, 4rem); border-radius: var(--radius-card); background: var(--color-text-heading); box-shadow: var(--shadow-overlay); }
.marketplace-advantages__glow { position: absolute; width: 24rem; height: 24rem; inset-block-start: -6rem; inset-inline-end: -6rem; border-radius: var(--radius-circle); background: color-mix(in srgb, var(--color-brand-blue) 20%, transparent); filter: blur(7.5rem); }
.marketplace-advantages__content { position: relative; z-index: 1; }
.marketplace-advantages__heading { margin-bottom: 3.5rem; text-align: center; }
.marketplace-advantages__heading h2 { margin: 0 0 1rem; color: var(--color-bg-surface); font-size: clamp(1.75rem, 4vw, 2.4rem); font-weight: 900; }
.marketplace-advantages__heading p, .marketplace-advantage p { color: var(--color-text-disabled); }
.marketplace-advantages__heading p { max-width: 36rem; margin: auto; line-height: var(--line-height-long-form); }
.marketplace-advantages__grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
.marketplace-advantage { display: flex; flex-direction: column; align-items: center; text-align: center; }
.marketplace-advantage__icon { display: grid; width: 3.5rem; height: 3.5rem; place-items: center; margin-bottom: 1.5rem; border: 1px solid color-mix(in srgb, var(--color-bg-surface) 10%, transparent); border-radius: var(--radius-card); color: var(--color-brand-yellow); background: color-mix(in srgb, var(--color-bg-surface) 5%, transparent); font-size: var(--spacing-icon-empty-state); }
.marketplace-advantage h3 { margin: 0 0 .75rem; color: var(--color-bg-surface); font-size: 1.05rem; font-weight: 800; }
.marketplace-advantage p { margin: 0; font-size: .875rem; line-height: var(--line-height-long-form); }
@media (min-width: 768px) { .marketplace-advantages__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3rem; } }
</style>
