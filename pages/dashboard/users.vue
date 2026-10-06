<template>
    <PanelPageHeader title="کاربران" subtitle="مشاهده کاربران و بررسی سطح دسترسی آن‌ها" icon="i-lucide-users">
      <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی کاربران" @click="fetchUsers">به‌روزرسانی</UButton></template>
    </PanelPageHeader>

    <!-- Guard: only render content if user can read -->
    <div v-if="canRead" class="space-y-4" dir="rtl">
      <!-- Header / Controls -->
      <PanelFilterBar>
        <div class="filter-group">
          <TableFilterInput
            v-model="filter"
            placeholder="جستجوی کاربر..."
            @submit="applyUserFilters" />
          <AppSelect
            v-model="sort"
            :items="[
              { label: 'جدیدترین', value: 'createdAt:desc' },
              { label: 'قدیمی‌ترین', value: 'createdAt:asc' }
            ]" />
        </div>

        <div class="filter-group">
          <label for="page-size" class="text-sm text-gray-600"
            >تعداد در صفحه</label
          >
          <AppSelect
            id="page-size"
            v-model="limit"
            :disabled="loading"
            @change="onChangeLimit"
            :items="[
              { label: '10', value: 10 },
              { label: '25', value: 25 },
              { label: '50', value: 50 },
              { label: '100', value: 100 }
            ]" />
        </div>
        <UButton v-if="filter" variant="ghost" color="neutral" icon="i-lucide-x" @click="filter = ''">حذف جستجو</UButton>
      </PanelFilterBar>

      <!-- States -->
      <SharedAsyncState v-if="errorMessage" state="error" :message="errorMessage" @retry="fetchUsers" />
      <SharedAsyncState v-else-if="loading" state="loading" />

      <!-- List -->
      <div
        v-if="!loading && users.length"
        class="premium-card panel-table-card users-table-card">
        <div class="overflow-x-auto">
          <table class="users-table">
            <caption class="sr-only">فهرست کاربران و سطح دسترسی آن‌ها</caption>
            <thead>
              <tr class="bg-gray-50 text-gray-600">
                <th
                  scope="col">
                  #
                </th>
                <th
                  scope="col">
                  کاربر
                </th>
                <th
                  scope="col">
                  کد ملی
                </th>
                <th
                  scope="col">
                  تعداد مجوزها
                </th>
                <th
                  scope="col"
                  class="users-table__operations-heading">
                  اقدامات
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr
                v-for="(u, idx) in users"
                :key="u.id"
                class="users-table__row">
                <td class="users-table__index font-num">
                  {{ (page - 1) * limit + idx + 1 }}
                </td>
                <td class="users-table__identity-cell">
                  <div class="user-identity">
                    <span class="user-avatar" aria-hidden="true"><UIcon name="i-lucide-user-round" /></span>
                    <span class="user-identity__copy">
                      <strong>{{ fullName(u) === "—" ? "کاربر بدون نام" : fullName(u) }}</strong>
                      <small class="font-num">{{ u.phoneNumber || u.profile?.phoneNumber || "شماره ثبت نشده" }}</small>
                    </span>
                  </div>
                </td>
                <td class="users-table__value font-num">
                  {{ u.nationalId || u.profile?.nationalId || "—" }}
                </td>
                <td class="users-table__permissions">
                  <span class="permission-count font-num">
                    {{ (u.permissions?.length ?? 0).toLocaleString("fa-IR") }} مجوز
                  </span>
                  <small v-if="u.permissions?.length" class="permission-preview">
                    {{ u.permissions.slice(0, 2).map((permission) => resourceLabel(permission.resource)).join("، ") }}<template v-if="u.permissions.length > 2"> و بیشتر</template>
                  </small>
                  <small v-else class="permission-preview">بدون مجوز اختصاصی</small>
                </td>
                <td class="users-table__operations" @click.stop>
                  <div class="panel-row-actions">
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-eye"
                      :aria-label="`مشاهده جزئیات ${fullName(u)}`"
                      @click="openDetails(u)">
                      مشاهده جزئیات
                    </UButton>
                    <UButton
                      v-if="canUpdate"
                      size="xs"
                      color="primary"
                      variant="soft"
                      icon="i-lucide-building-2"
                      :aria-label="`مدیریت دسترسی شرکتی ${fullName(u)}`"
                      @click="openCompanyAccess(u)">
                      دسترسی شرکتی
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty state -->
      <SharedAsyncState v-else-if="!loading && !users.length" state="empty" title="کاربری پیدا نشد" message="هنوز کاربری برای نمایش وجود ندارد." />

      <!-- Pagination -->
      <div v-if="total > limit" class="flex justify-center pt-1">
        <UPagination v-model="page" :total="total" :page-count="limit" :disabled="loading" />
      </div>
    </div>

    <!-- No access -->
    <div
      v-else
      class="rounded-card border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm"
      dir="rtl">
      شما دسترسی مشاهده کاربران را ندارید.
    </div>

    <!-- Details Modal -->
    <BaseModal v-if="showModal" title-id="user-details-title" @close="showModal = false">
      <div class="user-details" dir="rtl">
        <header class="user-details__hero">
          <span class="user-details__avatar" aria-hidden="true"><UIcon name="i-lucide-user-round" /></span>
          <div class="user-details__heading">
            <p class="user-details__eyebrow">اطلاعات حساب کاربری</p>
            <h2 id="user-details-title">{{ fullName(selected) === "—" ? "کاربر بدون نام" : fullName(selected) }}</h2>
            <p class="font-num">{{ selected?.phoneNumber || selected?.profile?.phoneNumber || "شماره ثبت نشده" }}</p>
          </div>
          <span class="permission-count permission-count--hero font-num">{{ (selected?.permissions?.length ?? 0).toLocaleString("fa-IR") }} مجوز</span>
        </header>

        <section class="user-details__section" aria-labelledby="user-contact-title">
          <h3 id="user-contact-title">اطلاعات تماس و شناسایی</h3>
          <dl class="user-details__grid">
            <div><dt>شماره موبایل</dt><dd class="font-num">{{ selected?.phoneNumber || selected?.profile?.phoneNumber || "—" }}</dd></div>
            <div><dt>کد ملی</dt><dd class="font-num">{{ selected?.nationalId || selected?.profile?.nationalId || "—" }}</dd></div>
            <div><dt>شناسه کاربر</dt><dd class="font-num">{{ selected?.id || "—" }}</dd></div>
            <div><dt>کیف پول</dt><dd class="font-num">{{ selected?.profile?.walletId || "—" }}</dd></div>
            <div class="user-details__grid-wide"><dt>آدرس</dt><dd>{{ selected?.profile?.address || "ثبت نشده" }}</dd></div>
          </dl>
        </section>

        <section class="user-details__section" aria-labelledby="user-permissions-title">
          <div class="user-details__section-heading">
            <h3 id="user-permissions-title">مجوزهای دسترسی</h3>
            <span class="user-details__section-count font-num">{{ (selected?.permissions?.length ?? 0).toLocaleString("fa-IR") }} مورد</span>
          </div>
          <div v-if="selected?.permissions?.length" class="user-permissions-list">
            <article v-for="permission in selected.permissions" :key="permission.resource + '-' + (permission.companyId || 'global')" class="user-permission-card">
              <div class="user-permission-card__title">
                <span>{{ resourceLabel(permission.resource) }}</span>
                <small v-if="permission.companyId">شرکت: {{ companyName(permission.companyId) }}</small>
                <small v-else>سراسری</small>
              </div>
              <div class="user-permission-card__actions">
                <span v-for="action in permission.actions" :key="action" class="permission-action">{{ actionLabel(action) }}</span>
              </div>
            </article>
          </div>
          <p v-else class="user-details__empty">برای این کاربر مجوز اختصاصی ثبت نشده است.</p>
        </section>
      </div>
    </BaseModal>

    <!-- Company access modal: company assignment and scoped permissions are intentionally separate from global roles. -->
    <BaseModal v-if="companyAccessOpen" title-id="company-access-title" :busy="companyAccessSaving" @close="closeCompanyAccess">
      <div class="company-access-modal" dir="rtl">
        <header class="company-access__hero">
          <span class="company-access__icon" aria-hidden="true"><UIcon name="i-lucide-building-2" /></span>
          <div>
            <p class="user-details__eyebrow">اتصال کاربر به شرکت</p>
            <h2 id="company-access-title">مدیریت دسترسی شرکتی</h2>
            <p>{{ fullName(companyAccessUser) === "—" ? "کاربر بدون نام" : fullName(companyAccessUser) }}</p>
          </div>
        </header>

        <SharedAsyncState v-if="companyAccessLoading" state="loading" />
        <div v-else-if="companyAccessError" class="company-access__error" role="alert">
          <UIcon name="i-lucide-alert-circle" aria-hidden="true" />
          <span>{{ companyAccessError }}</span>
          <UButton size="xs" color="neutral" variant="outline" @click="loadCompanyAccessData">تلاش دوباره</UButton>
        </div>
        <form v-else class="company-access__form" @submit.prevent="saveCompanyAccess">
          <UFormField label="شرکت" name="companyId" required>
            <AppSelect
              v-model="companyAccessForm.companyId"
              :items="companyOptions"
              value-key="value"
              label-key="label"
              placeholder="شرکت را انتخاب کنید"
              @update:model-value="syncCompanyAccessForCompany" />
          </UFormField>

          <div class="company-access__context" v-if="companyAccessForm.companyId">
            <UIcon name="i-lucide-info" aria-hidden="true" />
            <span>مجوزهای این فرم فقط برای شرکت انتخاب‌شده اعمال می‌شوند و به دسترسی‌های سراسری کاربر دست نمی‌زنند.</span>
          </div>

          <label class="company-access__admin-toggle">
            <input v-model="companyAccessForm.isCompanyAdmin" type="checkbox" />
            <span>
              <strong>مدیر شرکت باشد</strong>
              <small>مدیر شرکت بودن از نقش‌های سراسری جداست و فقط به همین شرکت مربوط می‌شود.</small>
            </span>
          </label>

          <section class="company-access__permissions" aria-labelledby="company-access-permissions-title">
            <div class="company-access__section-heading">
              <div>
                <h3 id="company-access-permissions-title">دسترسی‌های این شرکت</h3>
                <p>فقط مجوزهای لازم را انتخاب کنید.</p>
              </div>
              <span class="permission-count font-num">{{ selectedCompanyPermissionCount.toLocaleString("fa-IR") }} مورد</span>
            </div>
            <div class="company-access__permission-grid">
              <article v-for="option in companyPermissionOptions" :key="option.resource" class="company-access__permission-card">
                <div class="company-access__permission-title">
                  <strong>{{ option.label }}</strong>
                  <button type="button" class="company-access__select-all" @click="toggleCompanyResource(option.resource)">
                    {{ companyResourceFullySelected(option.resource) ? "حذف همه" : "انتخاب همه" }}
                  </button>
                </div>
                <div class="company-access__actions">
                  <label v-for="action in option.actions" :key="action" class="action-checkbox" :class="{ 'action-checkbox--selected': companyActionSelected(option.resource, action) }">
                    <input
                      type="checkbox"
                      :checked="companyActionSelected(option.resource, action)"
                      @change="toggleCompanyAction(option.resource, action, ($event.target as HTMLInputElement).checked)" />
                    <span>{{ actionLabel(action) }}</span>
                  </label>
                </div>
              </article>
            </div>
          </section>

          <div class="company-access__actions-row">
            <UButton type="button" color="neutral" variant="soft" :disabled="companyAccessSaving" @click="closeCompanyAccess">انصراف</UButton>
            <UButton type="submit" :loading="companyAccessSaving" :disabled="!companyAccessForm.companyId || companyAccessSaving">ذخیره دسترسی</UButton>
          </div>
        </form>
      </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { useAccess } from "~/composables/useAccess";
