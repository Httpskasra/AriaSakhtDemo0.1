<template>
    <section class="dashboard-page" dir="rtl">
      <DashboardPageHeader title="اطلاعات کاربری" icon="/icons/info.png" alt="پروفایل" />

      <div class="profile-card">
        <SharedAsyncState
          v-if="loading"
          state="loading"
          :skeleton-rows="5" />
        <SharedAsyncState
          v-else-if="loadError"
          state="error"
          :message="loadError"
          @retry="fetchProfile" />
        <UForm
          v-else
          :state="form"
          @submit.prevent="saveProfile"
          class="premium-card p-8 flex flex-col gap-6">
          <UFormField label="نام" name="firstName">
            <UInput v-model="form.firstName" :disabled="!canUpdate" required />
          </UFormField>

          <UFormField label="نام خانوادگی" name="lastName">
            <UInput v-model="form.lastName" :disabled="!canUpdate" required />
          </UFormField>

          <UFormField label="ایمیل" name="email">
            <UInput v-model="form.email" type="email" :disabled="!canUpdate" required />
          </UFormField>

          <UFormField label="شماره موبایل" name="phoneNumber">
            <UInput v-model="form.phoneNumber" type="tel" disabled class="text-left" />
          </UFormField>

          <UFormField label="کد ملی" name="nationalId">
            <UInput v-model="form.nationalId" disabled class="text-left" />
          </UFormField>

          <UFormField label="آدرس" name="address">
            <UTextarea v-model="form.address" :rows="3" :disabled="!canUpdate" required />
          </UFormField>

          <div class="flex justify-end">
            <UButton
              v-if="canUpdate"
              type="submit"
              size="lg"
              :loading="saving"
              :disabled="saving">
              ذخیره اطلاعات
            </UButton>
          </div>
        </UForm>
      </div>
    </section>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { ref, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { toUserFacingError } from "~/services/apiClient";
useHead({
  title: "داشبورد | حساب کاربری",
});
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "permission"],
  permission: { resource: "profile", action: "r" },
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
  email: string;
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
const saving = ref(false);
const loading = ref(false);
const loadError = ref("");
// گرفتن اطلاعات پروفایل
const fetchProfile = async () => {
  if (!canRead.value) return;
  loading.value = true;
  loadError.value = "";
  //console.log("start fetching");
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
    loadError.value = toUserFacingError(err).message;
  } finally {
    loading.value = false;
  }
};

// ذخیره تغییرات
const saveProfile = async () => {
  if (saving.value) return;
  if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
  try {
    if (!form.value.firstName.trim() || !form.value.lastName.trim() || !form.value.email.trim() || !form.value.address.trim()) {
      feedback.error("اطلاعات ناقص", "نام، نام خانوادگی، ایمیل و آدرس الزامی هستند.");
      return;
    }
    saving.value = true;
    await $axios.patch(`/profile/${id.value}`, form.value);
    feedback.success("ذخیره شد", "اطلاعات با موفقیت ذخیره شد.");
    await fetchProfile();
  } catch (err) {
    console.error("خطا در ذخیره پروفایل:", err);
    feedback.error("ذخیره انجام نشد", toUserFacingError(err).message);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.dashboard-page { width: min(100%, 68rem); margin: 0 auto; }
.profile-card { width: min(100%, 44rem); margin: 0 auto; }
.profile-card :deep(.premium-card) {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-card);
}
.profile-card :deep(label) { color: var(--color-text-heading); font-weight: 700; }
.profile-card :deep(input:disabled),
.profile-card :deep(textarea:disabled) {
  cursor: not-allowed;
  opacity: .72;
  background: var(--color-bg-light);
}
@media (max-width: 640px) { .profile-card :deep(.premium-card) { padding: 1rem; } }
</style>
