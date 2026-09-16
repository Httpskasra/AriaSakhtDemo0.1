<template>
    <PanelPageHeader title="شرکت‌ها" subtitle="شرکت‌ها و وضعیت فعالیت تأمین‌کنندگان را مدیریت کنید" icon="i-lucide-building-2">
      <template #actions>
        <UButton v-if="canUpdate" to="/dashboard/admin/vendor-requests" color="neutral" variant="soft" icon="i-lucide-clipboard-check">درخواست‌های فروشندگی</UButton>
        <UButton v-if="canCreate" icon="i-lucide-plus" @click="openModal()">افزودن شرکت</UButton>
      </template>
    </PanelPageHeader>

    <div class="space-y-4" dir="rtl">
      <PanelFilterBar>
        <div class="filter-group">
          <TableFilterInput
            v-model="search"
            placeholder="جستجوی شرکت..."
            @submit="applyCompanyFilters" />
          <USelect
            v-model="sort"
            :items="[
              { label: 'جدیدترین', value: 'createdAt:desc' },
              { label: 'قدیمی‌ترین', value: 'createdAt:asc' },
              { label: 'نام (الفبا)', value: 'name:asc' }
            ]" />
          <USelect
            v-model="limit"
            :items="[
              { label: '۱۰', value: 10 },
              { label: '۲۵', value: 25 },
              { label: '۵۰', value: 50 }
            ]" />
        </div>
        <UButton v-if="search" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''">حذف جستجو</UButton>
      </PanelFilterBar>

      <div class="premium-card panel-table-card company-table-card">
        <SharedAsyncState v-if="loading" state="loading" :skeleton-rows="5" />
        <SharedAsyncState
          v-else-if="loadError"
          state="error"
          :message="loadError"
          @retry="fetchCompanies" />
        <SharedAsyncState
          v-else-if="!companies.length"
          state="empty"
          title="شرکتی پیدا نشد"
          message="فیلترها را تغییر دهید یا اولین شرکت را اضافه کنید." />
        <div v-else class="overflow-x-auto">
          <table class="company-table">
            <caption class="sr-only">فهرست شرکت‌ها و وضعیت فعالیت آن‌ها</caption>
            <thead>
              <tr class="bg-gray-50 text-gray-600">
                <th
                  scope="col">
                  لوگو
                </th>
                <th
                  scope="col">
                  نام
                </th>
                <th
                  v-if="canRead"
                  scope="col">
                  ایمیل
                </th>
                <th
                  v-if="canRead"
                  scope="col">
                  تلفن
                </th>
                <th
                  v-if="canRead"
                  scope="col">
                  شماره ثبت
                </th>
                <th
                  v-if="canRead"
                  scope="col">
                  آدرس
                </th>
                <th
                  v-if="canRead"
                  scope="col">
                  وضعیت
                </th>
                <th
                  v-if="canRead"
                  scope="col"
                  class="company-table__operations-heading">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr
                v-for="(company, idx) in companies"
                :key="company._id || idx"
                class="company-table__row">
                <td class="company-table__logo-cell">
                  <div class="company-logo-frame">
                    <img
                      v-if="company.image"
                      :src="company.image"
                      :alt="`لوگوی ${company.name}`"
                      class="company-logo-frame__image" />
                    <UIcon v-else name="i-lucide-building-2" aria-hidden="true" />
                  </div>
                </td>
                <td class="company-table__identity-cell">
                  <div class="company-identity">
                    <strong>{{ company.name }}</strong>
                    <small>{{ companySellerTypeLabel(company.sellerType) }}</small>
                  </div>
                </td>
                <td
                  class="company-table__value font-num"
                  v-if="canRead">
                  {{ company.email }}
                </td>
                <td
                  class="company-table__value font-num"
                  v-if="canRead">
                  {{ company.phone || "—" }}
                </td>
                <td
                  class="company-table__value font-num"
                  v-if="canRead">
                  {{ company.registrationNumber || "—" }}
                </td>
                <td
                  class="company-table__value company-table__address"
                  v-if="canRead">
                  {{ company.address || "—" }}
                </td>
                <td class="company-table__status-cell" v-if="canRead">
                  <div class="company-status-control">
                    <StatusPill
                      :label="companyStatusLabel(getCompanyStatus(company))"
                      :semantic="companyStatusSemantic(getCompanyStatus(company))"
                      :icon="companyStatusIcon(getCompanyStatus(company))"
                      size="compact" />

                    <USelect
                      v-if="canUpdate"
                      :model-value="statusDraft[company._id || ''] ?? getCompanyStatus(company)"
                      :open="statusOpen[company._id || ''] ?? false"
                      :disabled="Boolean(statusLoading[company._id || ''])"
                      size="xs"
                      :items="statusOptions"
                      class="company-status-select"
                      :aria-label="`تغییر وضعیت ${company.name}`"
                      @update:open="(open) => setStatusOpen(company, open)"
                      @update:model-value="(value) => onChangeStatus(value, company)" />
                  </div>
                </td>
                <td class="company-table__operations" @click.stop>
                  <div class="panel-row-actions company-table__actions">
                    <UButton
                      v-if="canUpdate"
                      @click="openModal(company)"
                      size="xs"
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-pencil"
                      :aria-label="`ویرایش ${company.name}`">
                      ویرایش
                    </UButton>
                    <UButton
                      v-if="canDelete"
                      @click="deleteCompany(company)"
                      size="xs"
                      color="error"
                      variant="soft"
                      icon="i-lucide-trash-2"
                      :loading="deletingId === company._id"
                      :disabled="Boolean(deletingId)"
                      :aria-label="`حذف ${company.name}`">
                      حذف
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="total > limit" class="flex justify-center py-4">
        <UPagination v-model="page" :total="total" :page-count="limit" :disabled="loading" />
      </div>

      <!-- Modal -->
      <BaseModal v-if="showModal" @close="closeModal">
        <div class="w-full max-w-md mx-auto space-y-4" dir="rtl">
          <h2 class="text-lg font-bold">
            {{ editMode ? "ویرایش شرکت" : "شرکت جدید" }}
          </h2>
          <UForm :state="form" @submit.prevent="saveCompany" class="space-y-4">
            <UFormField label="نام" name="name">
              <UInput v-model="form.name" required />
            </UFormField>

            <UFormField label="ایمیل" name="email">
              <UInput v-model="form.email" type="email" required />
            </UFormField>

            <UFormField label="تلفن" name="phone">
              <UInput v-model="form.phone" />
            </UFormField>

            <UFormField label="شماره ثبت" name="registrationNumber" required>
              <UInput v-model="form.registrationNumber" required inputmode="numeric" />
            </UFormField>

            <UFormField label="آدرس" name="address">
              <UTextarea v-model="form.address" />
            </UFormField>

            <div class="company-upload-field">
              <label for="company-logo-input">لوگوی شرکت</label>
              <input id="company-logo-input" ref="fileInputRef" class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" @change="onFileChange" />
              <div class="company-upload-control">
                <span>{{ selectedImage?.name || "فایلی انتخاب نشده است" }}</span>
                <UButton type="button" color="neutral" variant="soft" icon="i-lucide-upload" @click="fileInputRef?.click()">انتخاب فایل</UButton>
              </div>
              <img v-if="imagePreview" :src="imagePreview" alt="پیش‌نمایش لوگوی شرکت" class="company-logo-preview" />
              <p>فرمت JPG، PNG یا WEBP؛ حداکثر ۱۰ مگابایت</p>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <UButton
                type="button"
                @click="closeModal"
                color="neutral"
                variant="soft">
                انصراف
              </UButton>
              <UButton type="submit" :loading="saving" :disabled="saving">
                ذخیره
              </UButton>
            </div>
          </UForm>
        </div>
      </BaseModal>
    </div>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { toUserFacingError } from "~/services/apiClient";
