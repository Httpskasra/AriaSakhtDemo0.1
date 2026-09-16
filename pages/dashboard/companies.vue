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

                    <div
                      v-if="canUpdate"
                      class="company-status-select"
                      :class="{ 'company-status-select--open': isStatusOpen(company) }">
                      <button
                        type="button"
                        class="company-status-trigger"
                        :aria-expanded="isStatusOpen(company)"
                        aria-haspopup="listbox"
                        :aria-controls="`company-status-options-${companyKey(company)}`"
                        :disabled="Boolean(statusLoading[companyKey(company)])"
                        :aria-label="`تغییر وضعیت ${company.name}`"
                        @click.stop="toggleStatusMenu(company)">
                        <UIcon name="i-lucide-sliders-horizontal" aria-hidden="true" />
                        <span>{{ statusLoading[companyKey(company)] ? "در حال ذخیره" : "تغییر وضعیت" }}</span>
                        <UIcon :name="isStatusOpen(company) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" aria-hidden="true" />
                      </button>
                      <div
                        v-if="isStatusOpen(company)"
                        :id="`company-status-options-${companyKey(company)}`"
                        class="company-status-options"
                        role="listbox"
                        :aria-label="`وضعیت‌های قابل انتخاب برای ${company.name}`"
                        @click.stop>
                        <button
                          v-for="option in statusOptions"
                          :key="option.value"
                          type="button"
                          class="company-status-option"
                          :class="{ 'company-status-option--selected': (statusDraft[companyKey(company)] ?? getCompanyStatus(company)) === option.value }"
                          role="option"
                          :aria-selected="(statusDraft[companyKey(company)] ?? getCompanyStatus(company)) === option.value"
                          @click="onChangeStatus(option.value, company)">
                          <span class="company-status-option__dot" :class="`company-status-option__dot--${option.value}`" aria-hidden="true"></span>
                          <span>{{ option.label }}</span>
                          <UIcon v-if="(statusDraft[companyKey(company)] ?? getCompanyStatus(company)) === option.value" name="i-lucide-check" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="company-table__operations" @click.stop>
                  <div class="panel-row-actions company-table__actions">
                    <UButton
                      v-if="canRead"
                      @click="openDetails(company)"
                      size="xs"
                      color="primary"
                      variant="soft"
                      icon="i-lucide-eye"
                      :aria-label="`مشاهده جزئیات ${company.name}`">
                      مشاهده
                    </UButton>
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
                      :loading="deletingId === companyKey(company)"
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
      <BaseModal v-if="showModal" title-id="company-edit-title" :busy="saving" @close="closeModal">
        <div class="company-edit-modal" dir="rtl">
          <div class="company-modal-heading">
            <span class="company-modal-heading__icon"><UIcon name="i-lucide-building-2" aria-hidden="true" /></span>
            <div>
              <p>مدیریت اطلاعات کسب‌وکار</p>
              <h2 id="company-edit-title">
                {{ editMode ? "ویرایش شرکت" : "شرکت جدید" }}
              </h2>
            </div>
          </div>
          <UForm :state="form" @submit.prevent="saveCompany" class="company-edit-form">
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

            <div class="company-modal-actions">
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

      <BaseModal v-if="selectedCompany" title-id="company-details-title" @close="closeDetails">
        <div class="company-details-modal" dir="rtl">
          <div class="company-details-modal__hero">
            <div class="company-details-modal__identity">
              <div class="company-details-modal__logo">
                <img v-if="selectedCompany.image" :src="selectedCompany.image" :alt="`لوگوی ${selectedCompany.name}`" />
                <UIcon v-else name="i-lucide-building-2" aria-hidden="true" />
              </div>
              <div>
                <p class="company-details-modal__eyebrow">جزئیات شرکت</p>
                <h2 id="company-details-title">{{ selectedCompany.name }}</h2>
                <p>{{ companySellerTypeLabel(selectedCompany.sellerType) }}</p>
              </div>
            </div>
            <StatusPill
              :label="companyStatusLabel(getCompanyStatus(selectedCompany))"
              :semantic="companyStatusSemantic(getCompanyStatus(selectedCompany))"
              :icon="companyStatusIcon(getCompanyStatus(selectedCompany))"
              size="compact" />
          </div>

          <section class="company-details-modal__section" aria-labelledby="company-details-contact-title">
            <h3 id="company-details-contact-title">اطلاعات تماس و ثبتی</h3>
            <dl class="company-details-modal__grid">
              <div><dt>ایمیل</dt><dd class="ltr">{{ selectedCompany.email || "ثبت نشده" }}</dd></div>
              <div><dt>تلفن</dt><dd class="ltr">{{ selectedCompany.phone || "ثبت نشده" }}</dd></div>
              <div><dt>شماره ثبت</dt><dd class="font-num">{{ selectedCompany.registrationNumber || "ثبت نشده" }}</dd></div>
              <div v-if="selectedCompany.nationalId"><dt>شناسه ملی / کد ملی</dt><dd class="font-num">{{ selectedCompany.nationalId }}</dd></div>
              <div class="company-details-modal__grid-wide"><dt>آدرس</dt><dd>{{ selectedCompany.address || "ثبت نشده" }}</dd></div>
            </dl>
          </section>

          <section class="company-details-modal__section" aria-labelledby="company-details-meta-title">
            <h3 id="company-details-meta-title">اطلاعات ثبت در سامانه</h3>
            <dl class="company-details-modal__grid">
              <div><dt>شناسه شرکت</dt><dd class="ltr">{{ selectedCompany._id || selectedCompany.id || "—" }}</dd></div>
              <div><dt>تاریخ ایجاد</dt><dd>{{ formatDate(selectedCompany.createdAt) }}</dd></div>
              <div><dt>آخرین به‌روزرسانی</dt><dd>{{ formatDate(selectedCompany.updatedAt) }}</dd></div>
            </dl>
          </section>

          <div class="company-details-modal__actions">
            <UButton v-if="canUpdate" type="button" icon="i-lucide-pencil" @click="editSelectedCompany">ویرایش شرکت</UButton>
            <UButton type="button" color="neutral" variant="outline" icon="i-lucide-x" @click="closeDetails">بستن</UButton>
          </div>
        </div>
      </BaseModal>
    </div>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { toUserFacingError } from "~/services/apiClient";
