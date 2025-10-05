<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>اطلاعات کاربری</h1>
        <img src="/icons/info.png" alt="profile" />
      </div>

      <div class="w-full max-w-xl mx-auto">
        <form
          @submit.prevent="saveProfile"
          class="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
          <div>
            <label class="block mb-2 text-right font-semibold text-[#1976d2]"
              >نام</label
            >
            <input
              v-model="form.firstName"
              type="text"
              class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
              :disabled="!canUpdate"
              required />
          </div>

          <div>
            <label class="block mb-2 text-right font-semibold text-[#1976d2]"
              >نام خانوادگی</label
            >
            <input
              v-model="form.lastName"
              type="text"
              class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
              :disabled="!canUpdate"
              required />
          </div>

          <div>
            <label class="block mb-2 text-right font-semibold text-[#1976d2]"
              >ایمیل</label
            >
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
              :disabled="!canUpdate"
              required />
          </div>

          <div>
            <label class="block mb-2 text-right font-semibold text-[#1976d2]"
              >شماره موبایل</label
            >
            <input
              v-model="form.phoneNumber"
              type="tel"
              class="w-full rounded-lg border border-gray-200 p-3 bg-gray-100 text-left"
              disabled />
          </div>

          <div>
            <label class="block mb-2 text-right font-semibold text-[#1976d2]"
              >کد ملی</label
            >
            <input
              v-model="form.nationalId"
              type="text"
              class="w-full rounded-lg border border-gray-200 p-3 bg-gray-100 text-left"
              disabled />
          </div>

          <div>
            <label class="block mb-2 text-right font-semibold text-[#1976d2]"
              >آدرس</label
            >
            <textarea
              v-model="form.address"
              class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
              rows="3"
              :disabled="!canUpdate"
              required></textarea>
          </div>

          <div class="flex justify-end">
            <button
              v-if="canUpdate"
              type="submit"
              class="bg-[#1976d2] disabled:opacity-60 text-white rounded-lg py-3 font-bold hover:bg-[#125ea7] transition">
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
  email: String;
}

const form = ref<Profile>({
  phoneNumber: "",
  nationalId: "",
  firstName: "",
  lastName: "",
  address: "",
  email: "",
});
const id = ref<string | null>(null);
// گرفتن اطلاعات پروفایل
const fetchProfile = async () => {
  if (!canRead) return;
  console.log("start fetching");
  try {
    const res = await $axios.get("/profile");
    const {
      phoneNumber,
      nationalId,
      firstName,
      lastName,
      address,
      _id,
      email,
    } = res.data;
    id.value = _id;
    form.value = {
      phoneNumber,
      nationalId,
      firstName,
      lastName,
      address,
      email,
    };
  } catch (err) {
    console.error("خطا در دریافت پروفایل:", err);
  }
};

// ذخیره تغییرات
const saveProfile = async () => {
  if (!canUpdate) return alert("شما اجازه ویرایش ندارید!");
  try {
    await $axios.patch(`/profile/${id.value}`, form.value);
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
