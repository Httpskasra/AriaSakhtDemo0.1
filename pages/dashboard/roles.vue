<!-- pages/dashboard/roles.vue -->

<template>
    <PanelPageHeader title="نقش‌ها و دسترسی‌ها" subtitle="مدیریت دسترسی کاربران بر اساس Permission واقعی" icon="i-lucide-shield-check">
      <template #actions><UButton v-if="canCreate && canRead" icon="i-lucide-plus" @click="openCreateModal">افزودن نقش جدید</UButton></template>
    </PanelPageHeader>
    <PanelPermissionGuard :allowed="canRead" :ready="isReady">
    <div class="roles-page">
      <div class="premium-card panel-table-card">
        <SharedAsyncState v-if="rolesLoading" state="loading" :skeleton-rows="5" />
        <SharedAsyncState v-else-if="rolesError" state="error" :message="rolesError" @retry="fetchRoles" />
        <SharedAsyncState v-else-if="roles.length === 0" state="empty" title="نقشی پیدا نشد" message="هنوز نقشی برای نمایش وجود ندارد." />
        <PanelDataTable v-else :rows="roles" :columns="roleColumns" min-width="52rem">
          <template #phoneNumber-data="{ row }">
            {{ row.phoneNumber || "-" }}
          </template>
          <template #nationalId-data="{ row }">
            {{ row.nationalId || "-" }}
          </template>
          <template #permissions-data="{ row }">
            <div v-if="row.permissions.length" class="permission-summary" :aria-label="`دسترسی‌های ${row.phoneNumber || row.nationalId || 'کاربر'}`">
              <article v-for="permission in row.permissions" :key="permission.resource + '-' + (permission.companyId || 'global')" class="permission-summary__item">
                <div class="permission-summary__heading">
                  <strong>{{ resourceLabel(permission.resource) }}</strong>
                  <span class="permission-summary__scope" :class="{ 'permission-summary__scope--global': !permission.companyId }">
                    {{ permission.companyId ? `شرکت: ${companyName(permission.companyId)}` : "سراسری" }}
                  </span>
                </div>
                <div class="permission-summary__actions">
                  <span v-for="action in permission.actions" :key="action">{{ actionLabel(action) }}</span>
                </div>
              </article>
            </div>
            <span v-else class="permissions-empty">بدون دسترسی اختصاصی</span>
          </template>
          <template #actions-data="{ row }">
            <div class="panel-row-actions">
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
        </PanelDataTable>
      </div>
    </div>
    </PanelPermissionGuard>

    <!-- مودال ساخت/ویرایش نقش -->
    <BaseModal v-if="isModalOpen" @close="closeModal">
      <h2 class="panel-modal-title">
        {{ editMode ? "ویرایش نقش" : "ایجاد نقش جدید" }}
      </h2>
      <UForm :state="form" class="space-y-5" @submit.prevent="saveRole">
        <UFormField label="شماره موبایل" name="phoneNumber" :error="formErrors.phoneNumber">
          <UInput v-model="form.phoneNumber" type="tel" inputmode="tel" maxlength="14" placeholder="09123456789" @update:model-value="formErrors.phoneNumber = ''" />
        </UFormField>
        <UFormField label="کد ملی" name="nationalId" :error="formErrors.nationalId">
          <UInput v-model="form.nationalId" inputmode="numeric" maxlength="10" placeholder="۱۲۳۴۵۶۷۸۹۱" @update:model-value="formErrors.nationalId = ''" />
        </UFormField>
        <div>
          <label class="roles-permissions-label"
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
                <div class="company-options" role="listbox" aria-label="انتخاب شرکت">
                  <div
                    v-for="c in filteredCompanies"
                    :key="c._id || c.id"
                    class="company-option"
                    role="option"
                    :aria-selected="selectedCompanyIdForResource(resource.value) === String(c._id || c.id)"
                    tabindex="0"
                    @keydown="onCompanyKeydown($event, resource.value, c, filteredCompanies)"
                    @click="
                      setCompanyForResource(
                        resource.value,
                        String(c._id || c.id)
                      )
                    ">
                    {{ c.name }}
                  </div>
                </div>
                <div class="selected-company">
                  انتخاب شده:
                  {{ selectedCompanyNameForResource(resource.value) || "هیچ" }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <UButton
            type="button"
            @click="closeModal"
            color="neutral"
            variant="soft"
            :disabled="saving">
            لغو
          </UButton>
          <UButton type="submit" :loading="saving" :disabled="saving">
            ذخیره
          </UButton>
        </div>
      </UForm>
    </BaseModal>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { computed, ref, onMounted, watch } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { Action, Resource, type Permission } from "~/types/permissions";
import { isValidPhone, toEnglishDigits, toInternationalPhone } from "~/utils/PhoneNumber";
import { updateUserPermissions } from "~/services/authService";
import { toUserFacingError } from "~/services/apiClient";
useHead({
  title: "داشبورد | نقش‌ها",
});
const { canCreate, canRead, canUpdate, isReady } = useAccess(Resource.ROLES);
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
const rolesLoading = ref(false);
const rolesError = ref("");
const roleColumns = computed(() => [
  { key: "phoneNumber", label: "شماره تماس" },
  { key: "nationalId", label: "کد ملی" },
  { key: "permissions", label: "دسترسی‌ها" },
  ...(canUpdate.value
    ? [{ key: "actions", label: "عملیات" }]
    : []),
]);
const isModalOpen = ref(false);
const saving = ref(false);
const editMode = ref(false);
const form = ref<Role>({
  id: "",
  phoneNumber: "",
  nationalId: "",
  permissions: [],
});
const formErrors = ref({ phoneNumber: "", nationalId: "" });

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
  formErrors.value = { phoneNumber: "", nationalId: "" };
  isModalOpen.value = true;
};

