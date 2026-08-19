<!-- pages/dashboard/roles.vue -->

<template>
  <NuxtLayout name="dashboard">
    <DashboardPageHeader title="مدیریت نقش‌ها" icon="/icons/roles.png" alt="roles" />
    <div class="container">
      <div class="header">
        <UButton v-if="canCreate" size="sm" @click="openCreateModal">
          افزودن نقش جدید
        </UButton>
      </div>
      <div v-if="canRead" class="premium-card border border-gray-100 overflow-hidden">
    <TableScrollContainer>
      <UTable :rows="roles" :columns="roleColumns" class="min-w-[34rem]">
          <template #phoneNumber-data="{ row }">
            {{ row.phoneNumber || "-" }}
          </template>
          <template #nationalId-data="{ row }">
            {{ row.nationalId || "-" }}
          </template>
          <template #permissions-data="{ row }">
            <span class="permissions-cell">
              {{ formatPermissions(row.permissions) || "-" }}
            </span>
          </template>
          <template #actions-data="{ row }">
            <div class="actions">
              <UButton
                v-if="canUpdate"
                size="xs"
                color="warning"
                variant="soft"
                @click="editRole(row)">
                ویرایش
              </UButton>
            </div>
          </template>
      </UTable>
    </TableScrollContainer>
        <SharedAsyncState
          v-if="roles.length === 0"
          state="empty"
          title="نقشی پیدا نشد"
          message="هنوز نقشی برای نمایش وجود ندارد." />
      </div>
      <div v-else class="no-access">شما به این بخش دسترسی ندارید.</div>
    </div>

    <!-- مودال ساخت/ویرایش نقش -->
    <BaseModal v-if="isModalOpen" @close="closeModal">
      <h2 class="text-xl font-bold mb-6 text-gray-800">
        {{ editMode ? "ویرایش نقش" : "ایجاد نقش جدید" }}
      </h2>
      <UForm :state="form" class="space-y-5" @submit.prevent="saveRole">
        <UFormField label="شماره موبایل" name="phoneNumber">
          <UInput v-model="form.phoneNumber" type="tel" placeholder="+989123456789" />
        </UFormField>
        <UFormField label="کد ملی" name="nationalId">
          <UInput v-model="form.nationalId" placeholder="1234567891" />
        </UFormField>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >دسترسی‌ها</label
          >
          <div class="resources-actions-list">
            <div
              v-for="resource in resourceOptions"
              :key="resource.value"
              class="resource-block">
              <div class="resource-header">
                <div class="resource-title">{{ resource.label }}</div>
                <UButton
                  type="button"
                  size="xs"
                  color="neutral"
                  variant="soft"
                  @click="toggleAll(resource.value)">
                  {{
                    allChecked(resource.value) ? "برداشتن تیک همه" : "تیک همه"
                  }}
                </UButton>
              </div>
              <div class="actions-list">
                <!-- Specialized permission toggles: native checkboxes preserve compact bulk-edit behavior. -->
                <label
                  v-for="action in actionOptions"
                  :key="action.value"
                  class="action-checkbox">
                  <input
                    type="checkbox"
                    :value="action.value"
                    :checked="isChecked(resource.value, action.value)"
                    @change="
                      togglePermission(
                        resource.value,
                        action.value,
                        ($event.target as HTMLInputElement).checked
                      )
                    " />
                  <span>{{ action.label }}</span>
                </label>
              </div>

              <!-- products-only: company selector -->
              <div v-if="resource.value === Resource.PRODUCTS" class="mt-3">
                <UFormField label="شرکت (برای محصولات)" name="companySearch">
                  <UInput
                    v-model="companySearch"
                    placeholder="جستجو شرکت..."
                    class="mb-2" />
                </UFormField>
                <div class="max-h-40 overflow-auto border rounded" role="listbox" aria-label="انتخاب شرکت">
                  <div
                    v-for="c in filteredCompanies"
                    :key="c._id || c.id"
                    class="p-2 hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    role="option"
                    :aria-selected="selectedCompanyIdForResource(resource.value) === String(c._id || c.id)"
                    tabindex="0"
                    @keydown="onCompanyKeydown($event, c, filteredCompanies)"
                    @click="
                      setCompanyForResource(
                        resource.value,
                        String(c._id || c.id)
                      )
                    ">
                    {{ c.name }}
                  </div>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                  انتخاب شده:
                  {{ selectedCompanyNameForResource(resource.value) || "هیچ" }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <UButton
            type="button"
            @click="closeModal"
            color="neutral"
            variant="soft">
            لغو
          </UButton>
          <UButton type="submit">
            ذخیره
          </UButton>
        </div>
      </UForm>
    </BaseModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { computed, ref, onMounted } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { Action, Resource, type Permission } from "~/types/permissions";
import { toInternationalPhone } from "~/utils/PhoneNumber";
import { updateUserPermissions } from "~/services/authService";
import { toUserFacingError } from "~/services/apiClient";
useHead({
  title: "داشبورد | نقش‌ها",
});
definePageMeta({
  middleware: ["auth", "permission"],
  permission: { resource: "users", action: "m" },
});
const { canCreate, canRead, canUpdate, canDelete } = useAccess(Resource.USERS);
const actionOptions = [
  { value: Action.READ, label: "خواندن" },
  { value: Action.UPDATE, label: "ویرایش" },
  { value: Action.CREATE, label: "ایجاد" },
  { value: Action.DELETE, label: "حذف" },
];

const resourceOptions = [
  { value: Resource.CATEGORIES, label: "دسته‌بندی‌ها" },
  { value: Resource.COMPANIES, label: "شرکت‌ها" },
  { value: Resource.ORDERS, label: "سفارش‌ها" },
  { value: Resource.PRODUCTS, label: "محصولات" },
  { value: Resource.ROLES, label: "نقش‌ها" },
  { value: Resource.TICKETING, label: "تیکتینگ" },
  { value: Resource.TRANSACTION, label: "تراکنش‌ها" },
  { value: Resource.TRANSPORTING, label: "حمل و نقل" },
  { value: Resource.USERS, label: "کاربران" },
  { value: Resource.WALLETS, label: "کیف پول" },
  { value: Resource.PROFILE, label: "پروفایل" },
  { value: Resource.PRODUCT_STATUS, label: "وضعیت محصول" },
];

type Role = {
  id: string;
  phoneNumber?: string;
  nationalId?: string;
  permissions: Permission[];
};
// NOTE: mock roles removed. Fetch real data from API in onMounted.
const roles = ref<Role[]>([]);
const roleColumns = computed(() => [
  { key: "phoneNumber", label: "شماره تماس" },
  { key: "nationalId", label: "کد ملی" },
  { key: "permissions", label: "دسترسی‌ها" },
  ...(canUpdate.value || canDelete.value
    ? [{ key: "actions", label: "عملیات" }]
    : []),
]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref<Role>({
  id: "",
  phoneNumber: "",
  nationalId: "",
  permissions: [],
});

// companies for products selection
const companies = ref<Array<{ id?: string; _id?: string; name: string }>>([]);
const companySearch = ref("");

const openCreateModal = () => {
  editMode.value = false;
  form.value = {
    id: "",
    phoneNumber: "",
    nationalId: "",
    permissions: resourceOptions.map((r) => ({
      resource: r.value,
      actions: [],
    })),
  };
  isModalOpen.value = true;
};

const editRole = (role: Role) => {
  editMode.value = true;
  // اطمینان از وجود همه resourceها در فرم
  const permissions: Permission[] = resourceOptions.map((r) => {
    const found: any = role.permissions.find(
      (p: any) => p.resource === r.value
    );
    return found
      ? ({
          resource: r.value,
          actions: [...found.actions],
          ...(found.companyId ? { companyId: found.companyId } : {}),
        } as any)
      : ({ resource: r.value, actions: [] } as any);
  });
  form.value = {
    id: role.id,
    phoneNumber: role.phoneNumber || "",
    nationalId: role.nationalId || "",
    permissions,
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveRole = async () => {
  if (!canCreate.value && !editMode.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
  if (!canUpdate.value && editMode.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");

  // Build permissions payload, including companyId when set on permission
  const permissionsPayload = form.value.permissions
    .filter((p) => p.actions && p.actions.length > 0)
    .map((p) => {
      // @ts-ignore
      const companyId = (p as any).companyId;
      const out: any = { resource: p.resource, actions: p.actions };
      if (companyId) out.companyId = companyId;
      return out;
    });
  const prodPerm = form.value.permissions.find(
    (p) => p.resource === Resource.PRODUCTS
  );
  // @ts-ignore
  const companyIdFromProducts = prodPerm
    ? (prodPerm as any).companyId
    : undefined;
  if (
    prodPerm &&
    prodPerm.actions &&
    prodPerm.actions.length > 0 &&
    !companyIdFromProducts
  ) {
    feedback.error("اطلاعات ناقص", "برای دسترسی محصولات، انتخاب شرکت الزامی است.");
    return;
  }
  const body: any = {
    phoneNumber: toInternationalPhone(form.value.phoneNumber || ""),
    nationalId: form.value.nationalId,
    permissions: permissionsPayload,
    ...(companyIdFromProducts ? { companyId: companyIdFromProducts } : {}),
  };

  // If any top-level companyId selected (e.g., from products permission), set it

  // @ts-ignore
  const topCompanyId = prodPerm ? (prodPerm as any).companyId : undefined;
  if (topCompanyId) body.companyId = topCompanyId;

  // optimistic local save (keep UI responsive)
  isModalOpen.value = false;
  try {
    if (editMode.value) {
      // update permissions via dedicated endpoint
      try {
        const targetId = meUserId.value || form.value.id;
        const payload: any = { permissions: permissionsPayload };
        if (companyIdFromProducts) {
          payload.companyId = companyIdFromProducts;
        }
        await updateUserPermissions(targetId, payload);

        // به‌روزرسانی UI محلی
        const idx = roles.value.findIndex((r) => r.id === form.value.id);
        if (idx !== -1) {
          roles.value[idx] = {
            ...roles.value[idx],
            phoneNumber: form.value.phoneNumber,
            nationalId: form.value.nationalId,
            permissions: form.value.permissions,
          } as Role;
        }
        feedback.success("ویرایش شد", "نقش با موفقیت ویرایش شد.");
      } catch (err) {
        console.error("failed to update permissions/profile:", err);
        throw err;
      }
    } else {
      // create user
      const { data } = await axios.post("auth/admin-signup", body);
      // try to use server id if returned
      const newId =
        data && (data._id || data.id || data.userId)
          ? data._id || data.id || data.userId
          : Date.now().toString();
      const newRole: Role = {
        id: String(newId),
        phoneNumber: form.value.phoneNumber,
        nationalId: form.value.nationalId,
        permissions: form.value.permissions,
      };
      roles.value.push(newRole);
      feedback.success("ایجاد شد", "نقش با موفقیت ایجاد شد.");
    }
  } catch (err) {
    console.error("saveRole failed:", err);
    feedback.error("ذخیره نقش انجام نشد", toUserFacingError(err).message);
  }
};

// مدیریت انتخاب اکشن‌ها برای هر resource
function isChecked(resource: Resource, action: Action) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  return perm?.actions.includes(action);
}
function togglePermission(
  resource: Resource,
  action: Action,
  checked: boolean
) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  if (!perm) return;
  if (checked) {
    if (!perm.actions.includes(action)) perm.actions.push(action);
  } else {
    perm.actions = perm.actions.filter((a) => a !== action);
  }
}
// toggle all actions for a resource
function allChecked(resource: Resource) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  if (!perm) return false;
  return actionOptions.every((a) => perm.actions.includes(a.value));
}
function toggleAll(resource: Resource) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  if (!perm) return;
  if (allChecked(resource)) {
    perm.actions = [];
  } else {
    perm.actions = actionOptions.map((a) => a.value);
  }
}
import { computed } from "vue";
const nuxtApp = useNuxtApp();
const axios = nuxtApp.$axios;
const meUserId = ref<string | null>(null);

// const { canCreate, canRead, canUpdate, canDelete } = {
//   canCreate: true,
//   canRead: true,
//   canUpdate: true,
//   canDelete: true,
// };

// note: phone/national are stored on `form` (bound to inputs) so no separate refs

const filteredCompanies = computed(() => {
  const q = companySearch.value.trim().toLowerCase();
  if (!q) return companies.value;
  return companies.value.filter((c) => c.name.toLowerCase().includes(q));
});

function setCompanyForResource(resource: Resource, companyId: string) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  if (!perm) return;
  // attach companyId to this permission
  // @ts-ignore
  (perm as any).companyId = companyId;
}

function selectedCompanyIdForResource(resource: Resource) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  return perm ? String((perm as any).companyId || "") : "";
}