import { Action, Resource } from "~/types/permissions";
import { listUsers, type UserListItem } from "~/services/userService";
import { listCompanies } from "~/services/companyService";
import type { Company } from "~/types/company";
import { toUserFacingError } from "~/services/apiClient";
const feedback = useFeedback();
useHead({
  title: "داشبورد | کاربران",
});
// Access control
const { canRead, canUpdate, isReady } = useAccess(Resource.USERS);
// const { canRead, canUpdate, canDelete } = {
//   canRead: true,
//   canDelete: true,
//   canUpdate: true,
// };

// State
const users = ref<UserListItem[]>([]);
const total = ref(0);
const limit = ref(50);
const page = ref(1);
const sort = ref("createdAt:desc");
const filter = ref("");
const loading = ref(false);
const errorMessage = ref<string | null>(null);

// Modal
const showModal = ref(false);
const selected = ref<UserListItem | null>(null);
const companyAccessOpen = ref(false);
const companyAccessUser = ref<UserListItem | null>(null);
const companyAccessLoading = ref(false);
const companyAccessSaving = ref(false);
const companyAccessError = ref("");
const companyAccessCompanies = ref<Company[]>([]);
const companyAccessForm = ref({
  companyId: "",
  isCompanyAdmin: false,
  permissions: [] as UserListItem["permissions"],
});