const editRole = (role: Role) => {
  editMode.value = true;
  // اطمینان از وجود همه resourceها در فرم
  const permissions: Permission[] = resourceOptions.map((r) => {
    const found = role.permissions.find((p) => p.resource === r.value);
    return found
      ? ({
          resource: r.value,
          actions: [...found.actions],
          ...(found.companyId ? { companyId: found.companyId } : {}),
        })
      : ({ resource: r.value, actions: [] });
  });
  form.value = {
    id: role.id,
    phoneNumber: role.phoneNumber || "",
    nationalId: role.nationalId || "",
    permissions,
  };
  formErrors.value = { phoneNumber: "", nationalId: "" };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveRole = async () => {
  if (saving.value) return;
  if (!canCreate.value && !editMode.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
  if (!canUpdate.value && editMode.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");

  const normalizedPhone = toInternationalPhone(form.value.phoneNumber || "");
  const normalizedNationalId = toEnglishDigits(form.value.nationalId || "").replace(/\D/g, "");
  formErrors.value = { phoneNumber: "", nationalId: "" };

  if (!editMode.value && !isValidPhone(normalizedPhone)) {
    formErrors.value.phoneNumber = "شماره موبایل معتبر ایران وارد کنید؛ مثال: ۰۹۳۶۰۴۰۸۱۷۰";
  }
  if (!editMode.value && !isValidIranNationalId(normalizedNationalId)) {
    formErrors.value.nationalId = "کد ملی باید دقیقاً ۱۰ رقم معتبر باشد.";
  }
  if (formErrors.value.phoneNumber || formErrors.value.nationalId) {
    return feedback.error("اطلاعات نامعتبر", "شماره موبایل یا کد ملی را اصلاح کنید.");
  }

  // Build the API payload from the selected permissions only.
  const permissionsPayload = form.value.permissions
    .filter((p) => p.actions && p.actions.length > 0)
    .map(({ resource, actions, companyId }) => ({
      resource,
      actions,
      ...(companyId ? { companyId } : {}),
    }));
  const prodPerm = form.value.permissions.find(
    (p) => p.resource === Resource.PRODUCTS
  );
  const companyIdFromProducts = prodPerm?.companyId;
  if (
    prodPerm &&
    prodPerm.actions &&
    prodPerm.actions.length > 0 &&
    !companyIdFromProducts
  ) {
    feedback.error("اطلاعات ناقص", "برای دسترسی محصولات، انتخاب شرکت الزامی است.");
    return;
  }
  const body = {
    phoneNumber: normalizedPhone,
    nationalId: normalizedNationalId,
    permissions: permissionsPayload,
    ...(companyIdFromProducts ? { companyId: companyIdFromProducts } : {}),
  };

  try {
    saving.value = true;
    if (editMode.value) {
      // update permissions via dedicated endpoint
      try {
        const targetId = form.value.id || meUserId.value;
        if (!targetId) {
          feedback.error("کاربر پیدا نشد", "شناسه کاربر برای ویرایش در دسترس نیست.");
          return;
        }
        const payload = {
          permissions: permissionsPayload,
          ...(companyIdFromProducts ? { companyId: companyIdFromProducts } : {}),
        };
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
    isModalOpen.value = false;
  } catch (err) {
    console.error("saveRole failed:", err);
    feedback.error("ذخیره نقش انجام نشد", toUserFacingError(err).message);
  } finally {
    saving.value = false;
  }
};

function isValidIranNationalId(value: string): boolean {
  if (!/^\d{10}$/.test(value) || /^([0-9])\1{9}$/.test(value)) return false;
  const checkDigit = Number(value[9]);
  const weightedSum = value.slice(0, 9).split("").reduce((sum, digit, index) => sum + Number(digit) * (10 - index), 0);
  const remainder = weightedSum % 11;
  return remainder < 2 ? checkDigit === remainder : checkDigit === 11 - remainder;
}

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
const nuxtApp = useNuxtApp();
const axios = nuxtApp.$axios;
const meUserId = ref<string | null>(null);

const filteredCompanies = computed(() => {
  const q = companySearch.value.trim().toLowerCase();
  if (!q) return companies.value;
  return companies.value.filter((c) => c.name.toLowerCase().includes(q));
});

function setCompanyForResource(resource: Resource, companyId: string) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  if (!perm) return;
  perm.companyId = companyId;
}

function selectedCompanyIdForResource(resource: Resource) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  return perm ? String(perm.companyId || "") : "";
}

function onCompanyKeydown(event: KeyboardEvent, resource: Resource, company: { id?: string; _id?: string; name: string }, options: Array<{ id?: string; _id?: string; name: string }>) {
  const index = options.indexOf(company);
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setCompanyForResource(resource, String(company._id || company.id));
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const next = options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length];
    (event.currentTarget as HTMLElement)?.parentElement?.querySelectorAll<HTMLElement>('[role="option"]')[options.indexOf(next)]?.focus();
  }
}

function selectedCompanyNameForResource(resource: Resource) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  const cid = perm?.companyId;
  if (!cid) return "";
  const found = companies.value.find((c) => (c._id || c.id) === cid);
  return found ? found.name : "";
}

