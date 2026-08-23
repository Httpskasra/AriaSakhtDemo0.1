<template>
    <section class="dashboard-page" dir="rtl">
      <PanelPageHeader title="اطلاعات کاربری" subtitle="اطلاعات شخصی و راه‌های ارتباطی حساب شما" icon="i-lucide-user-round" />

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
          class="profile-form panel-surface">
          <div class="profile-form__section">
            <h2>اطلاعات شخصی</h2>
            <div class="profile-form__grid">
              <UFormField label="نام" name="firstName"><UInput v-model="form.firstName" :disabled="!canUpdate" required /></UFormField>
              <UFormField label="نام خانوادگی" name="lastName"><UInput v-model="form.lastName" :disabled="!canUpdate" required /></UFormField>
              <UFormField label="ایمیل" name="email"><UInput v-model="form.email" type="email" :disabled="!canUpdate" required /></UFormField>
              <UFormField label="شماره موبایل" name="phoneNumber"><UInput v-model="form.phoneNumber" type="tel" disabled dir="ltr" /></UFormField>
              <UFormField label="کد ملی" name="nationalId"><UInput v-model="form.nationalId" disabled dir="ltr" /></UFormField>
            </div>
          </div>

          <div class="profile-form__section">
            <h2>نشانی</h2>
            <UFormField label="آدرس" name="address"><UTextarea v-model="form.address" :rows="3" :disabled="!canUpdate" required /></UFormField>
          </div>

          <UAlert v-if="!canUpdate" color="neutral" variant="soft" icon="i-lucide-lock-keyhole" title="این اطلاعات فقط قابل مشاهده است" description="برای ویرایش پروفایل، دسترسی ویرایش لازم است." />

          <div class="profile-form__actions">
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { toUserFacingError } from "~/services/apiClient";
useHead({
  title: "داشبورد | حساب کاربری",
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
const originalForm = ref<Profile>({ ...form.value });
const isDirty = computed(() => JSON.stringify(form.value) !== JSON.stringify(originalForm.value));
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
    originalForm.value = { ...form.value };
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
    originalForm.value = { ...form.value };
    feedback.success("ذخیره شد", "اطلاعات با موفقیت ذخیره شد.");
    await fetchProfile();
  } catch (err) {
    console.error("خطا در ذخیره پروفایل:", err);
    feedback.error("ذخیره انجام نشد", toUserFacingError(err).message);
  } finally {
    saving.value = false;
  }
};

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!isDirty.value) return;
  event.preventDefault();
  event.returnValue = "";
}

onBeforeRouteLeave(() => {
  if (isDirty.value && !window.confirm("تغییرات ذخیره نشده‌اند. آیا می‌خواهید از صفحه خارج شوید؟")) return false;
});

onMounted(() => {
  fetchProfile();
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => window.removeEventListener("beforeunload", handleBeforeUnload));
</script>

<style scoped>
.dashboard-page { width: min(100%, 76rem); margin: 0 auto; }
.profile-card { width: min(100%, 62rem); margin: 0 auto; }
.profile-form { display:grid; gap:1.5rem; padding:clamp(1rem, 3vw, 2rem); }
.profile-form__section { display:grid; gap:1rem; }
.profile-form__section + .profile-form__section { padding-top:1.25rem; border-top:1px solid var(--color-border); }
.profile-form__section h2 { margin:0; color:var(--color-text-heading); font-size:1rem; font-weight:800; }
.profile-form__grid { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; }
.profile-form__actions { display:flex; justify-content:flex-start; }
.profile-card :deep(label) { color: var(--color-text-heading); font-weight: 700; }
.profile-card :deep(input),
.profile-card :deep(textarea) {
  border-color: var(--color-border);
  border-radius: var(--radius-field);
  background: var(--color-bg-surface);
  transition: border-color .16s ease, box-shadow .16s ease;
}
.profile-card :deep(input:focus),
.profile-card :deep(textarea:focus) { border-color: var(--color-brand-blue); box-shadow: var(--focus-ring); }
.profile-card :deep(input:disabled),
.profile-card :deep(textarea:disabled) {
  cursor: not-allowed;
  opacity: .72;
  background: var(--color-bg-light);
}
@media (max-width: 640px) {
  .profile-form__grid { grid-template-columns:1fr; }
  .profile-form__actions :deep(button) { width:100%; }
}
</style>
