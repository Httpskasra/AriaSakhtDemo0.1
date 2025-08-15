<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>شرکت‌ها</h1>
        <img src="/icons/company.png" alt="" />
      </div>

      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-lg py-2">
        <SearchBar v-model="search" :dark="true" />
        <button
          v-if="canCreate"
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
          + شرکت جدید
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-4 overflow-x-auto">
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
              v-for="(company, idx) in filteredCompanies"
              :key="company._id || idx"
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
                  @click="deleteCompany(company)"
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
import { ref, computed, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});

// دسترسی‌ها
const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.COMPANIES
);

// نوع شرکت
type Company = {
  _id?: string; // changed from id to _id
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  address: string;
  isActive: boolean;
  image: string;
};

const companies = ref<Company[]>([]);
const search = ref("");
const showModal = ref(false);
const editMode = ref(false);
const selectedId = ref<string | null>(null);

const form = ref({
  name: "",
  email: "",
  phone: "",
  registrationNumber: "",
  address: "",
  isActive: true,
  image: "",
});

const { $axios } = useNuxtApp();

const fetchCompanies = async () => {
  if (!canRead) return;
  try {
    const res = await $axios.get("/companies");
    companies.value = res.data;
  } catch (err) {
    console.warn("API در دسترس نیست.");
    companies.value = [];
  }
};

const filteredCompanies = computed(() =>
  companies.value.filter((c) =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

function openModal(company: any | null = null) {
  if (company) {
    if (!canUpdate) return alert("شما اجازه ویرایش ندارید!");
    editMode.value = true;
    selectedId.value = company._id; // changed from company.id
    form.value = { ...company };
  } else {
    if (!canCreate) return alert("شما اجازه ایجاد ندارید!");
    editMode.value = false;
    selectedId.value = null;
    form.value = {
      name: "",
      email: "",
      phone: "",
      registrationNumber: "",
      address: "",
      isActive: true,
      image: "",
    };
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      form.value.image = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

const saveCompany = async () => {
  try {
    if (editMode.value) {
      if (!selectedId.value || selectedId.value.length !== 24) {
        alert("شناسه شرکت معتبر نیست!");
        return;
      }
      // فقط فیلدهای مجاز را ارسال کن
      const cleanData = {
        id: selectedId.value, // اضافه کردن id
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        registrationNumber: form.value.registrationNumber,
        address: form.value.address,
        isActive: form.value.isActive,
        image: form.value.image,
      };
      console.log("PATCH id:", selectedId.value); // برای دیباگ
      await $axios.patch(`/companies/${selectedId.value}`, cleanData);
    } else {
      await $axios.post("/companies", form.value);
    }
    await fetchCompanies();
    closeModal();
  } catch (err) {
    console.error("خطا در ذخیره شرکت:", err);
  }
};

const deleteCompany = async (company: Company) => {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!confirm("آیا از حذف این شرکت مطمئن هستید؟")) return;
  try {
    await $axios.delete(`/companies/${company._id}`); // changed from company.id
    await fetchCompanies();
  } catch (err) {
    console.error("خطا در حذف شرکت:", err);
  }
};

onMounted(() => {
  fetchCompanies();
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
