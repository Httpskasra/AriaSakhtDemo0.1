<template>
  <div class="space-y-6" dir="rtl">
    <PanelPageHeader title="تنظیمات سیستم" subtitle="مدیریت سرویس‌های حساس سامانه" icon="i-lucide-settings" />
    <div class="premium-card space-y-4 p-5">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="font-semibold text-gray-900">تأیید هویت شاهکار</h2>
          <p class="mt-1 text-sm text-gray-500">در حالت روشن، ثبت‌نام به تطبیق کد ملی و موبایل از طریق شاهکار نیاز دارد.</p>
        </div>
        <USwitch :model-value="enabled" :disabled="loading || (!available && !enabled)" @update:model-value="changeEnabled" />
      </div>
      <SharedAsyncState v-if="loading && !loaded" state="loading" />
      <p v-if="errorMessage" class="text-sm text-red-600" role="alert">{{ errorMessage }}</p>
      <p v-if="loaded && !available" class="text-sm text-amber-700">پیکربندی ارائه‌دهنده روی سرور کامل نیست؛ پیش از روشن کردن شاهکار، URL و کلید سرویس را تنظیم کنید.</p>
      <p v-if="loaded" class="text-sm text-gray-600">وضعیت فعلی: {{ enabled ? "روشن" : "خاموش" }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp();
const enabled = ref(false);
const available = ref(false);
const loaded = ref(false);
const loading = ref(false);
const errorMessage = ref("");

type ShahkarState = { enabled: boolean; available: boolean; reason?: string };

async function load() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data } = await $axios.get<ShahkarState>("/admin/settings/shahkar");
    enabled.value = data.enabled;
    available.value = data.available;
    loaded.value = true;
  } catch {
    errorMessage.value = "دریافت وضعیت شاهکار انجام نشد.";
  } finally {
    loading.value = false;
  }
}

async function changeEnabled(value: boolean) {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data } = await $axios.patch<ShahkarState>("/admin/settings/shahkar", { enabled: value });
    enabled.value = data.enabled;
    available.value = data.available;
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || "تغییر وضعیت شاهکار انجام نشد.";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>
