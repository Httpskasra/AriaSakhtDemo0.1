<template>
    <div class="collaboration-hero">
      <div class="collaboration-hero__content">
        <UIcon name="i-lucide-handshake" class="collaboration-hero__icon" />
        <h1>همکاری با ما</h1>
        <p>
          اگر صاحب کسب‌وکار هستید و تمایل به همکاری با تجاریس دارید، اطلاعات
          شرکت خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند.
        </p>
      </div>
    </div>
    <div class="collaboration-content">
      <form
        @submit.prevent="submit"
        class="collaboration-form premium-card">
        <div>
          <label class="collaboration-form__label"
            >نام شرکت</label
          >
          <input
            v-model="form.name"
            type="text"
            class="collaboration-form__input"
            placeholder="تجاریس" />
        </div>
        <div>
          <label class="collaboration-form__label"
            >ایمیل</label
          >
          <input
            v-model="form.email"
            type="email"
            class="collaboration-form__input"
            placeholder="email@example.com" />
        </div>
        <div>
          <label class="collaboration-form__label"
            >شماره تماس</label
          >
          <input
            v-model="form.phone"
            type="text"
            class="collaboration-form__input"
            placeholder="09123456789" />
        </div>
        <div>
          <label class="collaboration-form__label"
            >کدملی</label
          >
          <input
            v-model="form.nationalId"
            type="text"
            class="collaboration-form__input"
            placeholder="1234567891" />
        </div>
        <div>
          <label class="collaboration-form__label"
            >شماره ثبت شرکت</label
          >
          <input
            v-model="form.registrationNumber"
            type="text"
            class="collaboration-form__input"
            placeholder="10002110222" />
        </div>
        <div>
          <label class="collaboration-form__label"
            >آدرس</label
          >
          <input
            v-model="form.address"
            type="text"
            class="collaboration-form__input"
            placeholder="شیراز،..." />
        </div>
        <!-- <div>
          <label class="collaboration-form__label"
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
            class="collaboration-form__input" />
        </div>

        <div v-if="error" class="collaboration-feedback collaboration-feedback--error">
          {{ error }}
        </div>
        <div v-if="success" class="collaboration-feedback collaboration-feedback--success">
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
.collaboration-hero {
  padding: 3rem 1rem 2rem;
  border-radius: var(--radius-none) var(--radius-none) var(--radius-dialog) var(--radius-dialog);
  background: linear-gradient(135deg, var(--color-bg-light), var(--color-bg-surface));
  box-shadow: var(--shadow-raised);
  text-align: center;
}

.collaboration-hero__content { display: grid; justify-items: center; gap: .5rem; max-width: 52rem; margin-inline: auto; }
.collaboration-hero__icon { color: var(--color-brand-blue); font-size: var(--spacing-icon-empty-state); }
.collaboration-hero h1 { color: var(--color-text-heading); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; }
.collaboration-hero p { color: var(--color-text-body); line-height: 1.9; }
.collaboration-content { width: min(100% - 2rem, 52rem); margin: 2rem auto 0; }
.collaboration-form { display: grid; gap: 1.25rem; padding: clamp(1.25rem, 4vw, 2rem); }
.collaboration-form__label { display: block; margin-bottom: .45rem; color: var(--color-brand-blue); font-size: .875rem; font-weight: 700; text-align: right; }
.collaboration-form__input { width: 100%; min-height: var(--control-height-md); border: 1px solid var(--color-border); border-radius: var(--radius-field); padding: .75rem; background: var(--color-bg-surface); color: var(--color-text-heading); transition: border-color .16s ease, box-shadow .16s ease; }
.collaboration-form__input:focus-visible { border-color: var(--color-brand-blue); outline: none; box-shadow: var(--focus-ring); }
.collaboration-feedback { font-size: .875rem; text-align: right; }
.collaboration-feedback--error { color: var(--color-danger-fg); }
.collaboration-feedback--success { color: var(--color-success-fg); }

@media (max-width: 640px) {
  .collaboration-hero { padding-block: 2rem 1.5rem; }
  .collaboration-content { width: min(100% - 1rem, 52rem); margin-top: 1rem; }
}
</style>
