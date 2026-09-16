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
                <small v-if="permission.companyId" class="font-num">شرکت: {{ permission.companyId }}</small>
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { listUsers, type UserListItem } from "~/services/userService";
import { toUserFacingError } from "~/services/apiClient";
useHead({
  title: "داشبورد | کاربران",
});
// Access control
const { canRead, isReady } = useAccess(Resource.USERS);
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
@media (max-width:640px) {
  .user-details__hero { align-items:flex-start; flex-wrap:wrap; }
  .permission-count--hero { width:100%; margin-inline-start:0; }
  .user-details__grid, .user-permissions-list { grid-template-columns:1fr; }
  .user-details__grid-wide { grid-column:auto; }
}
@media (prefers-reduced-motion:reduce) { .users-table__row { transition:none; } }
</style>