import type { Company } from "~/types/company";
import { listCompanies, updateCompany, createCompany, deleteCompany as removeCompany, changeCompanyStatus, uploadCompanyImage } from "~/services/companyService";
useHead({
  title: "داشبورد | شرکت‌ها",
});

// // دسترسی‌ها
const { canManage, canCreate, canRead, canUpdate, canDelete, isReady } = useAccess(
  Resource.COMPANIES
);
// const { canCreate, canRead, canUpdate, canDelete } = {
//   canCreate: true,
//   canDelete: true,
//   canRead: true,
//   canUpdate: true,
// };
const companies = ref<Company[]>([]);
const search = ref("");
const sort = ref("createdAt:desc");
const page = ref(1);
const limit = ref(25);
const total = ref(0);
const loading = ref(false);
const loadError = ref("");
const showModal = ref(false);
const editMode = ref(false);
const selectedId = ref<string | null>(null);
const selectedImage = ref<File | null>(null);
const imagePreview = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);

const form = ref({
  name: "",
  email: "",
  phone: "",
  registrationNumber: "",
  address: "",
  // status: "",
  image: "",
});

const { $axios } = useNuxtApp();

// small map to track loading state per-company when changing status
const statusLoading = ref<Record<string, boolean>>({});
const statusDraft = ref<Record<string, CompanyStatusValue>>({});
const statusOpen = ref<Record<string, boolean>>({});
const saving = ref(false);
const deletingId = ref<string | null>(null);

