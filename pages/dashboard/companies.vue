<template>
    <DashboardPageHeader title="شرکت‌ها" icon="/icons/company.png" />

    <div class="space-y-4" dir="rtl">
      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-field py-2">
        <div class="flex items-center gap-2">
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
        <UButton
          v-if="canCreate"
          @click="openModal()">
          + افزودن
        </UButton>
      </div>

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
                  v-if="canCreate && canUpdate"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  ایمیل
                </th>
                <th
                  v-if="canCreate && canUpdate"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  تلفن
                </th>
                <th
                  v-if="canCreate && canUpdate"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  شماره ثبت
                </th>
                <th
                  v-if="canCreate && canUpdate"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  آدرس
                </th>
                <th
                  v-if="canCreate && canUpdate"
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  وضعیت
                </th>
                <th
                  v-if="canCreate && canUpdate"
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
                  v-if="canCreate && canUpdate">
                  {{ company.email }}
                </td>
                <td
                  class="px-4 py-3 text-gray-700"
                  v-if="canCreate && canUpdate">
                  {{ company.phone }}
                </td>
                <td
                  class="px-4 py-3 text-gray-700"
                  v-if="canCreate && canUpdate">
                  {{ company.registrationNumber }}
                </td>
                <td
                  class="px-4 py-3 text-gray-700 truncate max-w-[150px]"
                  v-if="canCreate && canUpdate">
                  {{ company.address || "—" }}
                </td>
                <td class="px-4 py-3" v-if="canCreate && canUpdate">
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
                      :disabled="statusLoading[company._id || '']"
                      size="xs"
                      :model-value="
                        company.status ??
                        (company.isActive ? 'active' : 'suspended')
                      "
                      :items="[
                        { label: 'فعال', value: 'active' },
                        { label: 'معلق', value: 'suspended' },
                        { label: 'در انتظار', value: 'pending' },
                        { label: 'رد شده', value: 'rejected' }
                      ]"
                      @update:model-value="(value) => onChangeStatus({ target: { value } } as unknown as Event, company)" />
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

            <div>
              <label class="block text-sm font-medium mb-1">لوگو</label>
              <!-- Specialized upload control: native file input is required for image preview FileReader flow. -->
              <input type="file" @change="onFileChange" />
              <img
                v-if="form.image"
                :src="form.image"
                class="w-20 h-20 mt-2 rounded-full object-cover" />
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
import { ref, computed, onMounted, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { toUserFacingError } from "~/services/apiClient";
import type { Company } from "~/types/company";
import { listCompanies, updateCompany, createCompany, deleteCompany as removeCompany, changeCompanyStatus } from "~/services/companyService";
useHead({
  title: "داشبورد | شرکت‌ها",
});
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "permission"],
  permission: { resource: "companies", action: "r" },
});

// // دسترسی‌ها
const { canCreate, canRead, canUpdate, canDelete } = useAccess(
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
const saving = ref(false);
const deletingId = ref<string | null>(null);

/**
 * Handle inline status change. Sends PATCH to /companies/:id/status
 * body: { status: 'pending' | 'active' | 'inactive' }
 */
/**
 * Handle inline status change. Sends PATCH to /companies/:id/status
 * body: { status: 'pending' | 'active' | 'suspended' | 'rejected' }
 */
async function onChangeStatus(e: Event, company: Company) {
  if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
  const select = e.target as HTMLSelectElement;
  const newStatus = select.value as
    | "active"
    | "suspended"
    | "pending"
    | "rejected";
  if (!company._id) {
    return feedback.error("شناسه نامعتبر", "شناسه شرکت موجود نیست.");
  }
  // optional confirmation for destructive changes
  if (!confirm("آیا از تغییر وضعیت این شرکت مطمئن هستید؟")) {
    // rollback select to previous value
    select.value = company.status ?? (company.isActive ? "active" : "inactive");
    return;
  }

  try {
    statusLoading.value[company._id] = true;
    await changeCompanyStatus(company._id, newStatus);
    // update local object to reflect new status (optimistic)
    company.status = newStatus;
  } catch (err) {
    console.error("خطا در تغییر وضعیت:", err);
    feedback.error("تغییر وضعیت انجام نشد", toUserFacingError(err).message);
    // rollback select
    select.value = company.status ?? (company.isActive ? "active" : "inactive");
  } finally {
    if (company._id) statusLoading.value[company._id] = false;
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
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      form.value.image = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
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
        image: form.value.image,
      };
      //console.log("PATCH id:", selectedId.value); // برای دیباگ
      await updateCompany(selectedId.value, cleanData);
    } else {
      await createCompany(form.value);
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

onMounted(() => {
  fetchCompanies();
});
</script>

<style scoped>
.container {
  width: 90%;
  margin: auto;
}
.title {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}
.title img {
  width: 50px;
  height: 50px;
}
</style>
