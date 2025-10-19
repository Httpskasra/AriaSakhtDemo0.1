<template>
  <NuxtLayout name="dashboard">
    <!-- عنوان صفحه -->
    <div
      class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 mb-4"
      dir="rtl">
      <h1 class="text-xl font-semibold text-gray-800">کاربران</h1>
      <img src="/icons/roles.png" alt="users" class="w-8 h-8" />
    </div>

    <!-- Guard: only render content if user can read -->
    <div v-if="canRead" class="space-y-4" dir="rtl">
      <!-- Header / Controls -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex-1" />

        <div class="flex items-center gap-2">
          <label for="page-size" class="text-sm text-gray-600"
            >تعداد در صفحه</label
          >
          <select
            id="page-size"
            v-model.number="limit"
            :disabled="loading"
            @change="onChangeLimit"
            class="block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-60">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <!-- States -->
      <div
        v-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
        {{ errorMessage }}
      </div>
      <div
        v-else-if="loading"
        class="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
        در حال دریافت اطلاعات...
      </div>

      <!-- List -->
      <div
        v-if="!loading && users.length"
        class="bg-white rounded-xl shadow-sm border border-gray-100">
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
                @click="openDetails(u)"
                class="hover:bg-gray-50 cursor-pointer">
                <td class="px-4 py-3 border-b border-gray-100">
                  {{ skip + idx + 1 }}
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
                    <button
                      class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 hover:bg-gray-100 transition"
                      @click="openDetails(u)">
                      جزییات
                    </button>

                    <!-- <button
                      v-if="canUpdate"
                      class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white hover:bg-emerald-700 transition"
                      title="ویرایش (نمایشی)"
                      @click="openDetails(u)">
                      ویرایش
                    </button> -->
                    <!-- 
                    <button
                      v-if="canDelete"
                      class="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-xs text-white opacity-70 cursor-not-allowed"
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
      <div
        v-else-if="!loading && !users.length"
        class="text-center text-gray-500 border border-dashed border-gray-200 rounded-xl py-10 bg-white">
        هیچ کاربری پیدا نشد.
      </div>

      <!-- Pagination -->
      <div v-if="total > 0" class="flex items-center justify-center gap-3 pt-1">
        <button
          class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 transition disabled:opacity-50"
          :disabled="page <= 1 || loading"
          @click="goToPage(page - 1)">
          قبلی
        </button>

        <span
          class="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-4 py-2">
          صفحه {{ page }} از {{ totalPages }}
        </span>

        <button
          class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 transition disabled:opacity-50"
          :disabled="page >= totalPages || loading"
          @click="goToPage(page + 1)">
          بعدی
        </button>
      </div>
    </div>

    <!-- No access -->
    <div
      v-else
      class="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm"
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
          <div class="space-y-1">
            <label class="text-xs text-gray-500">شناسه</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
              {{ selected?.id }}
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs text-gray-500">موبایل</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
              {{
                selected?.phoneNumber || selected?.profile?.phoneNumber || "—"
              }}
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs text-gray-500">کد ملی</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
              {{ selected?.nationalId || selected?.profile?.nationalId || "—" }}
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs text-gray-500">کیف پول</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
              {{ selected?.profile?.walletId || "—" }}
            </div>
          </div>

          <div class="space-y-1 md:col-span-2">
            <label class="text-xs text-gray-500">نام و نام خانوادگی</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
              {{ fullName(selected) }}
            </div>
          </div>

          <div class="space-y-1 md:col-span-2">
            <label class="text-xs text-gray-500">آدرس</label>
            <div
              class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
              {{ selected?.profile?.address || "—" }}
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-semibold text-gray-800">مجوزها</h4>
          <div class="overflow-x-auto border border-gray-100 rounded-xl">
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
        </div>
      </div>
    </BaseModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { useNuxtApp } from "#app";
import { useAccess } from "~/composables/useAccess";
import { Action, Resource } from "~/types/permissions";
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});
// Access control
const { canRead, canUpdate, canDelete } = useAccess(Resource.USERS);
// const { canRead, canUpdate, canDelete } = {
//   canRead: true,
//   canDelete: true,
//   canUpdate: true,
// };

// State
type Permission = {
  resource: string;
  actions: string[];
  companyId?: string;
};
type UserItem = {
  id: string;
  phoneNumber?: string;
  nationalId?: string;
  permissions: Permission[];
  profile?: {
    phoneNumber?: string;
    nationalId?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    walletId?: string;
  };
};

const users = ref<UserItem[]>([]);
const total = ref(0);
const limit = ref(50);
const skip = ref(0);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const page = computed(() => Math.floor(skip.value / limit.value) + 1);
const totalPages = computed(() =>
  total.value > 0 ? Math.ceil(total.value / limit.value) : 1
);

// Modal
const showModal = ref(false);
const selected = ref<UserItem | null>(null);

// Axios
const { $axios } = useNuxtApp();

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
function fullName(u: UserItem | null) {
  if (!u) return "—";
  const f = u.profile?.firstName?.trim() || "";
  const l = u.profile?.lastName?.trim() || "";
  const name = [f, l].filter(Boolean).join(" ");
  return name || "—";
}

// API
async function fetchUsers() {
  if (!canRead) return;
  loading.value = true;
  errorMessage.value = null;

  try {
    const { data } = await $axios.get(`/users`, {
      params: {
        limit: limit.value,
        skip: skip.value,
      },
    });
    users.value = data?.items ?? [];
    total.value = data?.total ?? 0;
  } catch (err: any) {
    console.error(err);
    errorMessage.value =
      err?.response?.data?.message || "خطا در دریافت کاربران";
  } finally {
    loading.value = false;
  }
}

function goToPage(p: number) {
  const safe = Math.max(1, Math.min(p, totalPages.value));
  skip.value = (safe - 1) * limit.value;
}

function onChangeLimit() {
  skip.value = 0;
  fetchUsers();
}

function openDetails(u: UserItem) {
  selected.value = u;
  showModal.value = true;
}

// Watchers
watch([limit, skip], () => {
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
  font-family: "iran-yekan-Bold";
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
