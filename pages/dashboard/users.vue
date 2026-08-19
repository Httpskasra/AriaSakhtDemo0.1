<template>
  <NuxtLayout name="dashboard">
    <!-- عنوان صفحه -->
    <div class="container" dir="rtl">
      <div class="title">
        <h1>کاربران</h1>
        <img src="/icons/roles.png" />
      </div>
    </div>

    <!-- Guard: only render content if user can read -->
    <div v-if="canRead" class="space-y-4" dir="rtl">
      <!-- Header / Controls -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <TableFilterInput
            v-model="filter"
            placeholder="جستجوی کاربر..."
            @submit="applyUserFilters" />
          <USelect
            v-model="sort"
            :items="[
              { label: 'جدیدترین', value: 'createdAt:desc' },
              { label: 'قدیمی‌ترین', value: 'createdAt:asc' }
            ]" />
        </div>

        <div class="flex items-center gap-2">
          <label for="page-size" class="text-sm text-gray-600"
            >تعداد در صفحه</label
          >
          <USelect
            id="page-size"
            v-model.number="limit"
            :disabled="loading"
            @change="onChangeLimit"
            :items="[
              { label: '10', value: 10 },
              { label: '25', value: 25 },
              { label: '50', value: 50 },
              { label: '100', value: 100 }
            ]" />
        </div>
      </div>

      <!-- States -->
      <SharedAsyncState v-if="errorMessage" state="error" :message="errorMessage" @retry="fetchUsers" />
      <SharedAsyncState v-else-if="loading" state="loading" />

      <!-- List -->
      <div
        v-if="!loading && users.length"
        class="premium-card border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-600">
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  #
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  شماره موبایل
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  کد ملی
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  تعداد مجوزها
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100 w-40">
                  اقدامات
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr
                v-for="(u, idx) in users"
                :key="u.id"
                class="hover:bg-gray-50">
                <td class="px-4 py-3 border-b border-gray-100">
                  {{ (page - 1) * limit + idx + 1 }}
                </td>
                <td class="px-4 py-3 border-b border-gray-100">
                  {{ u.phoneNumber || u.profile?.phoneNumber || "—" }}
                </td>
                <td class="px-4 py-3 border-b border-gray-100">
                  {{ u.nationalId || u.profile?.nationalId || "—" }}
                </td>
                <td class="px-4 py-3 border-b border-gray-100">
                  {{ u.permissions?.length ?? 0 }}
                </td>
                <td class="px-4 py-3 border-b border-gray-100" @click.stop>
                  <div class="flex items-center gap-2">
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="outline"
                      @click="openDetails(u)">
                      جزییات
                    </UButton>

                    <!-- <button
                      v-if="canUpdate"
                      class="inline-flex items-center justify-center rounded-field bg-emerald-600 px-3 py-2 text-xs text-white hover:bg-emerald-700 transition"
                      title="ویرایش (نمایشی)"
                      @click="openDetails(u)">
                      ویرایش
                    </button> -->
                    <!-- 
                    <button
                      v-if="canDelete"
                      class="inline-flex items-center justify-center rounded-field bg-red-600 px-3 py-2 text-xs text-white opacity-70 cursor-not-allowed"
                      title="حذف (غیرفعال)"
                      disabled>
                      حذف
                    </button> -->
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
    <BaseModal v-if="showModal" @close="showModal = false">
      <div
        class="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-5"
        dir="rtl">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">جزییات کاربر</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- <div class="space-y-1">
            <label class="text-xs text-gray-500">شناسه</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-field px-3 py-2 text-sm text-gray-800">
              {{ selected?.id }}
            </div>
          </div> -->

          <div class="space-y-1">
            <label class="text-xs text-gray-500">موبایل</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-field px-3 py-2 text-sm text-gray-800">
              {{
                selected?.phoneNumber || selected?.profile?.phoneNumber || "—"
              }}
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs text-gray-500">کد ملی</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-field px-3 py-2 text-sm text-gray-800">
              {{ selected?.nationalId || selected?.profile?.nationalId || "—" }}
            </div>
          </div>

          <!-- <div class="space-y-1">
            <label class="text-xs text-gray-500">کیف پول</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-field px-3 py-2 text-sm text-gray-800">
              {{ selected?.profile?.walletId || "—" }}
            </div>
          </div> -->

          <div class="space-y-1 md:col-span-2">
            <label class="text-xs text-gray-500">نام و نام خانوادگی</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-field px-3 py-2 text-sm text-gray-800">
              {{ fullName(selected) }}
            </div>
          </div>

          <div class="space-y-1 md:col-span-2">
            <label class="text-xs text-gray-500">آدرس</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-field px-3 py-2 text-sm text-gray-800">
              {{ selected?.profile?.address || "—" }}
            </div>
          </div>
        </div>

        <!-- <div class="space-y-3">
          <h4 class="text-sm font-semibold text-gray-800">مجوزها</h4>
          <div class="overflow-x-auto border border-gray-100 rounded-card">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-600">
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    ریسورس
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    اکشن‌ها
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    شناسه شرکت (در صورت محصول)
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-800">
                <tr
                  v-for="(p, i) in selected?.permissions || []"
                  :key="i"
                  class="hover:bg-gray-50">
                  <td class="px-4 py-3 border-b border-gray-100">
                    {{ resourceLabel(p.resource) }}
                  </td>
                  <td class="px-4 py-3 border-b border-gray-100">
                    <span
                      v-for="(a, j) in p.actions"
                      :key="j"
                      class="inline-block rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 ml-1 mb-1">
                      {{ actionLabel(a) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 border-b border-gray-100">
                    {{ p.companyId || "—" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> -->
      </div>
    </BaseModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { listUsers, type UserListItem } from "~/services/userService";
import { toUserFacingError } from "~/services/apiClient";
useHead({
  title: "داشبورد | کاربران",
});
definePageMeta({
  middleware: ["auth", "permission"],
  permission: { resource: "users", action: "m" },
});
// Access control
const { canRead, canUpdate, canDelete } = useAccess(Resource.USERS);
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

const totalPages = computed(() =>
  total.value > 0 ? Math.ceil(total.value / limit.value) : 1
);

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

function goToPage(p: number) {
  const safe = Math.max(1, Math.min(p, totalPages.value));
  page.value = safe;
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

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* styles (همان نسخهٔ آماده در پروژه ذخیره‌شده) */
.container {
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.title {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  width: 230px;
  display: flex;
  justify-content: space-evenly;
  margin: 15px;
}
.title h1 {
  font-size: 36px;
}
.title img {
  width: 66px;
  height: 66px;
}
@media (max-width: 767px) {
  .container {
    width: 95%;
    margin: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .title {
    width: 40%;
  }
  .title h1 {
    font-size: 20px;
  }
  .title img {
    width: 40px;
    height: 40px;
  }
}
</style>