type CompanyStatusValue = "active" | "suspended" | "pending" | "rejected";
const statusOptions = [
  { label: "فعال", value: "active" },
  { label: "معلق", value: "suspended" },
  { label: "در انتظار", value: "pending" },
  { label: "رد شده", value: "rejected" },
] satisfies Array<{ label: string; value: CompanyStatusValue }>;

function getCompanyStatus(company: Company): CompanyStatusValue {
  return company.status ?? (company.isActive ? "active" : "suspended");
}

function companySellerTypeLabel(type?: Company["sellerType"]) {
  return type === "individual" ? "شخص حقیقی" : "شخص حقوقی";
}

function companyStatusLabel(status: CompanyStatusValue) {
  return ({
    active: "فعال",
    suspended: "معلق",
    pending: "در انتظار",
    rejected: "رد شده",
  } as Record<CompanyStatusValue, string>)[status];
}

function companyStatusSemantic(status: CompanyStatusValue) {
  return status === "active" ? "success" : status === "rejected" ? "danger" : status === "pending" ? "warning" : "neutral";
}

function companyStatusIcon(status: CompanyStatusValue) {
  return status === "active"
    ? "i-lucide-circle-check"
    : status === "rejected"
    ? "i-lucide-circle-x"
    : status === "pending"
    ? "i-lucide-clock-3"
    : "i-lucide-pause-circle";
}

function setStatusOpen(company: Company, open: boolean) {
  if (!company._id || statusLoading.value[company._id]) return;
  statusOpen.value[company._id] = open;
}

/**
 * Handle inline status change. Sends PATCH to /companies/:id/status
 * body: { status: 'pending' | 'active' | 'inactive' }
 */
/**
 * Handle inline status change. Sends PATCH to /companies/:id/status
 * body: { status: 'pending' | 'active' | 'suspended' | 'rejected' }
 */
async function onChangeStatus(value: unknown, company: Company) {
  if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
  if (!statusOptions.some((option) => option.value === value)) return;
  const newStatus = value as CompanyStatusValue;
  if (!company._id) {
    return feedback.error("شناسه نامعتبر", "شناسه شرکت موجود نیست.");
  }

  const companyId = company._id;
  const previousStatus = getCompanyStatus(company);
  // Close before confirmation. The select is fully controlled, so the
  // popover cannot be left open by the component's internal update cycle.
  statusOpen.value[companyId] = false;
  await nextTick();

  if (!window.confirm("آیا از تغییر وضعیت این شرکت مطمئن هستید؟")) {
    statusDraft.value[companyId] = previousStatus;
    return;
  }

  try {
    statusDraft.value[companyId] = newStatus;
    statusLoading.value[companyId] = true;
    await changeCompanyStatus(companyId, newStatus);
    company.status = newStatus;
  } catch (err) {
    console.error("خطا در تغییر وضعیت:", err);
    feedback.error("تغییر وضعیت انجام نشد", toUserFacingError(err).message);
    statusDraft.value[companyId] = previousStatus;
  } finally {
    statusLoading.value[companyId] = false;
    statusOpen.value[companyId] = false;
  }
}

