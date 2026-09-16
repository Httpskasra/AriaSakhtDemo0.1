<template>
  <section class="vendor-requests-page" dir="rtl">
    <PanelPageHeader
      title="درخواست‌های فروشندگی"
      subtitle="درخواست‌های ثبت شرکت را بررسی و به حساب متقاضی متصل کنید"
      icon="i-lucide-clipboard-check"
    >
      <template #actions>
        <UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" @click="fetchRequests">به‌روزرسانی</UButton>
      </template>
    </PanelPageHeader>

    <PanelPermissionGuard :allowed="canUpdate" :ready="isReady">
      <PanelFilterBar>
        <div class="vendor-request-filter-label">نمایش درخواست‌ها</div>
        <AppSelect v-model="statusFilter" :items="statusOptions" value-key="value" label-key="label" aria-label="فیلتر وضعیت درخواست" class="vendor-request-filter" />
      </PanelFilterBar>

      <div class="premium-card panel-table-card">
        <SharedAsyncState v-if="loading" state="loading" :skeleton-rows="5" />
        <SharedAsyncState v-else-if="loadError" state="error" :message="loadError" @retry="fetchRequests" />
        <SharedAsyncState
          v-else-if="!requests.length"
          state="empty"
          title="درخواستی پیدا نشد"
          message="درخواست‌های جدید فروشندگی در این بخش نمایش داده می‌شوند."
        />
        <div v-else class="vendor-requests-table-wrap">
          <table class="vendor-requests-table">
            <caption class="sr-only">فهرست درخواست‌های فروشندگی</caption>
            <thead>
              <tr>
                <th scope="col">کسب‌وکار</th>
                <th scope="col">متقاضی</th>
                <th scope="col">نوع</th>
                <th scope="col">اطلاعات ثبتی</th>
                <th scope="col">وضعیت</th>
                <th scope="col">تاریخ</th>
                <th scope="col">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requests" :key="request._id">
                <td>
                  <div class="vendor-request-name">
                    <img v-if="request.imageUrl" :src="request.imageUrl" :alt="`لوگوی ${request.companyName}`" />
                    <span v-else aria-hidden="true"><UIcon name="i-lucide-building-2" /></span>
                    <div class="vendor-request-name__copy">
                      <strong>{{ request.companyName }}</strong>
                      <small>{{ sellerTypeLabel(request.sellerType) }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="vendor-request-contact font-num">{{ request.email }}</div>
                  <small class="font-num">{{ request.phone || "بدون تلفن" }}</small>
                </td>
                <td><span class="vendor-request-type">{{ request.sellerType === "individual" ? "حقیقی" : "حقوقی" }}</span></td>
                <td class="font-num">{{ request.registrationNumber || request.nationalId || "—" }}</td>
                <td><StatusPill :label="statusLabel(request.status)" :semantic="statusSemantic(request.status)" /></td>
                <td class="ltr">{{ formatDate(request.createdAt) }}</td>
                <td>
                  <div class="panel-row-actions">
                    <UButton size="xs" color="primary" variant="soft" icon="i-lucide-eye" :aria-label="`مشاهده جزئیات درخواست ${request.companyName}`" @click="openDetails(request)">مشاهده جزئیات</UButton>
                    <template v-if="request.status === 'pending'">
                      <UButton v-if="request.userId" size="xs" color="success" icon="i-lucide-check" :disabled="Boolean(processingId)" @click="openReview(request, 'approved')">تأیید</UButton>
                      <UButton size="xs" color="error" variant="soft" icon="i-lucide-x" :disabled="Boolean(processingId)" @click="openReview(request, 'rejected')">رد</UButton>
                    </template>
                  </div>
                  <small v-if="request.status === 'pending' && !request.userId" class="vendor-request-unlinked">بدون حساب کاربری؛ فقط قابل رد است</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PanelPermissionGuard>

    <BaseModal v-if="selectedRequest" title-id="vendor-request-details-title" @close="closeDetails">
      <div class="vendor-request-details">
        <div class="vendor-request-details__hero">
          <div class="vendor-request-details__identity">
            <div class="vendor-request-details__logo">
              <img v-if="selectedRequest.imageUrl" :src="selectedRequest.imageUrl" :alt="`لوگوی ${selectedRequest.companyName}`" />
              <UIcon v-else name="i-lucide-building-2" aria-hidden="true" />
            </div>
            <div>
              <p class="vendor-request-details__eyebrow">جزئیات درخواست فروشندگی</p>
              <h2 id="vendor-request-details-title">{{ selectedRequest.companyName }}</h2>
              <p>{{ sellerTypeLabel(selectedRequest.sellerType) }}</p>
            </div>
          </div>
          <StatusPill :label="statusLabel(selectedRequest.status)" :semantic="statusSemantic(selectedRequest.status)" />
        </div>

        <section class="vendor-request-details__section" aria-labelledby="vendor-request-applicant-title">
          <h3 id="vendor-request-applicant-title">اطلاعات متقاضی</h3>
          <dl class="vendor-request-details__grid">
            <div><dt>ایمیل</dt><dd class="ltr">{{ selectedRequest.email || "—" }}</dd></div>
            <div><dt>شماره تماس</dt><dd class="ltr">{{ selectedRequest.phone || "ثبت نشده" }}</dd></div>
            <div><dt>{{ selectedRequest.sellerType === "individual" ? "کد ملی" : "شماره ثبت" }}</dt><dd class="ltr">{{ selectedRequest.sellerType === "individual" ? (selectedRequest.nationalId || "—") : (selectedRequest.registrationNumber || "—") }}</dd></div>
            <div><dt>{{ selectedRequest.sellerType === "individual" ? "شناسه متقاضی" : "شناسه ملی" }}</dt><dd class="ltr">{{ selectedRequest.sellerType === "individual" ? (selectedRequest.userId || "حساب متصل نیست") : (selectedRequest.nationalId || "ثبت نشده") }}</dd></div>
            <div class="vendor-request-details__grid-wide"><dt>آدرس</dt><dd>{{ selectedRequest.address || "ثبت نشده" }}</dd></div>
          </dl>
        </section>

        <section class="vendor-request-details__section" aria-labelledby="vendor-request-meta-title">
          <h3 id="vendor-request-meta-title">اطلاعات درخواست</h3>
          <dl class="vendor-request-details__grid">
            <div><dt>شناسه درخواست</dt><dd class="ltr">{{ selectedRequest._id }}</dd></div>
            <div><dt>تاریخ ثبت</dt><dd>{{ formatDateTime(selectedRequest.createdAt) }}</dd></div>
            <div><dt>تاریخ بررسی</dt><dd>{{ formatDateTime(selectedRequest.reviewedAt) }}</dd></div>
            <div v-if="selectedRequest.companyId"><dt>شناسه شرکت ایجادشده</dt><dd class="ltr">{{ selectedRequest.companyId }}</dd></div>
            <div v-if="selectedRequest.rejectionReason" class="vendor-request-details__grid-wide"><dt>دلیل رد</dt><dd class="vendor-request-details__rejection">{{ selectedRequest.rejectionReason }}</dd></div>
          </dl>
        </section>

        <div class="vendor-request-details__actions">
          <template v-if="selectedRequest.status === 'pending'">
            <UButton v-if="selectedRequest.userId" color="success" icon="i-lucide-check-circle-2" :disabled="Boolean(processingId)" @click="reviewFromDetails('approved')">تأیید و فعال‌سازی</UButton>
            <UButton color="error" variant="soft" icon="i-lucide-circle-x" :disabled="Boolean(processingId)" @click="reviewFromDetails('rejected')">رد درخواست</UButton>
          </template>
          <UButton type="button" color="neutral" variant="outline" icon="i-lucide-x" :disabled="Boolean(processingId)" @click="closeDetails">بستن</UButton>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-if="reviewTarget" title-id="vendor-request-review-title" :busy="Boolean(processingId)" @close="closeReview">
      <form class="review-form" @submit.prevent="submitReview">
        <h2 id="vendor-request-review-title">{{ reviewAction === "approved" ? "تأیید درخواست فروشندگی" : "رد درخواست فروشندگی" }}</h2>
        <p>درخواست «{{ reviewTarget.companyName }}» بررسی می‌شود.</p>
        <UFormField v-if="reviewAction === 'rejected'" label="دلیل رد درخواست" required>
          <UTextarea v-model="rejectionReason" :rows="4" maxlength="500" required placeholder="دلیل رد را برای متقاضی بنویسید..." />
        </UFormField>
        <p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p>
        <div class="modal-actions">
          <UButton type="button" color="neutral" variant="soft" :disabled="Boolean(processingId)" @click="closeReview">انصراف</UButton>
          <UButton type="submit" :color="reviewAction === 'approved' ? 'success' : 'error'" :loading="Boolean(processingId)">
            {{ reviewAction === "approved" ? "تأیید و فعال‌سازی" : "رد درخواست" }}
          </UButton>
        </div>
      </form>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { listVendorRequests, reviewVendorRequest } from "~/services/companyService";
import { toUserFacingError } from "~/services/apiClient";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import type { VendorRequest, VendorRequestStatus } from "~/types/company";

definePageMeta({
  layout: "panel",
  middleware: ["auth", "permission"],
  permission: { resource: "companies", action: "u" },
});
useHead({ title: "داشبورد | درخواست‌های فروشندگی" });

const { canUpdate, isReady } = useAccess(Resource.COMPANIES);
const requests = ref<VendorRequest[]>([]);
const statusFilter = ref<"" | VendorRequestStatus>("pending");
const loading = ref(false);
const loadError = ref("");
const reviewTarget = ref<VendorRequest | null>(null);
const selectedRequest = ref<VendorRequest | null>(null);
const reviewAction = ref<"approved" | "rejected">("approved");
const rejectionReason = ref("");
const actionError = ref("");
const processingId = ref<string | null>(null);

const statusOptions = [
  { label: "در انتظار بررسی", value: "pending" },
  { label: "تأییدشده", value: "approved" },
  { label: "ردشده", value: "rejected" },
  { label: "همه درخواست‌ها", value: "" },
];

async function fetchRequests() {
  if (!canUpdate.value) return;
  loading.value = true;
  loadError.value = "";
  try {
    const result = await listVendorRequests({
      status: statusFilter.value || undefined,
      page: 1,
      limit: 100,
    });
    requests.value = result.items;
  } catch (error) {
    requests.value = [];
    loadError.value = toUserFacingError(error, "دریافت درخواست‌های فروشندگی انجام نشد.").message;
  } finally {
    loading.value = false;
  }
}

function openDetails(request: VendorRequest) {
  selectedRequest.value = request;
}

function closeDetails() {
  if (!processingId.value) selectedRequest.value = null;
}

function openReview(request: VendorRequest, action: "approved" | "rejected") {
  reviewTarget.value = request;
  reviewAction.value = action;
  rejectionReason.value = "";
  actionError.value = "";
}

function reviewFromDetails(action: "approved" | "rejected") {
  if (!selectedRequest.value) return;
  const request = selectedRequest.value;
  selectedRequest.value = null;
  openReview(request, action);
}

function closeReview() {
  if (!processingId.value) reviewTarget.value = null;
}

async function submitReview() {
  if (!reviewTarget.value || processingId.value) return;
  if (reviewAction.value === "rejected" && !rejectionReason.value.trim()) {
    actionError.value = "دلیل رد درخواست را وارد کنید.";
    return;
  }
  processingId.value = reviewTarget.value._id;
  actionError.value = "";
  try {
    await reviewVendorRequest(reviewTarget.value._id, reviewAction.value, rejectionReason.value);
    reviewTarget.value = null;
    await fetchRequests();
  } catch (error) {
    actionError.value = toUserFacingError(error, "بررسی درخواست انجام نشد.").message;
  } finally {
    processingId.value = null;
  }
}

function statusLabel(status: VendorRequestStatus) {
  return ({ pending: "در انتظار", approved: "تأییدشده", rejected: "ردشده" } as Record<VendorRequestStatus, string>)[status];
}

function sellerTypeLabel(type?: VendorRequest["sellerType"]) {
  return type === "individual" ? "شخص حقیقی" : "شخص حقوقی";
}

function statusSemantic(status: VendorRequestStatus) {
  return status === "approved" ? "success" : status === "rejected" ? "danger" : "warning";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

onMounted(() => { if (isReady.value) fetchRequests(); });
watch(isReady, (ready) => { if (ready) fetchRequests(); }, { once: true });
watch(statusFilter, fetchRequests);
</script>

<style scoped>
.vendor-requests-page { display:grid; gap:1rem; }
.vendor-requests-table-wrap { overflow-x:auto; }
.vendor-request-filter-label { display:flex; align-items:center; min-height:2.5rem; color:var(--color-text-muted); font-size:.82rem; font-weight:700; white-space:nowrap; }
.vendor-request-filter { min-width:12rem; }
.vendor-requests-table { width:100%; min-width:68rem; border-collapse:separate; border-spacing:0; font-size:.85rem; }
.vendor-requests-table th, .vendor-requests-table td { padding:1rem .85rem; border-bottom:1px solid var(--color-border); text-align:right; vertical-align:middle; }
.vendor-requests-table th { color:var(--color-text-muted); background:var(--color-bg-light); font-size:.78rem; font-weight:700; white-space:nowrap; }
.vendor-requests-table thead th:first-child { border-start-start-radius:var(--radius-field); }
.vendor-requests-table thead th:last-child { border-start-end-radius:var(--radius-field); }
.vendor-requests-table tbody tr { transition:background-color 150ms ease; }
.vendor-requests-table tbody tr:hover { background:var(--color-bg-light); }
.vendor-requests-table td small { color:var(--color-text-muted); }
.vendor-request-unlinked { display:block; max-width:12rem; margin-top:.35rem; color:var(--color-warning-fg); line-height:1.6; }
.vendor-request-name { display:flex; align-items:center; gap:.65rem; min-width:12rem; }
.vendor-request-name img, .vendor-request-name > span { display:grid; place-items:center; width:2.75rem; height:2.75rem; flex:none; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-dark, #1e293b); color:var(--color-brand-blue); object-fit:contain; padding:.3rem; }
.vendor-request-name__copy { display:grid; gap:.2rem; min-width:0; }
.vendor-request-name__copy strong { overflow:hidden; color:var(--color-text-heading); font-size:.85rem; font-weight:800; text-overflow:ellipsis; white-space:nowrap; }
.vendor-request-name__copy small { color:var(--color-text-muted); font-size:.72rem; }
.vendor-request-contact { overflow:hidden; max-width:15rem; color:var(--color-text-body); text-overflow:ellipsis; white-space:nowrap; }
.vendor-request-type { display:inline-flex; align-items:center; min-height:1.7rem; padding:.2rem .55rem; border:1px solid var(--color-border); border-radius:var(--radius-pill); background:var(--color-bg-light); color:var(--color-text-body); font-size:.72rem; font-weight:700; }
.vendor-request-reviewed { color:var(--color-text-muted); font-size:.78rem; }
.review-form { display:grid; gap:1rem; }
.review-form h2 { margin:0; color:var(--color-text-heading); font-size:1.1rem; font-weight:800; }
.review-form p { margin:0; color:var(--color-text-muted); }
.review-form .form-error { color:var(--color-danger); }
.vendor-request-details { display:grid; gap:1.1rem; width:100%; min-height:0; padding-top:.5rem; }
.vendor-request-details__hero { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding-bottom:1rem; border-bottom:1px solid var(--color-border); }
.vendor-request-details__identity { display:flex; align-items:center; min-width:0; gap:.85rem; }
.vendor-request-details__logo { display:grid; place-items:center; width:4.5rem; height:4.5rem; flex:none; overflow:hidden; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-dark, #1e293b); color:var(--color-brand-blue); }
.vendor-request-details__logo img { display:block; width:100%; height:100%; padding:.45rem; object-fit:contain; }
.vendor-request-details__logo .iconify { font-size:1.75rem; }
.vendor-request-details__eyebrow { margin:0 0 .25rem; color:var(--color-brand-blue); font-size:.75rem; font-weight:800; }
.vendor-request-details__hero h2 { margin:0; color:var(--color-text-heading); font-size:1.25rem; font-weight:800; overflow-wrap:anywhere; }
.vendor-request-details__hero p:last-child { margin:.25rem 0 0; color:var(--color-text-muted); font-size:.82rem; }
.vendor-request-details__section { display:grid; gap:.75rem; }
.vendor-request-details__section h3 { margin:0; color:var(--color-text-heading); font-size:.9rem; font-weight:800; }
.vendor-request-details__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.65rem; margin:0; }
.vendor-request-details__grid > div { min-width:0; padding:.75rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); }
.vendor-request-details__grid-wide { grid-column:1/-1; }
.vendor-request-details__grid dt { color:var(--color-text-muted); font-size:.75rem; }
.vendor-request-details__grid dd { margin:.35rem 0 0; color:var(--color-text-heading); font-size:.84rem; font-weight:700; overflow-wrap:anywhere; }
.vendor-request-details__grid dd.vendor-request-details__rejection { color:var(--color-danger-fg); }
.vendor-request-details__actions { display:flex; align-items:center; justify-content:flex-start; flex-wrap:wrap; gap:.6rem; margin-top:.1rem; padding:1rem 0 0; border-top:1px solid var(--color-border); }
.vendor-request-details__actions :deep(button) { min-height:2.75rem; }

@media (max-width: 640px) {
  .vendor-request-filter-label { display:none; }
  .vendor-request-filter { width:100%; }
  .vendor-request-details__hero { align-items:flex-start; flex-direction:column; }
  .vendor-request-details__grid { grid-template-columns:1fr; }
  .vendor-request-details__grid-wide { grid-column:auto; }
  .vendor-request-details__actions { flex-direction:column-reverse; align-items:stretch; }
  .vendor-request-details__actions :deep(button) { width:100%; }
}
@media (prefers-reduced-motion:reduce) { .vendor-requests-table tbody tr { transition:none; } }
</style>
