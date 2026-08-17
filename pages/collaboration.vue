<template>
    <div
      class="bg-gradient-to-br from-[#f8fafc] via-[#f8fafc] to-[#e0e7ef] pt-12 pb-8 text-center rounded-b-3xl shadow-lg">
      <div class="flex flex-col items-center">
        <UIcon name="i-lucide-handshake" class="text-primary size-icon-hero mb-2" />
        <h1 class="text-3xl font-bold text-[var(--color-text-heading)] mb-2">همکاری با ما</h1>
        <p class="text-[var(--color-text-body)] text-base">
          اگر صاحب کسب‌وکار هستید و تمایل به همکاری با تجاریس دارید، اطلاعات
          شرکت خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند.
        </p>
      </div>
    </div>
    <div class="mx-auto mt-8 px-4 w-full md:w-3/4">
      <form
        @submit.prevent="submit"
        class="premium-card p-8 flex flex-col gap-6">
        <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >نام شرکت</label
          >
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="تجاریس" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >ایمیل</label
          >
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="email@example.com" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >شماره تماس</label
          >
          <input
            v-model="form.phone"
            type="text"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="09123456789" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >کدملی</label
          >
          <input
            v-model="form.nationalId"
            type="text"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="1234567891" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >شماره ثبت شرکت</label
          >
          <input
            v-model="form.registrationNumber"
            type="text"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="10002110222" />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >آدرس</label
          >
          <input
            v-model="form.address"
            type="text"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="شیراز،..." />
        </div>
        <!-- <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >فعال است؟</label
          >
          <select
            v-model="form.isActive"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
          </select>
        </div> -->
        <div>
          <label class="block mb-2 text-right font-semibold text-primary"
            >لوگوی شرکت</label
          >
          <input
            @change="onFileChange"
            ref="fileInput"
            type="file"
            accept="image/*"
            class="w-full rounded-field border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary transition" />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-right">
          {{ error }}
        </div>
        <div v-if="success" class="text-green-600 text-sm text-right">
          {{ success }}
        </div>

        <UButton type="submit" size="lg" block :disabled="loading">
          <span v-if="loading">در حال ارسال...</span>
          <span v-else>ارسال اطلاعات همکاری</span>
        </UButton>
      </form>
    </div>
</template>

<script setup lang="ts">
useHead({
  title: "همکاری",
});
import { ref, reactive } from "vue";
import { toInternationalPhone } from "@/utils/PhoneNumber";
import type { AxiosError } from "axios";
import { createVendorRequest } from '~/services/companyService';

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

    const payload = {
      companyName: String(form.name || ""),
      email: String(form.email || ""),
      phone: toInternationalPhone(String(form.phone || "")) || undefined,
      registrationNumber: String(form.registrationNumber || "") || undefined,
      address: String(form.address || "") || undefined,
      nationalId: String(form.nationalId || "") || undefined,
      imageUrl: "",
    } as Record<string, string | undefined>;

    if (form.image) {
      try {
        payload.imageUrl = await fileToBase64(form.image);
      } catch (e) {
        console.warn("image convert failed", e);
        payload.imageUrl = undefined;
      }
    }

    await createVendorRequest(payload);

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
* {
  font-family: var(--font-yekan);
}
</style>
