<template>
  <NuxtLayout name="dashboard">
    <div class="title">
      <h1>کاربران</h1>
      <img src="/icons/roles.png" alt="users" />
    </div>

    <!-- Guard: only render content if user can read -->
    <div class="container" v-if="canRead">
      <!-- Header / Controls -->
      <div class="header">
        <!-- left side: placeholder for future search -->
        <div class="grow"></div>

        <!-- page size -->
        <div class="page-size">
          <label for="page-size">تعداد در صفحه</label>
          <select
            id="page-size"
            v-model.number="limit"
            :disabled="loading"
            @change="onChangeLimit">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <!-- States -->
      <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>
      <div v-else-if="loading" class="alert info">در حال دریافت اطلاعات...</div>

      <!-- List -->
      <div v-if="!loading && users.length" class="list">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>شماره موبایل</th>
              <th>کد ملی</th>
              <th>تعداد مجوزها</th>
              <th style="width: 160px">اقدامات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(u, idx) in users"
              :key="u.id"
              @click="openDetails(u)"
              class="row-click">
              <td>{{ skip + idx + 1 }}</td>
              <td>{{ u.phoneNumber || u.profile?.phoneNumber || "—" }}</td>
              <td>{{ u.nationalId || u.profile?.nationalId || "—" }}</td>
              <td>{{ u.permissions?.length ?? 0 }}</td>
              <td @click.stop>
                <button class="btn outline" @click="openDetails(u)">
                  جزییات
                </button>
                <button
                  v-if="canUpdate"
                  class="btn"
                  title="ویرایش (نمایشی)"
                  @click="openDetails(u)">
                  ویرایش
                </button>
                <button
                  v-if="canDelete"
                  class="btn danger"
                  title="حذف (غیرفعال)"
                  disabled>
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-else-if="!loading && !users.length" class="empty">
        هیچ کاربری پیدا نشد.
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="total > 0">
        <button
          class="btn outline"
          :disabled="page <= 1 || loading"
          @click="goToPage(page - 1)">
          قبلی
        </button>

        <span class="page-indicator">
          صفحه {{ page }} از {{ totalPages }}
        </span>

        <button
          class="btn outline"
          :disabled="page >= totalPages || loading"
          @click="goToPage(page + 1)">
          بعدی
        </button>
      </div>
    </div>

    <!-- No access -->
    <div class="no-access" v-else>شما دسترسی مشاهده کاربران را ندارید.</div>

    <!-- Details Modal -->
    <BaseModal v-if="showModal" @close="showModal = false">
      <div class="details">
        <h3>جزییات کاربر</h3>

        <div class="grid two">
          <div class="field">
            <label>شناسه</label>
            <div>{{ selected?.id }}</div>
          </div>

          <div class="field">
            <label>موبایل</label>
            <div>
              {{
                selected?.phoneNumber || selected?.profile?.phoneNumber || "—"
              }}
            </div>
          </div>

          <div class="field">
            <label>کد ملی</label>
            <div>
              {{ selected?.nationalId || selected?.profile?.nationalId || "—" }}
            </div>
          </div>

          <div class="field">
            <label>کیف پول</label>
            <div>{{ selected?.profile?.walletId || "—" }}</div>
          </div>

          <div class="field wide">
            <label>نام و نام خانوادگی</label>
            <div>{{ fullName(selected) }}</div>
          </div>

          <div class="field wide">
            <label>آدرس</label>
            <div>{{ selected?.profile?.address || "—" }}</div>
          </div>
        </div>

        <div class="perm">
          <h4>مجوزها</h4>
          <table class="perm-table">
            <thead>
              <tr>
                <th>ریسورس</th>
                <th>اکشن‌ها</th>
                <th>شناسه شرکت (در صورت محصول)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in selected?.permissions || []" :key="i">
                <td>{{ resourceLabel(p.resource) }}</td>
                <td>
                  <span class="chip" v-for="(a, j) in p.actions" :key="j">{{
                    actionLabel(a)
                  }}</span>
                </td>
                <td>{{ p.companyId || "—" }}</td>
              </tr>
            </tbody>
          </table>
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

// Access control
// const { canRead, canUpdate, canDelete } = useAccess(Resource.USERS);
const { canRead, canUpdate, canDelete } = {
  canRead: true,
  canDelete: true,
  canUpdate: true,
};

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