const companyPermissionOptions = [
  { resource: Resource.PRODUCTS, label: "محصولات", actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE] },
  { resource: Resource.PRODUCT_STATUS, label: "وضعیت محصولات", actions: [Action.READ, Action.UPDATE] },
  { resource: Resource.COMPANIES, label: "اطلاعات شرکت", actions: [Action.READ, Action.UPDATE] },
  { resource: Resource.ORDERS, label: "سفارش‌ها", actions: [Action.READ, Action.UPDATE] },
] as const;

// Helpers for labels
const ACTION_LABELS: Record<string, string> = {
  r: "خواندن",
  u: "ویرایش",
  c: "ایجاد",
  d: "حذف",
  m: "مدیریت",
  dc: "واریز شرکت",
  di: "واریز واسطه",
  du: "واریز کاربر",
};

const RESOURCE_LABELS: Record<string, string> = {
  carts: "سبدها",
  categories: "دسته‌بندی‌ها",
  companies: "شرکت‌ها",
  orders: "سفارش‌ها",
  payment: "پرداخت",
  products: "محصولات",
  roles: "نقش‌ها",
  ticketing: "تیکتینگ",
  transaction: "تراکنش",
  transporting: "حمل‌ونقل",
  users: "کاربران",
  wallets: "کیف‌پول‌ها",
  profile: "پروفایل",
  all: "همه",
};