async function fetchRoles() {
  if (!canRead.value) return;
  rolesLoading.value = true;
  rolesError.value = "";
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
    console.error("Failed to fetch roles:", err);
    rolesError.value = toUserFacingError(err).message;
  } finally {
    rolesLoading.value = false;
  }
}

async function initializeRoles() {
  if (!isReady.value || !canRead.value) return;
  try {
    const { data } = await axios.get("/auth/me");
    const id = data?.userId || data?.id || data?._id || null;
    meUserId.value = id ? String(id) : null;
  } catch (err) {
    console.error("Failed to fetch /me:", err);
  }

  if (canCreate.value || canUpdate.value) {
    try {
      const { data } = await axios.get("/companies");
      companies.value = Array.isArray(data) ? data : data.data || [];
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  }

  await fetchRoles();
}

onMounted(initializeRoles);
watch(isReady, (ready) => { if (ready) initializeRoles(); }, { once: true });

const RESOURCE_LABELS: Record<string, string> = {
  carts: "سبد خرید",
  categories: "دسته‌بندی‌ها",
  companies: "شرکت‌ها",
  orders: "سفارش‌ها",
  payment: "پرداخت",
  products: "محصولات",
  roles: "نقش‌ها",
  ticketing: "تیکتینگ",
  transaction: "تراکنش‌ها",
  transporting: "حمل‌ونقل",
  users: "کاربران",
  wallets: "کیف‌پول",
  profile: "پروفایل",
  product_status: "وضعیت محصول",
  ratings: "امتیازها",
  all: "همه منابع",
};

const ACTION_LABELS: Record<string, string> = {
  r: "خواندن",
  u: "ویرایش",
  c: "ایجاد",
  d: "حذف",
  m: "مدیریت",
  dr: "جزئیات",
  dc: "واریز شرکت",
  di: "واریز واسطه",
  du: "واریز کاربر",
};

function resourceLabel(resource: string) {
  return RESOURCE_LABELS[resource] || resource;
}

function actionLabel(action: string) {
  return ACTION_LABELS[action] || action;
}

function companyName(companyId: string) {
  return companies.value.find((company) => String(company.id || company._id) === String(companyId))?.name || "شرکت انتخاب‌شده";
}
</script>

<style scoped>
.roles-page {
  display: grid;
  gap: 1rem;
  width: min(100%, 90rem);
  margin-inline: auto;
}

.permission-summary { display:grid; grid-template-columns:repeat(2,minmax(12rem,1fr)); gap:.55rem; min-width:34rem; }
.permission-summary__item { display:grid; gap:.45rem; min-width:0; padding:.65rem .7rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); }
.permission-summary__heading { display:flex; align-items:flex-start; justify-content:space-between; gap:.5rem; min-width:0; }
.permission-summary__heading strong { overflow:hidden; color:var(--color-text-heading); font-size:.77rem; font-weight: var(--font-weight-extrabold); text-overflow:ellipsis; white-space:nowrap; }
.permission-summary__scope { max-width:9rem; overflow:hidden; color:var(--color-brand-blue); font-size:.65rem; text-overflow:ellipsis; white-space:nowrap; }
.permission-summary__scope--global { color:var(--color-text-muted); }
.permission-summary__actions { display:flex; flex-wrap:wrap; gap:.3rem; }
.permission-summary__actions span { padding:.18rem .38rem; border-radius:var(--radius-pill); background:var(--color-bg-surface); color:var(--color-text-body); font-size:.64rem; white-space:nowrap; }
.permissions-empty { color:var(--color-text-muted); font-size:.78rem; }

