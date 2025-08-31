<template>
  <NuxtLayout name="dashboard">
    <div
      class="title flex items-center justify-evenly text-blue-900 font-bold font-yekan mb-4 w-[230px] mx-4">
      <h1 class="text-3xl md:text-xl">اطلاعات کاربری</h1>
      <img
        src="/icons/info.png"
        alt=""
        class="w-[66px] h-[66px] md:w-10 md:h-10" />
    </div>

    <div class="container w-[90%] mx-auto flex flex-col items-center">
      <form
        class="bg-white rounded-lg shadow-md p-8 w-full max-w-xl flex flex-col gap-6"
        @submit.prevent="handleSubmit">

        <div class="flex flex-col gap-2">
          <label for="firstName" class="font-semibold text-blue-900">نام</label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required />
        </div>

        <div class="flex flex-col gap-2">
          <label for="lastName" class="font-semibold text-blue-900">نام خانوادگی</label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required />
        </div>

        <div class="flex flex-col gap-2">
          <label for="phoneNumber" class="font-semibold text-blue-900">شماره موبایل</label>
          <input
            id="phoneNumber"
            v-model="form.phoneNumber"
            type="tel"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-left bg-gray-100"
            disabled />
        </div>

        <div class="flex flex-col gap-2">
          <label for="nationalId" class="font-semibold text-blue-900">کد ملی</label>
          <input
            id="nationalId"
            v-model="form.nationalId"
            type="text"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-left bg-gray-100"
            disabled />
        </div>

        <div class="flex flex-col gap-2">
          <label for="address" class="font-semibold text-blue-900">آدرس</label>
          <textarea
            id="address"
            v-model="form.address"
            class="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            rows="3"
            required></textarea>
        </div>

        <button
          type="submit"
          class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition">
          ذخیره اطلاعات
        </button>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const form = ref({
  phoneNumber: "",
  nationalId: "",
  firstName: "",
  lastName: "",
  address: "",
});

// گرفتن پروفایل از سرور
const fetchProfile = async () => {
  try {
    const { data } = await useFetch("/api/profile", {
      method: "GET",
    });
    if (data.value) {
      form.value = { ...form.value, ...data.value };
    }
  } catch (err) {
    console.error("خطا در دریافت پروفایل:", err);
  }
};

// ارسال تغییرات پروفایل
const handleSubmit = async () => {
  try {
    await useFetch("/api/profile", {
      method: "PATCH",
      body: form.value,
    });
    alert("اطلاعات با موفقیت ذخیره شد!");
  } catch (err) {
    console.error("خطا در ذخیره پروفایل:", err);
    alert("ذخیره اطلاعات با مشکل مواجه شد.");
  }
};

onMounted(fetchProfile);

// 🟦 middleware
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});
</script>