function onCompanyKeydown(event: KeyboardEvent, company: any, options: any[]) {
  const index = options.indexOf(company);
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setCompanyForResource(resource.value, String(company._id || company.id));
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const next = options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length];
    (event.currentTarget as HTMLElement)?.parentElement?.querySelectorAll<HTMLElement>('[role="option"]')[options.indexOf(next)]?.focus();
  }
}

function selectedCompanyNameForResource(resource: Resource) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  // @ts-ignore
  const cid = perm ? (perm as any).companyId : undefined;
  if (!cid) return "";
  const found = companies.value.find((c) => (c._id || c.id) === cid);
  return found ? found.name : "";
}

onMounted(async () => {
  try {
    const { data } = await axios.get("/auth/me");
    const id = data?.userId || data?.id || data?._id || null;
    meUserId.value = id ? String(id) : null;
  } catch (err) {
    console.error("Failed to fetch /me:", err);
  }

  // fetch companies from /companies
  try {
    const { data } = await axios.get("/companies");
    // expect data to be array of companies
    companies.value = Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    console.error("Failed to fetch companies:", err);
  }
  // fetch users and populate roles list
  try {
    const { data } = await axios.get("/users/created-by-super");
    // response shape: { items: [...], total }
    const items = Array.isArray(data)
      ? data
      : data.items || data.data?.items || [];
    roles.value = (items || []).map((u: any) => ({
      id: String(u.id || u._id || u.userId || ""),
      phoneNumber:
        u.phoneNumber || u.phone || u.mobile || u.profile?.phoneNumber || "",
      nationalId:
        u.nationalId ||
        u.nationalID ||
        u.nationalid ||
        u.profile?.nationalId ||
        "",
      permissions: Array.isArray(u.permissions) ? u.permissions : [],
    }));
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
});

function formatPermissions(perms: Permission[] = []) {
  return perms
    .map(
      (p) =>
        `${p.resource}: ${Array.isArray(p.actions) ? p.actions.join(",") : ""}`
    )
    .join(" | ");
}
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: var(--radius-field);
  padding: 20px;
  width: 90%;
  margin: auto;
}
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}
.list table {
  width: 100%;
  border-collapse: collapse;
}
.list thead {
  background-color: var(--gray-200);
}
.list th,
.list td {
  padding: 10px;
  border-bottom: 1px solid var(--gray-300);
  text-align: right;
}
.actions {
  display: flex;
  gap: 10px;
}
.no-access {
  color: var(--gray-600);
  text-align: center;
  padding: 20px;
}
.resources-actions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
}
.resource-block {
  background: #f9f9f9;
  border-radius: var(--radius-field);
  padding: 10px 12px;
  margin-bottom: 4px;
}
.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.resource-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--blue-dark);
  margin-bottom: 6px;
}
.actions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}
.action-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  background: #f6f6f6;
  padding: 3px 8px;
  border-radius: var(--radius-compact-list-item);
}
.action-checkbox input[type="checkbox"] {
  accent-color: var(--blue-dark);
  width: 16px;
  height: 16px;
}
@media (max-width: 767px) {
  .container {
    width: 95%;
    padding: 10px;
  }
  .list table {
    font-size: 12px;
  }
}
</style>