.resources-actions-list {
  display: grid;
  gap: 1rem;
  margin-top: .5rem;
}

.resource-block {
  display: grid;
  gap: .75rem;
  padding: 1rem;
  background: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
}

.resource-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
}

.resource-title {
  color: var(--color-text-heading);
  font-size: .9rem;
  font-weight: var(--font-weight-extrabold);
}

.roles-permissions-label { display: block; margin-bottom: .35rem; color: var(--color-text-heading); font-size: .875rem; font-weight: var(--font-weight-bold); }
.company-options { max-height: 10rem; overflow: auto; border: 1px solid var(--color-border); border-radius: var(--radius-field); }
.company-option { padding: .5rem .65rem; color: var(--color-text-body); cursor: pointer; }
.company-option:hover, .company-option:focus-visible { color: var(--color-text-heading); background: var(--color-bg-light); outline: none; }
.company-option:focus-visible { box-shadow: var(--focus-ring); }
.selected-company { margin-top: .5rem; color: var(--color-text-muted); font-size: .8rem; }

.actions-list {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.action-checkbox {
  display: inline-flex;
  min-height: 2.25rem;
  align-items: center;
  gap: .4rem;
  padding: .35rem .65rem;
  color: var(--color-text-body);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-compact-list-item);
  font-size: .8rem;
}

.action-checkbox:has(input:checked) {
  color: var(--color-info-fg);
  background: var(--color-info-bg);
  border-color: var(--color-brand-blue);
}

.action-checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-brand-blue);
}
@media (max-width:760px) {
  .permission-summary { grid-template-columns:1fr; min-width:18rem; }
}
</style>
