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
              <td>{{ role.name }}</td>
              <td>{{ role.description }}</td>
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
            >نام نقش</label
          >
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >توضیحات</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"></textarea>
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
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});
// داده mock برای تست سریع
const actionOptions = [
  { value: Action.READ, label: "خواندن" },
  { value: Action.UPDATE, label: "ویرایش" },
  { value: Action.CREATE, label: "ایجاد" },
  { value: Action.DELETE, label: "حذف" },
  { value: Action.MANAGE, label: "مدیریت" },
  { value: Action.DEFAULT, label: "پیش‌فرض" },
  { value: Action.deposit_company, label: "واریز شرکت" },
  { value: Action.deposit_intermediary, label: "واریز واسطه" },
  { value: Action.deposit_user, label: "واریز کاربر" },
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
  { value: Resource.ALL, label: "همه" },
];

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

const mockRoles: Role[] = [
  {
    id: "1",
    name: "ادمین",
    description: "دسترسی کامل به همه بخش‌ها",
    permissions: resourceOptions.map((r) => ({
      resource: r.value,
      actions: [
        Action.READ,
        Action.UPDATE,
        Action.CREATE,
        Action.DELETE,
        Action.MANAGE,
      ],
    })),
  },
  {
    id: "2",
    name: "اپراتور",
    description: "دسترسی محدود به سفارش‌ها و محصولات",
    permissions: [
      { resource: Resource.ORDERS, actions: [Action.READ, Action.UPDATE] },
      { resource: Resource.PRODUCTS, actions: [Action.READ, Action.UPDATE] },
    ],
  },
  {
    id: "3",
    name: "مهمان",
    description: "فقط مشاهده اطلاعات",
    permissions: [
      { resource: Resource.PRODUCTS, actions: [Action.READ] },
      { resource: Resource.CATEGORIES, actions: [Action.READ] },
    ],
  },
];

const useMock = ref(true);
const roles = ref<Role[]>([]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref<Role>({
  id: "",
  name: "",
  description: "",
  permissions: [],
});

const openCreateModal = () => {
  editMode.value = false;
  form.value = {
    id: "",
    name: "",
    description: "",
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
    name: role.name,
    description: role.description,
    permissions,
  };
  isModalOpen.value = true;
};

const deleteRole = (id: string) => {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!confirm("آیا از حذف این نقش مطمئن هستید؟")) return;
  if (useMock.value) {
    roles.value = roles.value.filter((r) => r.id !== id);
  }
  // اگر API داشتی اینجا اضافه کن
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveRole = () => {
  if (!canCreate && !editMode.value) return alert("شما اجازه ایجاد ندارید!");
  if (!canUpdate && editMode.value) return alert("شما اجازه ویرایش ندارید!");
  if (useMock.value) {
    if (editMode.value) {
      const idx = roles.value.findIndex((r) => r.id === form.value.id);
      if (idx !== -1) roles.value[idx] = { ...form.value };
    } else {
      form.value.id = Date.now().toString();
      roles.value.push({ ...form.value });
    }
    isModalOpen.value = false;
  }
  // اگر API داشتی اینجا اضافه کن
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
const { canCreate, canRead, canUpdate, canDelete } = useAccess(Resource.ROLES);
// const { canCreate, canRead, canUpdate, canDelete } = {
//   canCreate: true,
//   canRead: true,
//   canUpdate: true,
//   canDelete: true,
// };

onMounted(() => {
  if (useMock.value) roles.value = mockRoles;
  // اگر API داشتی اینجا fetch کن
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