function actionLabel(a: string) {
  return ACTION_LABELS[a] || a;
}
function resourceLabel(r: string) {
  return RESOURCE_LABELS[r] || r;
}
function companyName(companyId: string) {
  return companyAccessCompanies.value.find((company) => String(company.id || company._id) === String(companyId))?.name || "شرکت انتخاب‌شده";
}
function fullName(u: UserListItem | null) {
  if (!u) return "—";
  const f = u.profile?.firstName?.trim() || "";
  const l = u.profile?.lastName?.trim() || "";
  const name = [f, l].filter(Boolean).join(" ");
  return name || "—";
}

// API
async function fetchUsers() {
  if (!canRead.value) return;
  loading.value = true;
  errorMessage.value = null;

  try {
    const result = await listUsers({
      page: page.value,
      limit: limit.value,
      sort: sort.value,
      filter: filter.value.trim() || undefined,
    });
    users.value = result.items;
    total.value = result.total;
  } catch (err) {
    console.error("خطا در دریافت کاربران:", err);
    errorMessage.value = toUserFacingError(err, "دریافت کاربران انجام نشد.").message;
  } finally {
    loading.value = false;
  }
}

function onChangeLimit() {
  page.value = 1;
  fetchUsers();
}

function applyUserFilters() {
  page.value = 1;
  fetchUsers();
}

function openDetails(u: UserListItem) {
  selected.value = u;
  showModal.value = true;
}

const companyOptions = computed(() => companyAccessCompanies.value.map((company) => ({
  label: company.name,
  value: String(company.id || company._id),
})));

function companyIsAdmin(company: Company, userId: string) {
  return Array.isArray(company.admins) && company.admins.some((admin) => String(admin) === String(userId));
}

function copyCompanyPermissions(user: UserListItem, companyId: string) {
  return (user.permissions || [])
    .filter((permission) => String(permission.companyId || "") === String(companyId))
    .map((permission) => ({
      resource: permission.resource,
      actions: [...permission.actions],
      companyId,
    }));
}

function syncCompanyAccessForCompany() {
  const user = companyAccessUser.value;
  const companyId = companyAccessForm.value.companyId;
  if (!user || !companyId) {
    companyAccessForm.value.permissions = [];
    companyAccessForm.value.isCompanyAdmin = false;
    return;
  }
  const company = companyAccessCompanies.value.find((item) => String(item.id || item._id) === String(companyId));
  companyAccessForm.value.permissions = copyCompanyPermissions(user, companyId);
  companyAccessForm.value.isCompanyAdmin = Boolean(company && companyIsAdmin(company, user.id));
}

