<template>
  <NuxtLayout name="pannels">
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
          <label for="lastName" class="font-semibold text-blue-900"
            >نام خانوادگی</label
          >
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required />
        </div>
        <div class="flex flex-col gap-2">
          <label for="phoneNumber" class="font-semibold text-blue-900"
            >شماره موبایل</label
          >
          <input
            id="phoneNumber"
            v-model="form.phoneNumber"
            type="tel"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-left bg-gray-100"
            disabled />
        </div>
        <div class="flex flex-col gap-2">
          <label for="nationalId" class="font-semibold text-blue-900"
            >کد ملی</label
          >
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
            class="input"
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
import { ref } from "vue";

const form = ref({
  phoneNumber: "+989123456789",
  nationalId: "1234567890",
  firstName: "Ali",
  lastName: "Hosseini",
  address: "Tehran, Valiasr St., No. 123",
});

const handleSubmit = () => {
  // ارسال اطلاعات به سرور یا نمایش پیام موفقیت
  alert("اطلاعات با موفقیت ذخیره شد!");
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90%;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 300px;
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
    width: 50%;
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
