<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>اطلاعات کاربری</h1>
        <img src="/icons/info.png" alt="profile" />
      </div>

      <div class="bg-white rounded-lg shadow p-6 w-full max-w-xl mx-auto">
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">نام</label>
            <input
              v-model="form.firstName"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!canUpdate"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">نام خانوادگی</label>
            <input
              v-model="form.lastName"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!canUpdate"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">شماره موبایل</label>
            <input
              v-model="form.phoneNumber"
              type="tel"
              class="w-full border rounded px-3 py-2 bg-gray-100 text-left"
              disabled />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">کد ملی</label>
            <input
              v-model="form.nationalId"
              type="text"
              class="w-full border rounded px-3 py-2 bg-gray-100 text-left"
              disabled />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">آدرس</label>
            <textarea
              v-model="form.address"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              :disabled="!canUpdate"
              required></textarea>
          </div>

          <div class="flex justify-end">
            <button
              v-if="canUpdate"
              type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              ذخیره اطلاعات
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});

// دسترسی‌ها
const { canRead, canUpdate } = useAccess(Resource.PROFILE);

const { $axios } = useNuxtApp();

interface Profile {
  phoneNumber: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  address: string;
}

const form = ref<Profile>({
  phoneNumber: "",
  nationalId: "",
  firstName: "",
  lastName: "",
  address: "",
});
const id = ref<string | null>(null);
// گرفتن اطلاعات پروفایل
const fetchProfile = async () => {
  if (!canRead) return;
  console.log("start fetching");
  try {
    const res = await $axios.get("/profile");
    const { phoneNumber, nationalId, firstName, lastName, address, _id } =
      res.data;
    id.value = _id;
    form.value = { phoneNumber, nationalId, firstName, lastName, address };
  } catch (err) {
    console.error("خطا در دریافت پروفایل:", err);
  }
};

// ذخیره تغییرات
const saveProfile = async () => {
  if (!canUpdate) return alert("شما اجازه ویرایش ندارید!");
  try {
    await $axios.patch(`/profile/${id}`, form.value);
    alert("اطلاعات با موفقیت ذخیره شد!");
    await fetchProfile();
  } catch (err) {
    console.error("خطا در ذخیره پروفایل:", err);
    alert("ذخیره اطلاعات با مشکل مواجه شد.");
  }
};

onMounted(() => {
  fetchProfile();
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