async function loadCompanyAccessData() {
  const user = companyAccessUser.value;
  if (!user) return;
  companyAccessLoading.value = true;
  companyAccessError.value = "";
  try {
    const result = await listCompanies({ managed: true, limit: 100, page: 1, sort: "name:asc" });
    companyAccessCompanies.value = result.items || [];
    const existingCompanyId = user.permissions?.find((permission) => permission.companyId)?.companyId || user.profile?.companyId;
    companyAccessForm.value.companyId = existingCompanyId || String(companyAccessCompanies.value[0]?.id || companyAccessCompanies.value[0]?._id || "");
    syncCompanyAccessForCompany();
  } catch (err) {
    companyAccessError.value = toUserFacingError(err, "فهرست شرکت‌ها دریافت نشد.").message;
  } finally {
    companyAccessLoading.value = false;
  }
}

async function openCompanyAccess(user: UserListItem) {
  companyAccessUser.value = user;
  companyAccessForm.value = { companyId: "", isCompanyAdmin: false, permissions: [] };
  companyAccessOpen.value = true;
  await loadCompanyAccessData();
}

function closeCompanyAccess() {
  if (companyAccessSaving.value) return;
  companyAccessOpen.value = false;
  companyAccessUser.value = null;
}

function findCompanyPermission(resource: string) {
  return companyAccessForm.value.permissions.find((permission) => permission.resource === resource);
}

function companyActionSelected(resource: string, action: string) {
  return Boolean(findCompanyPermission(resource)?.actions.includes(action));
}

function toggleCompanyAction(resource: string, action: string, checked: boolean) {
  let permission = findCompanyPermission(resource);
  if (!permission && checked) {
    permission = { resource, actions: [], companyId: companyAccessForm.value.companyId };
    companyAccessForm.value.permissions.push(permission);
  }
  if (!permission) return;
  permission.actions = checked
    ? Array.from(new Set([...permission.actions, action]))
    : permission.actions.filter((item) => item !== action);
  if (!permission.actions.length) {
    companyAccessForm.value.permissions = companyAccessForm.value.permissions.filter((item) => item !== permission);
  }
}

function companyResourceFullySelected(resource: string) {
  const option = companyPermissionOptions.find((item) => item.resource === resource);
  return Boolean(option && option.actions.every((action) => companyActionSelected(resource, action)));
}

function toggleCompanyResource(resource: string) {
  const option = companyPermissionOptions.find((item) => item.resource === resource);
  if (!option) return;
  const checked = companyResourceFullySelected(resource);
  option.actions.forEach((action) => toggleCompanyAction(resource, action, !checked));
}

const selectedCompanyPermissionCount = computed(() => companyAccessForm.value.permissions.reduce((total, permission) => total + permission.actions.length, 0));

async function saveCompanyAccess() {
  const user = companyAccessUser.value;
  const companyId = companyAccessForm.value.companyId;
  if (!user || !companyId || companyAccessSaving.value) return;
  companyAccessSaving.value = true;
  try {
    const { $axios } = useNuxtApp();
    const permissions = companyAccessForm.value.permissions
      .filter((permission) => permission.actions.length)
      .map(({ resource, actions }) => ({ resource, actions }));
    const { data } = await $axios.patch(`/users/${encodeURIComponent(user.id)}/company-access`, {
      companyId,
      isCompanyAdmin: companyAccessForm.value.isCompanyAdmin,
      permissions,
    });

    const index = users.value.findIndex((item) => item.id === user.id);
    if (index !== -1) users.value[index] = { ...users.value[index], permissions: data?.permissions || users.value[index].permissions };
    const company = companyAccessCompanies.value.find((item) => String(item.id || item._id) === String(companyId));
    if (company) {
      const admins = Array.isArray(company.admins) ? company.admins.filter((admin) => String(admin) !== String(user.id)) : [];
      if (companyAccessForm.value.isCompanyAdmin) admins.push(user.id);
      company.admins = admins;
    }
    feedback.success("دسترسی ذخیره شد", "اتصال کاربر به شرکت با موفقیت به‌روزرسانی شد.");
    closeCompanyAccess();
  } catch (err) {
    feedback.error("ذخیره دسترسی انجام نشد", toUserFacingError(err).message);
  } finally {
    companyAccessSaving.value = false;
  }
}

// Watchers
watch([limit, page, sort], () => {
  fetchUsers();
});

onMounted(() => { if (isReady.value) fetchUsers(); });
watch(isReady, (ready) => { if (ready) fetchUsers(); }, { once: true });
</script>

