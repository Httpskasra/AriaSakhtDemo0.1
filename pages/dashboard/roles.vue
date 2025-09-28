<!-- pages/dashboard/roles.vue -->

<template>
  <NuxtLayout name="dashboard">
    <div class="title">
      <h1>مدیریت نقش‌ها</h1>
      <img src="/icons/roles.png" alt="roles" />
    </div>
    <div class="container">
      <div class="header">
        <button v-if="canCreate" class="create-btn" @click="openCreateModal">
          افزودن نقش جدید
        </button>
      </div>
      <div v-if="canRead" class="list">
        <table>
          <thead>
            <tr>
              <th>نام نقش</th>
              <th>توضیحات</th>
              <th v-if="canUpdate || canDelete">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id">
              <td v-if="canUpdate || canDelete" class="actions">
                <button v-if="canUpdate" class="edit" @click="editRole(role)">
                  ویرایش
                </button>
                <button
                  v-if="canDelete"
                  class="delete"
                  @click="deleteRole(role.id)">
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-access">شما به این بخش دسترسی ندارید.</div>
    </div>

    <!-- مودال ساخت/ویرایش نقش -->
    <BaseModal v-if="isModalOpen" @close="closeModal">
      <h2 class="text-xl font-bold mb-6 text-gray-800">
        {{ editMode ? "ویرایش نقش" : "ایجاد نقش جدید" }}
      </h2>
      <form class="space-y-5" @submit.prevent="saveRole">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >شماره موبایل</label
          >
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="+989123456789"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >کد ملی</label
          >
          <input
            v-model="nationalId"
            type="text"
            placeholder="2284280072"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >دسترسی‌ها</label
          >
          <div class="resources-actions-list">
            <div
              v-for="resource in resourceOptions"
              :key="resource.value"
              class="resource-block">
              <div class="resource-title">{{ resource.label }}</div>
              <div class="actions-list">
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
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >شرکت (برای محصولات)</label
                >
                <input
                  v-model="companySearch"
                  placeholder="جستجو شرکت..."
                  class="w-full rounded-lg border-gray-300 shadow-sm px-3 py-2 mb-2" />
                <div class="max-h-40 overflow-auto border rounded">
                  <div
                    v-for="c in filteredCompanies"
                    :key="c._id || c.id"
                    class="p-2 hover:bg-gray-100 cursor-pointer"
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
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
            لغو
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition">
            ذخیره
          </button>
        </div>
      </form>
    </BaseModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { Action, Resource, type Permission } from "~/types/permissions";
// import dashboardAuth from "~/middleware/dashboard-auth";
// definePageMeta({
//   middleware: dashboardAuth,
// });
// داده mock برای تست سریع
const actionOptions = [
  { value: Action.READ, label: "خواندن" },
  { value: Action.UPDATE, label: "ویرایش" },
  { value: Action.CREATE, label: "ایجاد" },
  { value: Action.DELETE, label: "حذف" },
];

const resourceOptions = [
  { value: Resource.CARTS, label: "سبد خرید" },
  { value: Resource.CATEGORIES, label: "دسته‌بندی‌ها" },
  { value: Resource.COMPANIES, label: "شرکت‌ها" },
  { value: Resource.ORDERS, label: "سفارش‌ها" },
  { value: Resource.PAYMENT, label: "پرداخت" },
  { value: Resource.PRODUCTS, label: "محصولات" },
  { value: Resource.ROLES, label: "نقش‌ها" },
  { value: Resource.TICKETING, label: "تیکتینگ" },
  { value: Resource.TRANSACTION, label: "تراکنش‌ها" },
  { value: Resource.TRANSPORTING, label: "حمل و نقل" },
  { value: Resource.USERS, label: "کاربران" },
  { value: Resource.WALLETS, label: "کیف پول" },
  { value: Resource.PROFILE, label: "پروفایل" },

];

type Role = {
  id: string;
  permissions: Permission[];
};
// NOTE: mock roles removed. Fetch real data from API in onMounted.
const roles = ref<Role[]>([]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref<Role>({
  id: "",
  permissions: [],
});

// companies for products selection
const companies = ref<Array<{ id?: string; _id?: string; name: string }>>([]);
const companySearch = ref("");

const openCreateModal = () => {
  editMode.value = false;
  form.value = {
    id: "",
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
    const found = role.permissions.find((p) => p.resource === r.value);
    return found
      ? { resource: r.value, actions: [...found.actions] }
      : { resource: r.value, actions: [] };
  });
  form.value = {
    id: role.id,
    permissions,
  };
  isModalOpen.value = true;
};

