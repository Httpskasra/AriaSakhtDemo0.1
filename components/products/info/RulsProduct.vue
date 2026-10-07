<template>
  <div class="product-rules">
    <p class="product-rules__intro">شرایط نهایی هر سفارش بر اساس مشخصات محصول، توافق با تأمین‌کننده و اطلاعات درج‌شده در پیش‌فاکتور تعیین می‌شود.</p>
    <ul>
      <li><strong>ثبت سفارش:</strong> قیمت و موجودی تا زمان تأیید سفارش قطعی نیست و ممکن است نیاز به استعلام مجدد داشته باشد.</li>
      <li><strong>تحویل و حمل:</strong> زمان، روش ارسال و هزینه حمل بر اساس مقصد، مقدار سفارش و توافق ثبت‌شده در سفارش مشخص می‌شود.</li>
      <li><strong>کنترل کالا:</strong> خریدار باید هنگام تحویل، تعداد و سلامت ظاهری کالا را بررسی و مغایرت را در اسرع وقت گزارش کند.</li>
      <li><strong>مرجوعی و مغایرت:</strong> درخواست بررسی مرجوعی یا جایگزینی کالا از طریق پشتیبانی تجاریس و مطابق شرایط سفارش پیگیری می‌شود.</li>
      <li><strong>گارانتی و خدمات:</strong> هرگونه ضمانت، استاندارد یا خدمات پس از فروش فقط در صورت درج در مشخصات محصول یا توافق سفارش معتبر است.</li>
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
.product-rules__intro { margin: 0 0 1rem; color: var(--color-text-body); line-height: 1.9; }
.product-rules ul { display: grid; gap: .75rem; margin: 0; padding-inline-start: 1.25rem; color: var(--color-text-body); line-height: 1.95; }
.product-rules li::marker { color: var(--color-brand-blue); }
.product-rules strong { color: var(--color-text-heading); }
.product-rules__link { display: inline-flex; margin-top: 1.25rem; color: var(--color-brand-blue); font-weight: 700; text-decoration: underline; text-underline-offset: .2em; }
</style>
