<template>
  <div class="product-rules">
    <p class="product-rules__intro">شرایط نهایی هر سفارش بر اساس مشخصات محصول، توافق با تأمین‌کننده و اطلاعات درج‌شده در پیش‌فاکتور تعیین می‌شود.</p>
    <ul>
      <li><UIcon name="i-lucide-file-check-2" aria-hidden="true" /><p><strong>ثبت سفارش:</strong> قیمت و موجودی تا زمان تأیید سفارش قطعی نیست و ممکن است نیاز به استعلام مجدد داشته باشد.</p></li>
      <li><UIcon name="i-lucide-truck" aria-hidden="true" /><p><strong>تحویل و حمل:</strong> زمان، روش ارسال و هزینه حمل بر اساس مقصد، مقدار سفارش و توافق ثبت‌شده در سفارش مشخص می‌شود.</p></li>
      <li><UIcon name="i-lucide-clipboard-check" aria-hidden="true" /><p><strong>کنترل کالا:</strong> خریدار باید هنگام تحویل، تعداد و سلامت ظاهری کالا را بررسی و مغایرت را در اسرع وقت گزارش کند.</p></li>
      <li><UIcon name="i-lucide-rotate-ccw" aria-hidden="true" /><p><strong>مرجوعی و مغایرت:</strong> درخواست بررسی مرجوعی یا جایگزینی کالا از طریق پشتیبانی تجاریس و مطابق شرایط سفارش پیگیری می‌شود.</p></li>
      <li><UIcon name="i-lucide-shield-check" aria-hidden="true" /><p><strong>گارانتی و خدمات:</strong> هرگونه ضمانت، استاندارد یا خدمات پس از فروش فقط در صورت درج در مشخصات محصول یا توافق سفارش معتبر است.</p></li>
    </ul>
    <NuxtLink class="product-rules__link" to="/terms">مشاهده قوانین کامل تجاریس</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";

defineProps<{ data: Product }>();
</script>

<style scoped>
.product-rules { width: 100%; }
.product-rules__intro { max-width: 70ch; margin: 0 0 .75rem; color: var(--color-text-body); line-height: 1.9; }
.product-rules ul { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; margin: 0; padding: 0; color: var(--color-text-body); list-style: none; }
.product-rules li { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: flex-start; gap: .55rem; padding: .65rem .75rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); line-height: 1.85; }
.product-rules li > svg { margin-top: .2rem; color: var(--color-brand-blue); }
.product-rules li p { margin: 0; }
.product-rules strong { color: var(--color-text-heading); }
.product-rules__link { display: inline-flex; margin-top: .85rem; color: var(--color-brand-blue); font-weight: var(--font-weight-bold); text-decoration: underline; text-underline-offset: .2em; }
@media (max-width: 700px) { .product-rules ul { grid-template-columns: 1fr; } }
</style>
