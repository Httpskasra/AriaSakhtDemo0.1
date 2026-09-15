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
        <USelect v-model="statusFilter" :items="statusOptions" aria-label="فیلتر وضعیت درخواست" />
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
            <thead>
              <tr>
                <th>کسب‌وکار</th>
                <th>متقاضی</th>
                <th>نوع</th>
                <th>اطلاعات ثبتی</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requests" :key="request._id">
                <td>
                  <div class="vendor-request-name">
                    <img v-if="request.imageUrl" :src="request.imageUrl" :alt="`لوگوی ${request.companyName}`" />
                    <span v-else aria-hidden="true"><UIcon name="i-lucide-building-2" /></span>
                    <strong>{{ request.companyName }}</strong>
                  </div>
                </td>
                <td>
                  <div>{{ request.email }}</div>
                  <small>{{ request.phone || "بدون تلفن" }}</small>
                </td>
                <td>{{ request.sellerType === "individual" ? "شخص حقیقی" : "شخص حقوقی" }}</td>
                <td>{{ request.registrationNumber || request.nationalId || "—" }}</td>
                <td><StatusPill :label="statusLabel(request.status)" :semantic="statusSemantic(request.status)" /></td>
                <td class="ltr">{{ formatDate(request.createdAt) }}</td>
                <td>
                  <div v-if="request.status === 'pending'" class="panel-row-actions">
                    <UButton v-if="request.userId" size="xs" color="success" :disabled="Boolean(processingId)" @click="openReview(request, 'approved')">تأیید و فعال‌سازی</UButton>
                    <UButton size="xs" color="error" variant="soft" :disabled="Boolean(processingId)" @click="openReview(request, 'rejected')">رد درخواست</UButton>
                    <small v-if="!request.userId" class="vendor-request-unlinked">بدون حساب کاربری؛ فقط قابل رد است</small>
                  </div>
                  <span v-else class="vendor-request-reviewed">بررسی شده</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PanelPermissionGuard>

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

function openReview(request: VendorRequest, action: "approved" | "rejected") {
  reviewTarget.value = request;
  reviewAction.value = action;
  rejectionReason.value = "";
  actionError.value = "";
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

function statusSemantic(status: VendorRequestStatus) {
  return status === "approved" ? "success" : status === "rejected" ? "danger" : "warning";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(date);
}

onMounted(() => { if (isReady.value) fetchRequests(); });
watch(isReady, (ready) => { if (ready) fetchRequests(); }, { once: true });
watch(statusFilter, fetchRequests);
</script>

<style scoped>
.vendor-requests-page { display:grid; gap:1rem; }
.vendor-requests-table-wrap { overflow-x:auto; }
.vendor-requests-table { width:100%; min-width:62rem; border-collapse:collapse; font-size:.85rem; }
.vendor-requests-table th, .vendor-requests-table td { padding:.8rem .75rem; border-bottom:1px solid var(--color-border); text-align:right; vertical-align:middle; }
.vendor-requests-table th { color:var(--color-text-muted); font-size:.78rem; font-weight:700; white-space:nowrap; }
.vendor-requests-table td small { color:var(--color-text-muted); }
.vendor-request-unlinked { display:block; max-width:12rem; line-height:1.6; }
.vendor-request-name { display:flex; align-items:center; gap:.65rem; min-width:12rem; }
.vendor-request-name img, .vendor-request-name > span { display:grid; place-items:center; width:2.5rem; height:2.5rem; flex:none; border-radius:var(--radius-field); background:var(--color-info-bg); color:var(--color-brand-blue); object-fit:contain; }
.vendor-request-reviewed { color:var(--color-text-muted); font-size:.78rem; }
.review-form { display:grid; gap:1rem; }
.review-form h2 { margin:0; color:var(--color-text-heading); font-size:1.1rem; font-weight:800; }
.review-form p { margin:0; color:var(--color-text-muted); }
.form-error { color:var(--color-danger) !important; }
</style>
