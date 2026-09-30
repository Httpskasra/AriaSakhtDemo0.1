<script setup lang="ts">
useHead({ title: 'قوانین و مقررات | تجاریس' });
const sections = [
  ['استفاده از خدمات', 'کاربر متعهد است اطلاعات ثبت‌نام، درخواست‌ها و اطلاعات تماس را صحیح و به‌روز وارد کند و از سامانه برای فعالیت قانونی استفاده نماید.'],
  ['خرید و استعلام قیمت', 'قیمت‌ها و شرایط اعلام‌شده ممکن است با توجه به موجودی، زمان و شرایط تأمین تغییر کنند. ثبت درخواست به‌تنهایی به معنی قطعی شدن معامله نیست مگر آنکه در سفارش نهایی تأیید شود.'],
  ['مسئولیت محتوای فروشندگان', 'فروشنده مسئول صحت اطلاعات محصول، قیمت، موجودی و مدارکی است که در سامانه درج می‌کند. کاربران می‌توانند موارد مغایر را از مسیر گزارش تخلف اطلاع دهند.'],
  ['حریم خصوصی و ارتباطات', 'اطلاعات فقط برای ارائه خدمات، پیگیری درخواست‌ها و بهبود تجربه سامانه استفاده می‌شود و دسترسی به آن بر اساس نقش‌های سامانه محدود است.'],
  ['پشتیبانی و حل اختلاف', 'در صورت بروز مشکل، ابتدا از تیکت پشتیبانی استفاده کنید تا موضوع با شناسه مشخص پیگیری و مستند شود.'],
];
</script>
<template><div class="public-page" dir="rtl"><PublicPageHeader icon="i-lucide-scroll-text" title="قوانین و مقررات" description="چارچوب استفاده از بازار آنلاین تجاریس برای خریداران و تأمین‌کنندگان." /><main class="section-container terms-page__content"><article class="panel-surface terms-content"><section v-for="section in sections" :key="section[0]"><h2>{{ section[0] }}</h2><p>{{ section[1] }}</p></section><p class="terms-content__updated">آخرین به‌روزرسانی: شهریور ۱۴۰۳</p></article><div class="terms-page__actions"><UButton to="/faq" variant="outline" color="neutral">سوالات متداول</UButton><UButton to="/support">پشتیبانی</UButton></div></main></div></template>
<style scoped>.terms-page__content { display: grid; gap: 1.25rem; padding-block: 2rem 4rem; }.terms-content { padding: clamp(1.25rem, 3vw, 2rem); }.terms-content section + section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }.terms-content h2 { color: var(--color-text-heading); font-size: 1rem; font-weight: 900; }.terms-content p { margin-top: .5rem; color: var(--color-text-body); line-height: 2.1; }.terms-content__updated { color: var(--color-text-muted) !important; font-size: .75rem; }.terms-page__actions { display: flex; gap: .75rem; }</style>
