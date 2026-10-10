<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { listCompanies } from '~/services/companyService';
import { getProductsByCompany } from '~/services/productService';
import type { Company } from '~/types/company';
import type { Product } from '~/types/product';

type VendorShowcase = { vendor: Company; products: Product[] };
const companyId = (vendor: Company) => vendor._id || vendor.id || '';
const isActive = (vendor: Company) => vendor.status === 'active' || vendor.isActive === true;

const { data: vendorShowcases, pending, error, refresh } = await useAsyncData(
  'landing-featured-vendors',
  async (): Promise<VendorShowcase[]> => {
    const response = await listCompanies({ limit: 8, page: 1 });
    const activeVendors = response.items.filter(vendor => isActive(vendor) && companyId(vendor));
    const loadedVendors = await Promise.all(activeVendors.map(async vendor => {
      try {
        const products = await getProductsByCompany(companyId(vendor), { limit: 4, page: 1, sort: 'createdAt:desc' });
        return { vendor, products };
      } catch {
        return { vendor, products: [] };
      }
    }));
    return loadedVendors.filter(showcase => showcase.products.length > 0).slice(0, 4);
  },
  { default: () => [] as VendorShowcase[] },
);

const selectedVendorId = ref('');
const availableVendors = computed(() => vendorShowcases.value || []);
const selectedShowcase = computed(() => availableVendors.value.find(item => companyId(item.vendor) === selectedVendorId.value) || availableVendors.value[0]);
const selectedProducts = computed(() => selectedShowcase.value?.products || []);

watch(availableVendors, vendors => {
  if (!vendors.some(item => companyId(item.vendor) === selectedVendorId.value)) selectedVendorId.value = vendors[0] ? companyId(vendors[0].vendor) : '';
}, { immediate: true });

const selectVendor = (vendor: Company) => { selectedVendorId.value = companyId(vendor); };
const vendorPath = (vendor: Company) => '/products?companyName=' + encodeURIComponent(vendor.name);
const vendorLocation = (vendor: Company) => typeof vendor.address === 'string' ? vendor.address.trim() : '';
</script>

<template>
  <section aria-labelledby="featured-vendors-heading" class="featured-vendors">
    <LandingSectionHeader id="featured-vendors-heading" title="تأمین‌کنندگان برتر" subtitle="یک تأمین‌کننده را انتخاب کنید و محصولات فعال آن را در همین صفحه ببینید." />

    <SharedAsyncState v-if="pending" state="loading" title="در حال دریافت تأمین‌کنندگان" message="فهرست تأمین‌کنندگان و محصولات فعال آن‌ها در حال بارگذاری است." />
    <SharedAsyncState v-else-if="error" state="error" title="نمایش تأمین‌کنندگان انجام نشد" message="دریافت فهرست تأمین‌کنندگان با مشکل مواجه شد." @retry="refresh" />
    <SharedAsyncState v-else-if="!availableVendors.length" state="empty" title="تأمین‌کننده‌ای با محصول فعال برای نمایش وجود ندارد" message="این بخش پس از ثبت و فعال‌شدن محصولات تأمین‌کنندگان تکمیل می‌شود." />

    <div v-else class="vendor-showcase">
      <nav class="vendor-showcase__list" aria-label="فهرست تأمین‌کنندگان برتر">
        <button
          v-for="showcase in availableVendors"
          :key="companyId(showcase.vendor)"
          type="button"
          class="vendor-selector"
          :class="{ 'vendor-selector--active': companyId(showcase.vendor) === selectedVendorId }"
          :aria-pressed="companyId(showcase.vendor) === selectedVendorId"
          @click="selectVendor(showcase.vendor)"
        >
          <span class="vendor-selector__logo">
            <NuxtImg v-if="showcase.vendor.image" :src="showcase.vendor.image" :alt="showcase.vendor.name" loading="lazy" />
            <UIcon v-else name="i-lucide-building-2" aria-hidden="true" />
          </span>
          <span class="vendor-selector__copy">
            <strong>{{ showcase.vendor.name }}</strong>
            <small class="font-num">{{ showcase.products.length.toLocaleString('fa-IR') }} محصول فعال</small>
          </span>
          <UIcon name="i-lucide-chevron-left" class="vendor-selector__arrow" aria-hidden="true" />
        </button>
      </nav>

      <div v-if="selectedShowcase" class="vendor-showcase__products">
        <div class="vendor-showcase__products-header">
          <div class="vendor-showcase__vendor-heading">
            <p class="vendor-showcase__eyebrow">محصولات تأمین‌کننده</p>
            <h3>{{ selectedShowcase.vendor.name }}</h3>
            <p v-if="vendorLocation(selectedShowcase.vendor)" class="vendor-showcase__location"><UIcon name="i-lucide-map-pin" aria-hidden="true" />{{ vendorLocation(selectedShowcase.vendor) }}</p>
          </div>
          <NuxtLink :to="vendorPath(selectedShowcase.vendor)" class="vendor-showcase__all">مشاهده غرفه <UIcon name="i-lucide-arrow-left" aria-hidden="true" /></NuxtLink>
        </div>
        <div class="vendor-showcase__product-grid">
          <LandingProductCard v-for="product in selectedProducts" :key="product._id || product.id" :product="product" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.vendor-showcase { display:grid; grid-template-columns:minmax(13.5rem,.72fr) minmax(0,2.28fr); gap:1rem; direction:rtl; }
