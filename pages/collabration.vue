<template>
  <NuxtLayout>
    <div
      class="bg-gradient-to-br from-[#f8fafc] via-[#f8fafc] to-[#e0e7ef] pt-12 pb-8 text-center rounded-b-3xl shadow-lg">
      <div class="flex flex-col items-center">
        <span class="text-[#1976d2] text-5xl mb-2">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <title />

            <g
              fill="none"
              fill-rule="evenodd"
              id="页面-1"
              stroke="none"
              stroke-width="2">
              <g id="导航图标" transform="translate(-250.000000, -15.000000)">
                <g id="编组" transform="translate(249.000000, 15.000000)">
                  <polygon
                    fill="#FFFFFF"
                    fill-opacity="0.01"
                    fill-rule="nonzero"
                    id="路径"
                    points="26 0 0 0 0 26 26 26" />

                  <path
                    d="M13,21.6666667 L19.5,15.1666667 L17.3333333,17.3333333 L15.1666667,19.5 L13,21.6666667 Z M13,21.6666667 L2.16666667,10.8333333 L8.66666667,4.33333333 L13,8.66666667"
                    id="形状"
                    stroke="#1673ff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2" />

                  <path
                    d="M9.20833333,12.4583333 L17.3333333,4.33333333 L23.8333333,10.8333333 L19.5,15.1666667 L15.1666667,10.8333333 L11.9166667,14.0833333 L9.20833333,12.4583333 Z M9.20833333,12.4583333 L13,8.66666667"
                    id="形状"
                    stroke="#1673ff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2" />

                  <line
                    id="路径"
                    stroke="#1673ff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    x1="15.1666667"
                    x2="13.5416667"
                    y1="19.5"
                    y2="17.875" />

                  <line
                    id="路径"
                    stroke="#1673ff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width=""
                    x1="17.3333333"
                    x2="15.7083333"
                    y1="17.3333333"
                    y2="15.7083333" />
                </g>
              </g>
            </g></svg
        ></span>
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
            placeholder="آریا ساخت" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >ایمیل</label
          >
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="email@example.com" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >شماره تماس</label
          >
          <input
            v-model="form.phone"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="09123456789" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >کدملی</label
          >
          <input
            v-model="form.nationalId"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="1234567891" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >شماره ثبت شرکت</label
          >
          <input
            v-model="form.registrationNumber"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="10002110222" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >آدرس</label
          >
          <input
            v-model="form.address"
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="شیراز،..." />
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
useHead({
  title: " همکاری | آریاساخت",
});
import { ref, reactive } from "vue";
import { toInternationalPhone } from "@/utils/PhoneNumber";
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
  nationalId: "",
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
  form.nationalId = "";
  form.image = null;
  if (fileInput.value) fileInput.value.value = "";
}

async function submit() {
  error.value = null;
  success.value = null;
  loading.value = true;
  try {
    // Backend expects string fields in JSON. Convert file to base64 string if provided.
    async function fileToBase64(file: File) {
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    }

    const payload: Record<string, string> = {
      name: String(form.name || ""),
      email: String(form.email || ""),
      phone: toInternationalPhone(String(form.phone || "")),
      registrationNumber: String(form.registrationNumber || ""),
      address: String(form.address || ""),
      nationalId: String(form.nationalId || ""),
      image: "",
    };

    if (form.image) {
      try {
        payload.image = await fileToBase64(form.image);
      } catch (e) {
        // If base64 conversion fails, leave image empty and continue
        console.warn("image convert failed", e);
        payload.image = "";
      }
    }

    const res = await api.post("/companies", payload);

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
