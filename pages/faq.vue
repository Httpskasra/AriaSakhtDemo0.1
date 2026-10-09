<script setup lang="ts">
import { ref } from 'vue';
const openIndex = ref(0);
const questions = [
  { question: 'چطور محصول مناسب را پیدا کنم؟', answer: 'از فروشگاه استفاده کنید، دسته‌بندی و فیلترها را انتخاب کنید و برای بررسی جزئیات وارد صفحه محصول شوید.' },
  { question: 'برای خرید عمده چه کاری باید انجام بدهم؟', answer: 'در صفحه خرید عمده مقدار، واحد و محل تحویل را ثبت کنید. پاسخ و شرایط تأمین از پنل کاربری قابل پیگیری است.' },
  { question: 'نتیجه استعلام قیمت را کجا می‌بینم؟', answer: 'پس از ورود به حساب، از بخش «استعلام قیمت و عمده» در پنل، وضعیت و پاسخ ادمین را مشاهده می‌کنید.' },
  { question: 'چطور درخواست پشتیبانی ثبت کنم؟', answer: 'از صفحه پشتیبانی وارد پنل شوید و تیکت جدید ایجاد کنید؛ گفت‌وگو و پاسخ‌ها در همان تیکت باقی می‌ماند.' },
  { question: 'اگر محتوای نادرست دیدم چه کنم؟', answer: 'از صفحه گزارش تخلف، موضوع، شرح و لینک موردنظر را ارسال کنید تا تیم بررسی آن را پیگیری کند.' },
];
useHead({ title: 'سوالات متداول | تجاریس' });
</script>
<template>
  <div class="public-page" dir="rtl"><PublicPageHeader icon="i-lucide-circle-help" title="سوالات متداول" description="پاسخ کوتاه به پرسش‌های رایج خریداران و تأمین‌کنندگان تجاریس." /><main class="section-container faq-page__content"><section class="faq-list panel-surface" aria-label="پرسش‌های متداول"><details v-for="(item, index) in questions" :key="item.question" :open="openIndex === index"><summary @click.prevent="openIndex = openIndex === index ? -1 : index"><span>{{ item.question }}</span><UIcon name="i-lucide-chevron-down" aria-hidden="true" /></summary><p>{{ item.answer }}</p></details></section><div class="faq-page__actions"><UButton to="/support" icon="i-lucide-life-buoy">رفتن به پشتیبانی</UButton><UButton to="/terms" variant="outline" color="neutral">قوانین و مقررات</UButton></div></main></div>
</template>
<style scoped>
.faq-page__content { display: grid; gap: 1.25rem; padding-block: 2rem 4rem; }.faq-list { padding: .5rem 1.25rem; }.faq-list details { border-bottom: 1px solid var(--color-border); }.faq-list details:last-child { border-bottom: 0; }.faq-list summary { display: flex; min-height: 3.5rem; align-items: center; justify-content: space-between; gap: 1rem; color: var(--color-text-heading); cursor: pointer; font-weight: var(--font-weight-extrabold); list-style: none; }.faq-list summary::-webkit-details-marker { display: none; }.faq-list details[open] summary { color: var(--color-brand-blue); }.faq-list details[open] summary :deep(svg) { transform: rotate(180deg); }.faq-list summary :deep(svg) { transition: transform .18s ease; }.faq-list p { padding: 0 0 1rem; color: var(--color-text-body); line-height: 2; }.faq-page__actions { display: flex; flex-wrap: wrap; gap: .75rem; }
</style>