import type { Company } from "~/types/company";
import { listCompanies, updateCompany, createCompany, deleteCompany as removeCompany, changeCompanyStatus, uploadCompanyImage } from "~/services/companyService";
useHead({
  title: "داشبورد | شرکت‌ها",
});

// // دسترسی‌ها
const { canCreate, canRead, canUpdate, canDelete, isReady } = useAccess(
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
const selectedCompany = ref<Company | null>(null);
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

// small map to track loading state per-company when changing status
const statusLoading = ref<Record<string, boolean>>({});
const statusDraft = ref<Record<string, CompanyStatusValue>>({});
const openStatusCompanyId = ref<string | null>(null);
const saving = ref(false);
const deletingId = ref<string | null>(null);

type CompanyStatusValue = "active" | "suspended" | "pending" | "rejected";
const statusOptions = [
  { label: "فعال", value: "active" },
  { label: "معلق", value: "suspended" },
  { label: "در انتظار", value: "pending" },
  { label: "رد شده", value: "rejected" },
] satisfies Array<{ label: string; value: CompanyStatusValue }>;

function companyKey(company: Company) {
  return String(company._id || company.id || "");
}

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

function isStatusOpen(company: Company) {
  const id = companyKey(company);
  return Boolean(id && openStatusCompanyId.value === id);
}

function toggleStatusMenu(company: Company) {
  const id = companyKey(company);
  if (!id || statusLoading.value[id]) return;
  openStatusCompanyId.value = isStatusOpen(company) ? null : id;
  statusDraft.value[id] = getCompanyStatus(company);
}

function closeStatusMenu() {
  openStatusCompanyId.value = null;
}

function handleStatusDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (target instanceof Element && !target.closest(".company-status-select")) closeStatusMenu();
}

function handleStatusEscape(event: KeyboardEvent) {
  if (event.key === "Escape") closeStatusMenu();
}

