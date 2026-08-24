<template>
    <PanelPageHeader title="شرکت‌ها" subtitle="شرکت‌ها و وضعیت فعالیت تأمین‌کنندگان را مدیریت کنید" icon="i-lucide-building-2">
      <template #actions><UButton v-if="canCreate" icon="i-lucide-plus" @click="openModal()">افزودن شرکت</UButton></template>
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

      <div class="premium-card border border-gray-100">
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
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-600">
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  لوگو
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  نام
                </th>
                <th
                  v-if="canRead"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  ایمیل
                </th>
                <th
                  v-if="canRead"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  تلفن
                </th>
                <th
                  v-if="canRead"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  شماره ثبت
                </th>
                <th
                  v-if="canRead"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  آدرس
                </th>
                <th
                  v-if="canRead"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  وضعیت
                </th>
                <th
                  v-if="canRead"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100 w-40">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr
                v-for="(company, idx) in companies"
                :key="company._id || idx"
                class="hover:bg-gray-50 border-b border-gray-100">
                <td class="px-4 py-3">
                  <img
                    v-if="company.image"
                    :src="company.image"
                    class="w-12 h-12 rounded-full object-cover" />
                  <div v-else class="w-12 h-12 rounded-full bg-gray-200"></div>
                </td>
                <td class="px-4 py-3 font-medium text-gray-800">
                  {{ company.name }}
                </td>
                <td
                  class="px-4 py-3 text-gray-700"
                  v-if="canRead">
                  {{ company.email }}
                </td>
                <td
                  class="px-4 py-3 text-gray-700"
                  v-if="canRead">
                  {{ company.phone }}
                </td>
                <td
                  class="px-4 py-3 text-gray-700"
                  v-if="canRead">
                  {{ company.registrationNumber }}
                </td>
                <td
                  class="px-4 py-3 text-gray-700 truncate max-w-[150px]"
                  v-if="canRead">
                  {{ company.address || "—" }}
                </td>
                <td class="px-4 py-3" v-if="canRead">
                  <!-- Status badge + inline select for quick status change -->
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-1 rounded text-white text-xs"
                      :class="
                        company.status === 'active' || company.isActive
                          ? 'bg-green-500'
                          : company.status === 'pending'
                          ? 'bg-yellow-500'
                          : company.status === 'suspended'
                          ? 'bg-gray-500'
                          : 'bg-red-500'
                      ">
                      {{
                        company.status
                          ? company.status === "active"
                            ? "فعال"
                            : company.status === "pending"
                            ? "در انتظار"
                            : company.status === "rejected"
                            ? "رد شده"
                            : company.status === "suspended"
                            ? "معلق"
                            : "نامشخص"
                          : "نامشخص"
                      }}
                    </span>

                    <USelect
                      v-if="canUpdate"
                      :model-value="statusDraft[company._id || ''] ?? getCompanyStatus(company)"
                      :open="statusOpen[company._id || ''] ?? false"
                      :disabled="Boolean(statusLoading[company._id || ''])"
                      size="xs"
                      :items="statusOptions"
                      @update:open="(open) => setStatusOpen(company, open)"
                      @update:model-value="(value) => onChangeStatus(value, company)" />
                  </div>
                </td>
                <td class="px-4 py-3" @click.stop>
                  <div class="flex items-center gap-2">
                    <UButton
                      v-if="canUpdate"
                      @click="openModal(company)"
                      size="xs"
                      color="neutral"
                      variant="outline">
                      ویرایش
                    </UButton>
                    <UButton
                      v-if="canDelete"
                      @click="deleteCompany(company)"
                      size="xs"
                      color="error"
                      :loading="deletingId === company._id"
                      :disabled="Boolean(deletingId)">
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

            <UFormField label="شماره ثبت" name="registrationNumber">
              <UInput v-model="form.registrationNumber" />
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
      // فقط فیلدهای مجاز را ارسال کن
      const cleanData = {
        id: selectedId.value, // اضافه کردن id
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        registrationNumber: form.value.registrationNumber,
        address: form.value.address,
        // status: form.value.status,
        image: imageUrl,
      };
      //console.log("PATCH id:", selectedId.value); // برای دیباگ
      await updateCompany(selectedId.value, cleanData);
    } else {
      await createCompany({ ...form.value, image: imageUrl });
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
.company-upload-field { display:grid; gap:.45rem; }
.company-upload-field > label { color:var(--color-text-heading); font-size:.85rem; font-weight:700; }
.company-upload-control { display:flex; align-items:center; justify-content:space-between; gap:.75rem; min-height:2.75rem; padding:.5rem .65rem; border:1px dashed var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); color:var(--color-text-muted); }
.company-upload-field p { margin:0; color:var(--color-text-muted); font-size:.75rem; }
.company-logo-preview { width:5rem; height:5rem; border-radius:var(--radius-field); object-fit:cover; border:1px solid var(--color-border); }
@media (max-width: 640px) { .company-upload-control { align-items:stretch; flex-direction:column; } }
</style>