const deleteRole = (id: string) => {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!confirm("آیا از حذف این نقش مطمئن هستید؟")) return;
  // optimistic local delete (replace with API call)
  roles.value = roles.value.filter((r) => r.id !== id);
  // اگر API داشتی اینجا اضافه کن
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveRole = async () => {
  if (!canCreate && !editMode.value) return alert("شما اجازه ایجاد ندارید!");
  if (!canUpdate && editMode.value) return alert("شما اجازه ویرایش ندارید!");

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

  const body: any = {
    phoneNumber: phoneNumber.value,
    nationalId: nationalId.value,
    permissions: permissionsPayload,
  };

  // If any top-level companyId selected (e.g., from products permission), set it
  const prodPerm = form.value.permissions.find(
    (p) => p.resource === Resource.PRODUCTS
  );
  // @ts-ignore
  const topCompanyId = prodPerm ? (prodPerm as any).companyId : undefined;
  if (topCompanyId) body.companyId = topCompanyId;

  // optimistic local save (keep UI responsive)
  if (editMode.value) {
    const idx = roles.value.findIndex((r) => r.id === form.value.id);
    if (idx !== -1) roles.value[idx] = { ...form.value };
  } else {
    form.value.id = Date.now().toString();
    roles.value.push({ ...form.value });
  }
  isModalOpen.value = false;

  // send to API
  try {
    await axios.post("auth/admin-signup", body);
    alert("ارسال با موفقیت انجام شد");
  } catch (err) {
    console.error("admin-signup failed:", err);
    alert("خطا در ارسال به سرور");
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

import { useAccess } from "~/composables/useAccess";
import { computed } from "vue";
const nuxtApp = useNuxtApp();
const axios = nuxtApp.$axios as any;

// const { canCreate, canRead, canUpdate, canDelete } = useAccess(Resource.ROLES);
const { canCreate, canRead, canUpdate, canDelete } = {
  canCreate: true,
  canRead: true,
  canUpdate: true,
  canDelete: true,
};

// phone + national inputs
const phoneNumber = ref("");
const nationalId = ref("");

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

function selectedCompanyNameForResource(resource: Resource) {
  const perm = form.value.permissions.find((p) => p.resource === resource);
  // @ts-ignore
  const cid = perm ? (perm as any).companyId : undefined;
  if (!cid) return "";
  const found = companies.value.find((c) => (c._id || c.id) === cid);
  return found ? found.name : "";
}

onMounted(async () => {
  // fetch companies from /companies
  try {
    const { data } = await axios.get("/companies");
    // expect data to be array of companies
    companies.value = Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    console.error("Failed to fetch companies:", err);
  }

  // TODO: fetch roles from API here and populate `roles`.
});
</script>

<style scoped>
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 15px;
}
.title h1 {
  font-size: 30px;
}
.title img {
  width: 66px;
  height: 66px;
}
.container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  margin: auto;
}
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
}
.create-btn {
  background-color: var(--blue-dark);
  color: #fff;
  padding: 8px 20px;
  border-radius: 8px;
  font-family: "iran-yekan-Bold";
  font-size: 10px;
}
.create-btn:hover {
  opacity: 0.85;
  cursor: pointer;
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
.edit {
  background-color: var(--yellow-warning);
  color: var(--blue-dark);
  padding: 4px 10px;
  border-radius: 6px;
}
.delete {
  background-color: #f87171;
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
}
.no-access {
  color: var(--gray-600);
  text-align: center;
  padding: 20px;
}
.resources-actions-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
}
.resource-block {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 4px;
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
  border-radius: 6px;
}
.action-checkbox input[type="checkbox"] {
  accent-color: var(--blue-dark);
  width: 16px;
  height: 16px;
}
@media (max-width: 767px) {
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
  .container {
    width: 95%;
    padding: 10px;
  }
  .list table {
    font-size: 12px;
  }
}
</style>
