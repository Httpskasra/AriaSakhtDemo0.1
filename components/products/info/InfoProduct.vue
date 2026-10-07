<template>
  <div class="product-specifications">
    <header class="product-specifications__header">
      <div>
        <span class="product-specifications__eyebrow">اطلاعات فنی ثبت‌شده</span>
        <h3>مشخصات فنی محصول</h3>
      </div>
      <span v-if="attributes.length" class="product-specifications__count font-num">
        {{ attributes.length.toLocaleString("fa-IR") }} مشخصه
      </span>
    </header>

    <div v-if="attributes.length" class="product-specifications__table" role="table" aria-label="مشخصات فنی محصول">
      <div class="product-specifications__row product-specifications__row--head" role="row">
        <span role="columnheader">ویژگی</span>
        <span role="columnheader">مقدار</span>
      </div>
      <dl class="product-specifications__grid">
        <div v-for="([key, value]) in attributes" :key="key" class="product-specifications__row" role="row">
          <dt role="rowheader">{{ key }}</dt>
          <dd role="cell">{{ formatValue(value) }}</dd>
        </div>
      </dl>
    </div>

    <div v-else class="product-specifications__empty">
      <UIcon name="i-lucide-clipboard-list" aria-hidden="true" />
      <div>
        <strong>مشخصات فنی ثبت نشده است</strong>
        <p>اطلاعات فنی این محصول هنوز از طرف تأمین‌کننده تکمیل نشده است.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/types/product";

const props = defineProps<{ data: Product }>();
const attributes = computed(() => Object.entries(props.data.attributes || {})
  .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== ""));

function formatValue(value: string | number) {
  return typeof value === "number" ? value.toLocaleString("fa-IR") : value;
}
</script>

<style scoped>
.product-specifications { width: 100%; }
.product-specifications__header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.product-specifications__eyebrow { display: block; margin-bottom: .25rem; color: var(--color-text-muted); font-size: .7rem; font-weight: 700; }
.product-specifications h3 { margin: 0; color: var(--color-text-heading); font-size: 1rem; font-weight: 900; }
.product-specifications__count { padding: .3rem .6rem; border-radius: var(--radius-pill); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: .72rem; font-weight: 800; white-space: nowrap; }
.product-specifications__table { overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-field); }
.product-specifications__row { display: grid; grid-template-columns: minmax(9rem, .75fr) minmax(0, 1.25fr); gap: 1rem; margin: 0; padding: .8rem 1rem; border-top: 1px solid var(--color-border); }
.product-specifications__row--head { border-top: 0; color: var(--color-text-muted); background: var(--color-bg-light); font-size: .72rem; font-weight: 800; }
.product-specifications__row dt { color: var(--color-text-muted); font-size: .78rem; }
.product-specifications__row dd { min-width: 0; margin: 0; color: var(--color-text-heading); font-size: .84rem; font-weight: 700; overflow-wrap: anywhere; }
.product-specifications__empty { display: flex; align-items: flex-start; gap: .75rem; padding: 1rem 0; color: var(--color-text-muted); }
.product-specifications__empty svg { flex: 0 0 auto; margin-top: .1rem; color: var(--color-brand-blue); }
.product-specifications__empty strong { display: block; color: var(--color-text-heading); font-size: .88rem; }
.product-specifications__empty p { margin: .3rem 0 0; line-height: 1.8; }
@media (max-width: 640px) {
  .product-specifications__header { align-items: flex-start; flex-direction: column; }
  .product-specifications__row { grid-template-columns: minmax(7rem, .8fr) minmax(0, 1.2fr); gap: .75rem; padding: .75rem; }
}
</style>