const fetchCompanies = async () => {
  if (!canRead.value) return;
  loading.value = true;
  loadError.value = "";
  try {
    const result = await listCompanies({
      page: page.value,
      limit: limit.value,
      sort: sort.value,
      filter: search.value.trim() || undefined,
      managed: true,
    });
    companies.value = result.items;
    for (const company of result.items) {
      if (company._id) statusDraft.value[company._id] = getCompanyStatus(company);
    }
    total.value = result.total;
  } catch (err) {
    console.error("خطا در دریافت شرکت‌ها:", err);
    loadError.value = toUserFacingError(err).message;
    companies.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));

function applyCompanyFilters() {
  page.value = 1;
  fetchCompanies();
}

function goToCompanyPage(nextPage: number) {
  page.value = Math.max(1, Math.min(nextPage, totalPages.value));
  fetchCompanies();
}

watch([sort, limit], applyCompanyFilters);

function openModal(company: any | null = null) {
  if (company) {
    if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
    editMode.value = true;
    selectedId.value = company._id; // changed from company.id
    form.value = { ...company };
    selectedImage.value = null;
    imagePreview.value = company.image || "";
  } else {
    if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
    editMode.value = false;
    selectedId.value = null;
    form.value = {
      name: "",
      email: "",
      phone: "",
      registrationNumber: "",
      address: "",
      // status: "",
      image: "",
    };
    selectedImage.value = null;
    imagePreview.value = "";
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedImage.value = null;
  imagePreview.value = "";
  if (fileInputRef.value) fileInputRef.value.value = "";
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type) || file.size > 10 * 1024 * 1024) {
      feedback.error("فایل نامعتبر", "لوگو باید PNG، JPG یا WEBP و حداکثر ۱۰ مگابایت باشد.");
      input.value = "";
      return;
    }
    selectedImage.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

const saveCompany = async () => {
  if (saving.value) return;
  try {
    if (!form.value.name.trim() || !form.value.email.trim()) {
      feedback.error("اطلاعات ناقص", "نام و ایمیل شرکت الزامی هستند.");
      return;
    }
    saving.value = true;
    // Only persist server-issued URLs. Never send the local preview/data URL
    // to the API because it is not a durable company image reference.
    let imageUrl = form.value.image?.startsWith("http")
      ? form.value.image
      : undefined;
    if (selectedImage.value) {
      imageUrl = await uploadCompanyImage(selectedImage.value);
    }
    if (editMode.value) {
      if (!selectedId.value || selectedId.value.length !== 24) {
        feedback.error("شناسه نامعتبر", "شناسه شرکت معتبر نیست.");
        return;
      }
      // فقط فیلدهای قابل ویرایش را ارسال کن. اگر تصویر جدیدی انتخاب نشده،
      // فیلد image را حذف می‌کنیم تا لوگوی قبلی ناخواسته پاک نشود.
      const cleanData: Record<string, string | undefined> = {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim() || undefined,
        registrationNumber: form.value.registrationNumber.trim(),
        address: form.value.address.trim() || undefined,
      };
      if (imageUrl) cleanData.image = imageUrl;
      //console.log("PATCH id:", selectedId.value); // برای دیباگ
      await updateCompany(selectedId.value, cleanData);
    } else {
      await createCompany({
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim() || undefined,
        registrationNumber: form.value.registrationNumber.trim(),
        address: form.value.address.trim() || undefined,
        image: imageUrl,
      });
    }
    await fetchCompanies();
    closeModal();
  } catch (err) {
    console.error("خطا در ذخیره شرکت:", err);
    feedback.error("ذخیره شرکت انجام نشد", toUserFacingError(err).message);
  } finally {
    saving.value = false;
  }
};

