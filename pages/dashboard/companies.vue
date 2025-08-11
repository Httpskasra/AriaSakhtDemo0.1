<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>شرکت‌ها</h1>
        <img src="/icons/company.png" alt="" />
      </div>

      <div class="actions flex justify-between items-center mb-4">
        <SearchBar v-model="search" dark="true" />
        <button
          v-if="canCreate"
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + شرکت جدید
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <table class="w-full text-sm text-right border-collapse">
          <thead class="border-b">
            <tr class="text-gray-600">
              <th class="p-3">لوگو</th>
              <th class="p-3">نام</th>
              <th class="p-3">ایمیل</th>
              <th class="p-3">تلفن</th>
              <th class="p-3">شماره ثبت</th>
              <th class="p-3">آدرس</th>
              <th class="p-3">وضعیت</th>
              <th class="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="company in filteredCompanies"
              :key="company._id"
              class="border-b hover:bg-gray-50">
              <td class="p-3">
                <img
                  v-if="company.image"
                  :src="company.image"
                  class="w-12 h-12 rounded-full object-cover" />
              </td>
              <td class="p-3">{{ company.name }}</td>
              <td class="p-3">{{ company.email }}</td>
              <td class="p-3">{{ company.phone }}</td>
              <td class="p-3">{{ company.registrationNumber }}</td>
              <td class="p-3">{{ company.address }}</td>
              <td class="p-3">
                <span
                  class="px-2 py-1 rounded text-white"
                  :class="company.isActive ? 'bg-green-500' : 'bg-red-500'">
                  {{ company.isActive ? "فعال" : "غیرفعال" }}
                </span>
              </td>
              <td class="p-3 flex gap-2">
                <button
                  v-if="canUpdate"
                  @click="openModal(company)"
                  class="text-blue-500 hover:underline">
                  ویرایش
                </button>
                <button
                  v-if="canDelete"
                  @click="deleteCompany(company._id)"
                  class="text-red-500 hover:underline">
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <BaseModal v-if="showModal" @close="closeModal">
        <h2 class="text-lg font-bold mb-4">
          {{ editMode ? "ویرایش شرکت" : "شرکت جدید" }}
        </h2>
        <form @submit.prevent="saveCompany" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">نام</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">ایمیل</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">تلفن</label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">شماره ثبت</label>
            <input
              v-model="form.registrationNumber"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">آدرس</label>
            <textarea
              v-model="form.address"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">وضعیت</label>
            <select
              v-model="form.isActive"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="true">فعال</option>
              <option :value="false">غیرفعال</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">لوگو</label>
            <input type="file" @change="onFileChange" />
            <img
              v-if="form.image"
              :src="form.image"
              class="w-20 h-20 mt-2 rounded-full object-cover" />
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
              انصراف
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              ذخیره
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import BaseModal from "~/components/BaseModal.vue";

definePageMeta({
  middleware: "dashboard-auth",
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

// داده‌های mock برای تست سریع
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

// این متغیر رو بذار true تا داده‌ها mock باشند، false تا از API واقعی استفاده بشه
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
      // استفاده از داده‌های mock
      categories.value = mockCategories;
    } else {
      // درخواست به API واقعی
      const { data } = await $axios.get("/category");
      categories.value = data;
    }
  } catch (err) {
    console.error("خطا در گرفتن دسته‌بندی‌ها:", err);
    // در صورت خطا fallback به داده‌های mock
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
        await $axios.put(`//category/${payload.id}`, payload);
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
.container {
  width: 90%;
  margin: auto;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}
.title img {
  width: 50px;
  height: 50px;
}
</style>