async function onChangeStatus(value: unknown, company: Company) {
  if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
  if (!statusOptions.some((option) => option.value === value)) return;
  const newStatus = value as CompanyStatusValue;
  const companyId = companyKey(company);
  if (!companyId) {
    return feedback.error("شناسه نامعتبر", "شناسه شرکت موجود نیست.");
  }

  const previousStatus = getCompanyStatus(company);
  try {
    closeStatusMenu();
    statusDraft.value[companyId] = newStatus;
    statusLoading.value[companyId] = true;
    await changeCompanyStatus(companyId, newStatus);
    company.status = newStatus;
    feedback.success("وضعیت شرکت به‌روزرسانی شد", `وضعیت «${companyStatusLabel(newStatus)}» برای شرکت ثبت شد.`);
  } catch (err) {
    console.error("خطا در تغییر وضعیت:", err);
    feedback.error("تغییر وضعیت انجام نشد", toUserFacingError(err).message);
    statusDraft.value[companyId] = previousStatus;
  } finally {
    statusLoading.value[companyId] = false;
    closeStatusMenu();
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
      const id = companyKey(company);
      if (id) statusDraft.value[id] = getCompanyStatus(company);
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

function applyCompanyFilters() {
  page.value = 1;
  fetchCompanies();
}

watch([sort, limit], applyCompanyFilters);

function openModal(company: any | null = null) {
  closeStatusMenu();
  if (company) {
    if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
    editMode.value = true;
    selectedId.value = companyKey(company);
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

function openDetails(company: Company) {
  if (!canRead.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه مشاهده اطلاعات شرکت را ندارید.");
  closeStatusMenu();
  selectedCompany.value = company;
}

function closeDetails() {
  selectedCompany.value = null;
}

function editSelectedCompany() {
  const company = selectedCompany.value;
  if (!company) return;
  closeDetails();
  openModal(company);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(date);
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
  const id = companyKey(company);
  if (!id || deletingId.value) return;
  if (!canDelete.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه حذف ندارید.");
  if (!confirm("آیا از حذف این شرکت مطمئن هستید؟")) return;
  try {
    deletingId.value = id;
    await removeCompany(id);
    await fetchCompanies();
  } catch (err) {
    console.error("خطا در حذف شرکت:", err);
    feedback.error("حذف شرکت انجام نشد", toUserFacingError(err).message);
  } finally {
    deletingId.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleStatusDocumentClick);
  document.addEventListener("keydown", handleStatusEscape);
  if (isReady.value) fetchCompanies();
});
onUnmounted(() => {
  document.removeEventListener("click", handleStatusDocumentClick);
  document.removeEventListener("keydown", handleStatusEscape);
});
watch(isReady, (ready) => { if (ready) fetchCompanies(); }, { once: true });
</script>

<style scoped>
.company-table-card { overflow: hidden; }
.company-table { width:100%; min-width:80rem; border-collapse:separate; border-spacing:0; font-size:.875rem; }
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
.company-table__status-cell { min-width:16rem; }
.company-status-control { display:grid; align-items:start; gap:.55rem; }
.company-status-select { display:grid; gap:.35rem; width:min(100%, 15rem); }
.company-status-trigger { display:flex; align-items:center; justify-content:space-between; gap:.45rem; min-height:2.5rem; padding:.5rem .7rem; border:1px solid var(--color-border-strong); border-radius:var(--radius-field); color:var(--color-text-body); background:var(--color-bg-surface); font:inherit; font-size:.75rem; font-weight:700; cursor:pointer; transition:border-color .18s ease, background-color .18s ease, box-shadow .18s ease; }
.company-status-trigger:hover { border-color:var(--color-brand-blue); background:var(--color-info-bg); }
.company-status-trigger:focus-visible, .company-status-option:focus-visible { outline:none; box-shadow:var(--focus-ring); }
.company-status-trigger:disabled { opacity:.65; cursor:wait; }
.company-status-trigger > span { flex:1; text-align:right; }
.company-status-options { display:grid; gap:.2rem; padding:.3rem; border:1px solid var(--color-border-strong); border-radius:var(--radius-field); background:var(--color-bg-surface); box-shadow:var(--shadow-raised); }
.company-status-option { display:flex; align-items:center; gap:.5rem; min-height:2.35rem; padding:.4rem .55rem; border:0; border-radius:.45rem; color:var(--color-text-body); background:transparent; font:inherit; font-size:.75rem; text-align:right; cursor:pointer; }
.company-status-option:hover, .company-status-option--selected { color:var(--color-text-heading); background:var(--color-bg-light); }
.company-status-option > span:nth-child(2) { flex:1; }
.company-status-option__dot { width:.55rem; height:.55rem; flex:0 0 auto; border-radius:50%; background:var(--color-text-muted); }
.company-status-option__dot--active { background:#16a34a; }
.company-status-option__dot--suspended { background:#64748b; }
.company-status-option__dot--pending { background:#d97706; }
.company-status-option__dot--rejected { background:#dc2626; }
.company-table__operations-heading { width:13rem; }
.company-table__operations { min-width:17rem; }
.company-table__actions { gap:.4rem; }
.company-table__actions :deep(button) { min-height:2.5rem; }
.company-edit-modal, .company-details-modal { display:grid; gap:1.25rem; width:100%; }
.company-modal-heading { display:flex; align-items:center; gap:.75rem; padding-inline-end:2.5rem; }
.company-modal-heading__icon { display:grid; place-items:center; width:2.75rem; height:2.75rem; flex:0 0 auto; border-radius:var(--radius-compact-list-item); color:var(--color-brand-blue); background:var(--color-info-bg); font-size:1.3rem; }
.company-modal-heading p, .company-details-modal__eyebrow { margin:0 0 .2rem; color:var(--color-brand-blue); font-size:.72rem; font-weight:800; }
.company-modal-heading h2, .company-details-modal h2 { margin:0; color:var(--color-text-heading); font-size:1.15rem; font-weight:800; }
.company-edit-form { display:grid; gap:1rem; }
.company-modal-actions, .company-details-modal__actions { display:flex; justify-content:flex-start; gap:.55rem; padding-top:1rem; border-top:1px solid var(--color-border); }
.company-details-modal__hero { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding-bottom:1rem; border-bottom:1px solid var(--color-border); }
.company-details-modal__identity { display:flex; align-items:center; gap:.8rem; min-width:0; }
.company-details-modal__identity > div:last-child { min-width:0; }
.company-details-modal__identity > div:last-child > p:last-child { margin:0; color:var(--color-text-muted); font-size:.8rem; }
.company-details-modal__logo { display:grid; place-items:center; width:4.5rem; height:4.5rem; flex:0 0 auto; overflow:hidden; border:1px solid var(--color-border-strong); border-radius:var(--radius-card); color:var(--color-brand-blue); background:var(--color-bg-light); font-size:1.5rem; }
.company-details-modal__logo img { display:block; width:100%; height:100%; padding:.35rem; object-fit:contain; }
.company-details-modal__section { display:grid; gap:.75rem; }
.company-details-modal__section h3 { margin:0; color:var(--color-text-heading); font-size:.9rem; font-weight:800; }
.company-details-modal__grid { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:.65rem; margin:0; }
.company-details-modal__grid > div { display:grid; gap:.25rem; min-width:0; padding:.7rem .8rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); }
.company-details-modal__grid-wide { grid-column:1 / -1; }
.company-details-modal__grid dt { color:var(--color-text-muted); font-size:.7rem; font-weight:700; }
.company-details-modal__grid dd { margin:0; color:var(--color-text-heading); font-size:.82rem; overflow-wrap:anywhere; }
.ltr { direction:ltr; text-align:right; }
.company-upload-field { display:grid; gap:.45rem; }
.company-upload-field > label { color:var(--color-text-heading); font-size:.85rem; font-weight:700; }
.company-upload-control { display:flex; align-items:center; justify-content:space-between; gap:.75rem; min-height:2.75rem; padding:.5rem .65rem; border:1px dashed var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); color:var(--color-text-muted); }
.company-upload-field p { margin:0; color:var(--color-text-muted); font-size:.75rem; }
.company-logo-preview { width:5rem; height:5rem; border-radius:var(--radius-field); object-fit:contain; border:1px solid var(--color-border); background:var(--color-bg-light); }
@media (max-width: 640px) { .company-upload-control { align-items:stretch; flex-direction:column; } .company-details-modal__hero { align-items:flex-start; flex-direction:column; } .company-details-modal__grid { grid-template-columns:1fr; } .company-details-modal__grid-wide { grid-column:auto; } .company-modal-actions, .company-details-modal__actions { flex-wrap:wrap; } }
@media (prefers-reduced-motion: reduce) { .company-table__row { transition:none; } }
</style>
