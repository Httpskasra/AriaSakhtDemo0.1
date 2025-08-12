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
            <option value="published">منتشر شده</option>
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

definePageMeta({
  middleware: ["dashboard-auth"],
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
  status: "draft" | "published";
};

// داده mock برای تست سریع
const mockCategories: Category[] = [
  {
    id: "1",
    name: "سیمان",
    slug: "cement",
    description: "دسته بندی انواع سیمان",
    parentName: "",
    status: "published",
  },
  {
    id: "2",
    name: "مصالح ساختمانی",
    slug: "building-materials",
    description: "دسته بندی مصالح ساختمان",
    parentName: "",
    status: "draft",
  },
  {
    id: "3",
    name: "رنگ‌ها",
    slug: "paints",
    description: "انواع رنگ برای ساختمان",
    parentName: "2",
    status: "published",
  },
];

// اگر true باشه داده mock استفاده میشه، اگر false باشه درخواست API زده میشه
const useMock = ref(true);

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
    status: cat.status as "draft" | "published",
  };
  isModalOpen.value = true;
};

const deleteCategory = async (id: string) => {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;

  if (useMock.value) {
    // حذف محلی در داده mock
    categories.value = categories.value.filter((c) => c.id !== id);
  } else {
    try {
      await $axios.delete(`/category/${id}`);
      // بعد از حذف، دوباره fetch کن
      await fetchCategories();
    } catch (err) {
      console.error("خطا در حذف دسته‌بندی:", err);
    }
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const fetchCategories = async () => {
  if (!canRead) return;
  try {
    if (useMock.value) {
      categories.value = mockCategories;
    } else {
      const { data } = await $axios.get("/category");
      categories.value = data;
    }
  } catch (err) {
    console.error("خطا در گرفتن دسته‌بندی‌ها:", err);
    // fallback به mock
    categories.value = mockCategories;
  }
};

const saveCategory = async () => {
  if (!canCreate && !editMode.value) return alert("شما اجازه ایجاد ندارید!");
  if (!canUpdate && editMode.value) return alert("شما اجازه ویرایش ندارید!");

  try {
    const payload = {
      ...form.value,
      description: form.value.description || "",
      parentName: form.value.parentName || "",
      status: form.value.status as "draft" | "published",
    };

    if (useMock.value) {
      if (editMode.value) {
        const idx = categories.value.findIndex((c) => c.id === payload.id);
        if (idx !== -1) categories.value[idx] = { ...payload };
      } else {
        payload.id = Date.now().toString();
        categories.value.push(payload);
      }
      isModalOpen.value = false;
    } else {
      if (editMode.value) {
        await $axios.put(`/category/${payload.id}`, payload);
      } else {
        await $axios.post("/category", payload);
      }
      await fetchCategories();
      isModalOpen.value = false;
    }
  } catch (err) {
    console.error("خطا در ذخیره دسته‌بندی:", err);
  }
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
