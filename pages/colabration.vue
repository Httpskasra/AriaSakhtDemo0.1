<template>
  <NuxtLayout>
    <div
      class="bg-gradient-to-br from-[#f8fafc] via-[#f8fafc] to-[#e0e7ef] pt-12 pb-8 text-center rounded-b-3xl shadow-lg">
      <div class="flex flex-col items-center">
        <span class="material-icons text-[#1976d2] text-5xl mb-2"
          >handshake</span
        >
        <h1 class="text-3xl font-bold text-[#2c3e50] mb-2">همکاری با ما</h1>
        <p class="text-[#607d8b] text-base">
          اگر صاحب کسب‌وکار هستید و تمایل به همکاری با آریا ساخت دارید، اطلاعات
          شرکت خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند.
        </p>
      </div>
    </div>
    <div class="mx-auto mt-8 px-4 w-full md:w-3/4">
      <form
        @submit.prevent="submit"
        class="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >نام شرکت</label
          >
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="نام شرکت" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >ایمیل</label
          >
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="ایمیل شرکت" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >شماره تماس</label
          >
          <input
            v-model="form.phone"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="شماره تماس" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >شماره ثبت شرکت</label
          >
          <input
            v-model="form.registrationNumber"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="شماره ثبت" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >آدرس</label
          >
          <input
            v-model="form.address"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="آدرس شرکت" />
        </div>
        <!-- <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >فعال است؟</label
          >
          <select
            v-model="form.isActive"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
          </select>
        </div> -->
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >لوگوی شرکت</label
          >
          <input
            @change="onFileChange"
            ref="fileInput"
            type="file"
            accept="image/*"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition" />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-right">
          {{ error }}
        </div>
        <div v-if="success" class="text-green-600 text-sm text-right">
          {{ success }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="bg-[#1976d2] disabled:opacity-60 text-white rounded-lg py-3 font-bold hover:bg-[#125ea7] transition">
          <span v-if="loading">در حال ارسال...</span>
          <span v-else>ارسال اطلاعات همکاری</span>
        </button>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { AxiosError } from "axios";

const nuxtApp = useNuxtApp() as any;
const api = nuxtApp.$axios as any;

const fileInput = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  registrationNumber: "",
  address: "",
  isActive: true,
  image: null as File | null,
});

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files && target.files[0] ? target.files[0] : null;
  form.image = file;
}

function resetForm() {
  form.name = "";
  form.email = "";
  form.phone = "";
  form.registrationNumber = "";
  form.address = "";
  form.isActive = true;
  form.image = null;
  if (fileInput.value) fileInput.value.value = "";
}

async function submit() {
  error.value = null;
  success.value = null;
  loading.value = true;
  try {
    // Use FormData to allow file upload
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("registrationNumber", form.registrationNumber);
    fd.append("address", form.address);
    fd.append("isActive", "true");
    if (form.image) fd.append("image", form.image);

    const res = await api.post("/companies", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    success.value = "اطلاعات با موفقیت ارسال شد.";
    resetForm();
  } catch (err) {
    const e = err as AxiosError;
    if (e.response && (e.response as any).data) {
      error.value =
        (e.response as any).data.message ||
        JSON.stringify((e.response as any).data);
    } else {
      error.value = e.message || "خطا در ارسال اطلاعات";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
* {
  font-family: "iran-yekan-DemiBold";
}
</style>