<style scoped>
.users-table-card { overflow:hidden; }
.users-table { width:100%; min-width:54rem; border-collapse:separate; border-spacing:0; font-size:.875rem; }
.users-table th, .users-table td { padding:.9rem 1rem; text-align:right; vertical-align:middle; border-bottom:1px solid var(--color-border); }
.users-table th { color:var(--color-text-muted); background:var(--color-bg-light); font-size:.78rem; font-weight:800; white-space:nowrap; }
.users-table thead th:first-child { border-start-start-radius:var(--radius-field); }
.users-table thead th:last-child { border-start-end-radius:var(--radius-field); }
.users-table tbody tr:last-child td { border-bottom:0; }
.users-table__row { transition:background-color .18s ease; }
.users-table__row:hover { background:var(--color-bg-light); }
.users-table__index { width:4rem; color:var(--color-text-muted); }
.users-table__identity-cell { min-width:17rem; }
.user-identity { display:flex; align-items:center; gap:.75rem; min-width:0; }
.user-avatar, .user-details__avatar { display:grid; place-items:center; flex:none; border:1px solid var(--color-info-border); border-radius:var(--radius-compact-list-item); background:var(--color-info-bg); color:var(--color-brand-blue); }
.user-avatar { width:2.75rem; height:2.75rem; font-size:1.15rem; }
.user-identity__copy { display:grid; gap:.2rem; min-width:0; }
.user-identity__copy strong { overflow:hidden; color:var(--color-text-heading); font-size:.88rem; font-weight:800; text-overflow:ellipsis; white-space:nowrap; }
.user-identity__copy small { color:var(--color-text-muted); font-size:.77rem; }
.users-table__value { color:var(--color-text-body); white-space:nowrap; }
.users-table__permissions { min-width:13rem; }
.permission-count { display:inline-flex; align-items:center; min-height:1.75rem; padding:.25rem .65rem; border:1px solid var(--color-info-border); border-radius:var(--radius-pill); background:var(--color-info-bg); color:var(--color-info-fg); font-size:.75rem; font-weight:800; white-space:nowrap; }
.permission-count--hero { margin-inline-start:auto; }
.permission-preview { display:block; max-width:15rem; margin-top:.35rem; overflow:hidden; color:var(--color-text-muted); font-size:.72rem; text-overflow:ellipsis; white-space:nowrap; }
.users-table__operations-heading, .users-table__operations { width:13rem; min-width:13rem; }
.users-table__operations :deep(button) { min-height:2.5rem; }
.user-details { display:grid; gap:1.25rem; width:100%; max-width:48rem; margin:0 auto; }
.user-details__hero { display:flex; align-items:center; gap:.9rem; padding:.25rem 0 1.15rem; border-bottom:1px solid var(--color-border); }
.user-details__avatar { width:3.5rem; height:3.5rem; font-size:1.45rem; }
.user-details__heading { min-width:0; }
.user-details__eyebrow { margin:0 0 .2rem; color:var(--color-brand-blue); font-size:.75rem; font-weight:800; }
.user-details__heading h2 { margin:0; overflow-wrap:anywhere; color:var(--color-text-heading); font-size:1.2rem; font-weight:800; }
.user-details__heading p:last-child { margin:.25rem 0 0; color:var(--color-text-muted); font-size:.8rem; }
.user-details__section { display:grid; gap:.7rem; }
.user-details__section h3 { margin:0; color:var(--color-text-heading); font-size:.9rem; font-weight:800; }
.user-details__section-heading { display:flex; align-items:center; justify-content:space-between; gap:.75rem; }
.user-details__section-count { color:var(--color-text-muted); font-size:.75rem; }
.user-details__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.65rem; margin:0; }
.user-details__grid > div { min-width:0; padding:.75rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); }
.user-details__grid-wide { grid-column:1/-1; }
.user-details__grid dt { color:var(--color-text-muted); font-size:.73rem; }
.user-details__grid dd { margin:.3rem 0 0; overflow-wrap:anywhere; color:var(--color-text-heading); font-size:.84rem; font-weight:700; }
.user-permissions-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.65rem; }
.user-permission-card { display:grid; gap:.65rem; min-width:0; padding:.8rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); }
.user-permission-card__title { display:flex; align-items:flex-start; justify-content:space-between; gap:.5rem; color:var(--color-text-heading); font-size:.82rem; font-weight:800; }
.user-permission-card__title small { max-width:9rem; overflow:hidden; color:var(--color-text-muted); font-size:.67rem; font-weight:500; text-overflow:ellipsis; white-space:nowrap; }
.user-permission-card__actions { display:flex; flex-wrap:wrap; gap:.35rem; }
.permission-action { padding:.2rem .45rem; border-radius:var(--radius-pill); background:var(--color-bg-surface); color:var(--color-text-body); font-size:.68rem; }
.user-details__empty { margin:0; padding:.85rem; border:1px dashed var(--color-border-strong); border-radius:var(--radius-field); color:var(--color-text-muted); font-size:.8rem; }
.users-table__operations { vertical-align:top; }
.users-table__operations .panel-row-actions { align-items:stretch; flex-direction:column; }
.company-access-modal { display:grid; gap:1.25rem; width:100%; max-width:52rem; margin:0 auto; }
.company-access__hero { display:flex; align-items:center; gap:.85rem; padding-block:.2rem 1.1rem; border-bottom:1px solid var(--color-border); }
.company-access__icon { display:grid; width:3.25rem; height:3.25rem; flex:none; place-items:center; border:1px solid var(--color-info-border); border-radius:var(--radius-compact-list-item); background:var(--color-info-bg); color:var(--color-brand-blue); font-size:1.35rem; }
.company-access__hero h2 { margin:0; color:var(--color-text-heading); font-size:1.15rem; font-weight:800; }
.company-access__hero p:last-child { margin:.25rem 0 0; color:var(--color-text-muted); font-size:.8rem; }
.company-access__form { display:grid; gap:1rem; }
.company-access__context { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem .85rem; border:1px solid var(--color-info-border); border-radius:var(--radius-field); background:var(--color-info-bg); color:var(--color-info-fg); font-size:.78rem; line-height:1.8; }
.company-access__admin-toggle { display:flex; align-items:flex-start; gap:.65rem; padding:.85rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); cursor:pointer; }
.company-access__admin-toggle input { width:1.1rem; height:1.1rem; margin-top:.15rem; accent-color:var(--color-brand-blue); }
.company-access__admin-toggle span { display:grid; gap:.2rem; }
.company-access__admin-toggle strong { color:var(--color-text-heading); font-size:.84rem; }
.company-access__admin-toggle small { color:var(--color-text-muted); font-size:.73rem; line-height:1.7; }
.company-access__permissions { display:grid; gap:.7rem; }
.company-access__section-heading { display:flex; align-items:center; justify-content:space-between; gap:.75rem; }
.company-access__section-heading h3 { margin:0; color:var(--color-text-heading); font-size:.92rem; font-weight:800; }
.company-access__section-heading p { margin:.25rem 0 0; color:var(--color-text-muted); font-size:.74rem; }
.company-access__permission-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.65rem; }
.company-access__permission-card { display:grid; gap:.65rem; min-width:0; padding:.8rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); }
.company-access__permission-title { display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
.company-access__permission-title strong { color:var(--color-text-heading); font-size:.82rem; }
.company-access__select-all { padding:0; border:0; background:transparent; color:var(--color-brand-blue); font:inherit; font-size:.7rem; cursor:pointer; }
.company-access__select-all:focus-visible { outline:2px solid var(--color-brand-blue); outline-offset:3px; border-radius:.2rem; }
.company-access__actions { display:flex; flex-wrap:wrap; gap:.35rem; }
.company-access__actions .action-checkbox { min-height:2rem; padding:.25rem .5rem; font-size:.72rem; }
.company-access__error { display:flex; align-items:center; gap:.6rem; padding:.85rem; border:1px solid var(--color-danger-border); border-radius:var(--radius-field); background:var(--color-danger-bg); color:var(--color-danger-fg); font-size:.8rem; }
.company-access__error span { flex:1; }
.company-access__actions-row { display:flex; justify-content:flex-start; gap:.65rem; padding-top:.25rem; border-top:1px solid var(--color-border); }
@media (max-width:640px) {
  .user-details__hero { align-items:flex-start; flex-wrap:wrap; }
  .permission-count--hero { width:100%; margin-inline-start:0; }
  .user-details__grid, .user-permissions-list { grid-template-columns:1fr; }
  .user-details__grid-wide { grid-column:auto; }
  .company-access__permission-grid { grid-template-columns:1fr; }
  .company-access__hero { align-items:flex-start; }
}
@media (prefers-reduced-motion:reduce) { .users-table__row { transition:none; } }
</style>