const deleteCompany = async (company: Company) => {
  if (!company._id || deletingId.value) return;
  if (!canDelete.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه حذف ندارید.");
  if (!confirm("آیا از حذف این شرکت مطمئن هستید؟")) return;
  try {
    deletingId.value = company._id;
    await removeCompany(company._id);
    await fetchCompanies();
  } catch (err) {
    console.error("خطا در حذف شرکت:", err);
    feedback.error("حذف شرکت انجام نشد", toUserFacingError(err).message);
  } finally {
    deletingId.value = null;
  }
};

onMounted(() => { if (isReady.value) fetchCompanies(); });
watch(isReady, (ready) => { if (ready) fetchCompanies(); }, { once: true });
</script>

<style scoped>
.company-table-card { overflow: hidden; }
.company-table { width:100%; min-width:72rem; border-collapse:separate; border-spacing:0; font-size:.875rem; }
.company-table th, .company-table td { padding:.9rem 1rem; text-align:right; vertical-align:middle; border-bottom:1px solid var(--color-border); }
.company-table th { color:var(--color-text-muted); background:var(--color-bg-light); font-size:.78rem; font-weight:800; white-space:nowrap; }
.company-table thead th:first-child { border-start-start-radius:var(--radius-field); }
.company-table thead th:last-child { border-start-end-radius:var(--radius-field); }
.company-table__row { transition:background-color .18s ease; }
.company-table__row:hover { background:var(--color-bg-light); }
.company-table tbody tr:last-child td { border-bottom:0; }
.company-table__logo-cell { width:5.5rem; }
.company-logo-frame { display:grid; place-items:center; width:3.25rem; height:3.25rem; overflow:hidden; border:1px solid var(--color-border-strong); border-radius:var(--radius-compact-list-item); background:var(--color-bg-dark, #1e293b); color:var(--color-brand-blue); }
.company-logo-frame__image { display:block; width:100%; height:100%; padding:.35rem; object-fit:contain; }
.company-identity { display:grid; gap:.25rem; min-width:10rem; }
.company-identity strong { color:var(--color-text-heading); font-size:.9rem; font-weight:800; }
.company-identity small { color:var(--color-text-muted); font-size:.75rem; }
.company-table__value { color:var(--color-text-body); white-space:nowrap; }
.company-table__address { max-width:15rem; overflow:hidden; color:var(--color-text-body); text-overflow:ellipsis; white-space:nowrap; }
.company-table__status-cell { min-width:12.5rem; }
.company-status-control { display:flex; align-items:center; flex-wrap:wrap; gap:.55rem; }
.company-status-select { min-width:6.25rem; }
.company-table__operations-heading { width:13rem; }
.company-table__operations { min-width:13rem; }
.company-table__actions { gap:.4rem; }
.company-table__actions :deep(button) { min-height:2.5rem; }
.company-upload-field { display:grid; gap:.45rem; }
.company-upload-field > label { color:var(--color-text-heading); font-size:.85rem; font-weight:700; }
.company-upload-control { display:flex; align-items:center; justify-content:space-between; gap:.75rem; min-height:2.75rem; padding:.5rem .65rem; border:1px dashed var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); color:var(--color-text-muted); }
.company-upload-field p { margin:0; color:var(--color-text-muted); font-size:.75rem; }
.company-logo-preview { width:5rem; height:5rem; border-radius:var(--radius-field); object-fit:cover; border:1px solid var(--color-border); }
@media (max-width: 640px) { .company-upload-control { align-items:stretch; flex-direction:column; } }
@media (prefers-reduced-motion: reduce) { .company-table__row { transition:none; } }
</style>
