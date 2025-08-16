<template>
  <NuxtLayout name="dashboard">
    <div class="title">
      <h1>دسته‌بندی‌ها</h1>
      <img src="/icons/categories.png" alt="categories" />
    </div>

    <div class="container" v-if="canRead">
      <div class="header">
        <SearchBar :dark="true" />

        <button v-if="canCreate" class="create-btn" @click="openCreateModal">
          افزودن دسته‌بندی
        </button>
      </div>

      <div class="list">
        <table>
          <thead>
            <tr>
              <th>نام دسته</th>
              <th>توضیحات</th>
              <th v-if="canUpdate || canDelete">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id">
              <td>{{ cat.name }}</td>
              <td>{{ cat.description }}</td>
              <td v-if="canUpdate || canDelete" class="actions">
                <button
                  v-if="canUpdate"
                  class="edit"
                  @click="editCategory(cat)">
                  ویرایش
                </button>
                <button
                  v-if="canDelete"
                  class="delete"
                  @click="deleteCategory(cat.id)">
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="no-access">شما به این بخش دسترسی ندارید.</div>

    <!-- مودال ساخت/ویرایش -->
    <BaseModal v-if="isModalOpen" @close="closeModal">
      <h2 class="text-xl font-bold mb-6 text-gray-800">
        {{ editMode ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی جدید" }}
      </h2>

      <form class="space-y-5" @submit.prevent="saveCategory">
        <!-- نام -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >نام</label
          >
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition" />
        </div>

        <!-- Slug -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Slug</label
          >
          <input
            v-model="form.slug"
            type="text"
            required
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition" />
        </div>

        <!-- توضیحات -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >توضیحات</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"></textarea>
        </div>

        <!-- والد (parentName = id والد) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >دسته والد</label
          >
          <select
            v-model="form.parentName"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition">
            <option value="">بدون والد</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- وضعیت -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >وضعیت</label
          >
          <select
            v-model="form.status"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition">
            <option value="draft">پیش‌نویس</option>
            <option value="active">فعال</option>
            <option value="inactive">غیر فعال</option>
          </select>
        </div>

        <!-- دکمه‌ها -->
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
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import BaseModal from "~/components/BaseModal.vue";
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});

const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.CATEGORIES
);

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentName?: string;
  status: "draft" | "active" | "inactive";
};

const categories = ref<Category[]>([]);
const { $axios } = useNuxtApp();

const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref({
  id: "",
  name: "",
  slug: "",
  description: "",
  parentName: "",
  status: "draft",
});

const openCreateModal = () => {
  editMode.value = false;
  form.value = {
    id: "",
    name: "",
    slug: "",
    description: "",
    parentName: "",
    status: "draft",
  };
  isModalOpen.value = true;
};

const editCategory = (cat: Category) => {
  editMode.value = true;
  form.value = {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    parentName: cat.parentName || "",
    status: cat.status as "draft" | "active" | "inactive",
  };
  isModalOpen.value = true;
};

const deleteCategory = async (id: string) => {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;

  try {
    await $axios.delete(`/categories/${id}`);
    // بعد از حذف، دوباره fetch کن
    await fetchCategories();
  } catch (err) {
    console.error("خطا در حذف دسته‌بندی:", err);
  }
};

const fetchCategories = async () => {
  if (!canRead) return;
  try {
    const { data } = await $axios.get("/categories");
    categories.value = data;
    console.log(data);
  } catch (err) {
    console.error("خطا در گرفتن دسته‌بندی‌ها:", err);
    categories.value = [];
  }
};

const saveCategory = async () => {
  if (!canCreate && !editMode.value) return alert("شما اجازه ایجاد ندارید!");
  if (!canUpdate && editMode.value) return alert("شما اجازه ویرایش ندارید!");

  try {
    const parentId =
      form.value.parentName === "" ? null : form.value.parentName;

    let payload;
    if (editMode.value) {
      payload = {
        id: form.value.id,
        name: form.value.name,
        slug: form.value.slug,
        description: form.value.description,
        parentId,
        status: form.value.status,
      };
      await $axios.patch(`/categories/${form.value.id}`, payload);
    } else {
      payload = {
        name: form.value.name,
        slug: form.value.slug,
        description: form.value.description,
        parentId,
        status: form.value.status,
      };
      await $axios.post("/categories", payload);
    }

    isModalOpen.value = false;
    await fetchCategories();
  } catch (err) {
    console.error("خطا در ذخیره دسته‌بندی:", err);
  }
};
const closeModal = () => {
  isModalOpen.value = false;
};
onMounted(() => {
  fetchCategories();
});
</script>
<style scoped>
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 230px;
  display: flex;
  align-items: center;
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

.container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  margin: auto;
}
.header {
  display: flex;
  justify-content: space-between;
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