.vendor-showcase__list { display:grid; align-content:start; gap:.55rem; }
.vendor-selector { display:flex; min-width:0; align-items:center; gap:.65rem; padding:.7rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); color:var(--color-text-body); text-align:right; cursor:pointer; box-shadow:var(--shadow-raised); transition:border-color .16s ease, background-color .16s ease, transform .16s ease; }
.vendor-selector:hover { border-color:var(--color-info-border); transform:translateX(-2px); }
.vendor-selector--active { border-color:var(--color-brand-blue); background:var(--color-info-bg); box-shadow:0 0 0 2px color-mix(in srgb, var(--color-brand-blue) 12%, transparent); }
.vendor-selector__logo { display:grid; width:2.75rem; height:2.75rem; flex:0 0 auto; place-items:center; overflow:hidden; border:1px solid var(--color-border); border-radius:var(--radius-compact-list-item); background:var(--color-bg-light); color:var(--color-brand-blue); }
.vendor-selector__logo :deep(img) { width:100%; height:100%; object-fit:cover; }
.vendor-selector__copy { display:grid; min-width:0; flex:1; gap:.2rem; }
.vendor-selector__copy strong { overflow:hidden; color:var(--color-text-heading); font-size:.78rem; font-weight:var(--font-weight-extrabold); text-overflow:ellipsis; white-space:nowrap; }
.vendor-selector__copy small { color:var(--color-text-muted); font-size:.64rem; }
.vendor-selector__arrow { flex:0 0 auto; width:1rem; color:var(--color-text-muted); }
.vendor-selector--active .vendor-selector__arrow, .vendor-selector--active .vendor-selector__copy strong { color:var(--color-brand-blue); }
.vendor-showcase__products { min-width:0; padding:1rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-light); box-shadow:var(--shadow-raised); }
.vendor-showcase__products-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1rem; }
.vendor-showcase__eyebrow { margin:0 0 .25rem; color:var(--color-brand-blue); font-size:.68rem; font-weight:var(--font-weight-extrabold); }
.vendor-showcase__vendor-heading h3 { margin:0; color:var(--color-text-heading); font-size:1.05rem; font-weight:var(--font-weight-extrabold); }
.vendor-showcase__location { display:flex; align-items:center; gap:.3rem; margin:.35rem 0 0; color:var(--color-text-muted); font-size:.68rem; }
.vendor-showcase__location :deep(svg) { width:.85rem; }
.vendor-showcase__all { display:inline-flex; min-height:2.4rem; flex:0 0 auto; align-items:center; gap:.3rem; color:var(--color-brand-blue); font-size:.72rem; font-weight:var(--font-weight-extrabold); }
.vendor-showcase__all:hover { color:var(--color-brand-blue-hover); }
.vendor-showcase__all :deep(svg) { width:.95rem; }
.vendor-showcase__product-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.8rem; }
.vendor-showcase__product-grid :deep(.landing-product-card__body) { padding:.8rem; }
@media (min-width:1200px) { .vendor-showcase__product-grid { grid-template-columns:repeat(4,minmax(0,1fr)); } }
@media (max-width:900px) { .vendor-showcase { grid-template-columns:1fr; } .vendor-showcase__list { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:600px) { .vendor-showcase__list { display:flex; overflow-x:auto; padding:.1rem .1rem .4rem; scroll-snap-type:x proximity; } .vendor-selector { min-width:14rem; scroll-snap-align:start; } .vendor-showcase__products-header { align-items:stretch; flex-direction:column; gap:.5rem; } .vendor-showcase__all { align-self:flex-start; } .vendor-showcase__product-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:420px) { .vendor-showcase__product-grid { grid-template-columns:1fr; } }
@media (prefers-reduced-motion:reduce) { .vendor-selector { transition:none; } .vendor-selector:hover { transform:none; } }
</style>
