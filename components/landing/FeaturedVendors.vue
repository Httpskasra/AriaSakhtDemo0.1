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
const vendorLocation = (vendor: Company) => vendor.address || "موقعیت ثبت نشده";
const isVerified = (vendor: Company) => vendor.status === "active" || vendor.isActive === true;
</script>

<template>
  <section aria-labelledby="featured-vendors-heading" class="space-y-6">
    <h2 id="featured-vendors-heading" class="text-2xl font-black text-slate-900">تأمین‌کنندگان برتر</h2>

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

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="vendor in vendors" :key="companyId(vendor)" class="premium-card group p-6">
        <div class="mb-6 flex items-start justify-between">
          <div class="flex size-14 items-center justify-center overflow-hidden border border-slate-200 bg-slate-100">
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

        <h3 class="mb-1 text-lg font-black text-slate-900 transition-colors group-hover:text-brand-blue">{{ vendor.name }}</h3>
        <p class="mb-6 flex items-center gap-1 text-xs text-slate-500">
          <UIcon name="i-lucide-map-pin" class="size-icon-compact" />
          {{ vendorLocation(vendor) }}
        </p>

        <div class="mb-6 grid grid-cols-2 gap-4 border-y border-slate-50 py-4">
          <div class="flex flex-col">
            <span class="mb-1 text-xs text-slate-400">وضعیت</span>
            <span class="font-bold text-slate-800">{{ isVerified(vendor) ? "فعال" : "در حال بررسی" }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="mb-1 text-xs text-slate-400">شناسه</span>
            <div class="max-w-24 truncate text-xs font-num text-slate-500">
              {{ vendor.registrationNumber || "ثبت نشده" }}
            </div>
          </div>
        </div>

        <UButton :to="vendorPath(vendor)" block color="neutral" variant="outline" class="font-bold transition-all group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white">
          مشاهده غرفه تأمین‌کننده
        </UButton>
      </div>
    </div>
  </section>
</template>
