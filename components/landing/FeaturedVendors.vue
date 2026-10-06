<script setup lang="ts">
import { listCompanies } from "~/services/companyService";
import type { Company } from "~/types/company";

const { data: vendors, pending, error, refresh } = await useAsyncData(
  "landing-featured-vendors",
  async () => {
    const response = await listCompanies({ limit: 4, page: 1 });
    return response.items;
  },
  { default: () => [] as Company[] },
);

const companyId = (vendor: Company) => vendor._id || vendor.id || vendor.name;
const vendorPath = (vendor: Company) => `/products?companyName=${encodeURIComponent(vendor.name)}`;
const vendorLocation = (vendor: Company) => typeof vendor.address === "string" ? vendor.address.trim() : "";
const isVerified = (vendor: Company) => vendor.status === "active" || vendor.isActive === true;
</script>

<template>
  <section aria-labelledby="featured-vendors-heading" class="featured-vendors">
    <div class="featured-vendors__heading">
      <div>
        <h2 id="featured-vendors-heading">تأمین‌کنندگان برتر</h2>
        <p>با تأمین‌کنندگان ثبت‌شده تجاریس آشنا شوید.</p>
      </div>
    </div>

    <SharedAsyncState
      v-if="pending"
      state="loading"
      title="در حال دریافت تامین‌کنندگان"
      message="فهرست تأمین‌کنندگان ثبت‌شده در حال بارگذاری است." />

    <SharedAsyncState
      v-else-if="error"
      state="error"
      title="نمایش تأمین‌کنندگان انجام نشد"
      message="دریافت فهرست فروشندگان با مشکل مواجه شد."
      @retry="refresh" />

    <SharedAsyncState
      v-else-if="!vendors.length"
      state="empty"
      title="تأمین‌کننده‌ای برای نمایش وجود ندارد"
      message="پس از ثبت شرکت‌های فعال، این بخش به‌صورت خودکار تکمیل می‌شود." />

    <div v-else :class="['featured-vendors__grid', { 'featured-vendors__grid--single': vendors.length === 1 }]">
      <div v-for="vendor in vendors" :key="companyId(vendor)" class="vendor-card group">
        <div class="vendor-card__top">
          <div class="vendor-card__logo">
            <NuxtImg
              v-if="vendor.image"
              :src="vendor.image"
              :alt="vendor.name"
              class="h-full w-full object-cover" />
            <UIcon v-else name="i-lucide-building-2" class="size-icon-empty-state text-slate-400" />
          </div>
          <StatusPill
            v-if="isVerified(vendor)"
            label="تایید شده"
            semantic="success"
            icon="i-lucide-badge-check"
            size="compact" />
        </div>

        <h3>{{ vendor.name }}</h3>
        <p v-if="vendorLocation(vendor)" class="vendor-card__location">
          <UIcon name="i-lucide-map-pin" class="size-icon-compact" />
          {{ vendorLocation(vendor) }}
        </p>

        <UButton :to="vendorPath(vendor)" block color="neutral" variant="outline" class="vendor-card__action">
          مشاهده غرفه تأمین‌کننده
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-vendors { padding-block:clamp(2rem, 4vw, 3.5rem); }
.featured-vendors__heading { display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; margin-bottom:1.5rem; }
.featured-vendors__heading h2 { margin:0 0 .35rem; color:var(--color-text-heading); font-size:clamp(1.35rem, 2.2vw, 1.8rem); font-weight:900; }
.featured-vendors__heading p { margin:0; color:var(--color-text-muted); font-size:.85rem; line-height:1.8; }
.featured-vendors__grid { display:grid; grid-template-columns:1fr; gap:1rem; }
.featured-vendors__grid--single { grid-template-columns:minmax(0, 30rem); }
.vendor-card { display:flex; min-width:0; flex-direction:column; padding:1.15rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); box-shadow:var(--shadow-raised); transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.vendor-card:hover { border-color:var(--color-info-border); box-shadow:var(--shadow-raised); transform:translateY(-2px); }
.vendor-card__top { display:flex; align-items:flex-start; justify-content:space-between; gap:.75rem; margin-bottom:1rem; }
.vendor-card__logo { display:grid; width:3.5rem; height:3.5rem; place-items:center; overflow:hidden; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-light); }
.vendor-card__logo :deep(img) { width:100%; height:100%; object-fit:cover; }
.vendor-card h3 { margin:0; color:var(--color-text-heading); font-size:1.05rem; font-weight:900; transition:color .16s ease; }
.vendor-card:hover h3 { color:var(--color-brand-blue); }
.vendor-card__location { display:flex; min-height:1.5rem; align-items:center; gap:.35rem; margin:.45rem 0 1.15rem; color:var(--color-text-muted); font-size:.75rem; line-height:1.7; }
.vendor-card__action { margin-top:auto; min-height:2.6rem; font-weight:800; }

@media (min-width: 768px) {
  .featured-vendors__grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
}

@media (min-width: 1200px) {
  .featured-vendors__grid { grid-template-columns:repeat(4,minmax(0,1fr)); }
}

@media (max-width: 767px) {
  .featured-vendors__grid--single { grid-template-columns:1fr; }
}
</style>
