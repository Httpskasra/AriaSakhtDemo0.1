<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>اطلاعات کاربری</h1>
        <img src="/icons/info.png" alt="profile" />
      </div>

      <div class="w-full max-w-xl mx-auto">
        <UForm
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
              size="lg">
              ذخیره اطلاعات
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </NuxtLayout>
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
  if (!canRead.value) return;
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
    feedback.error("دریافت پروفایل انجام نشد", toUserFacingError(err).message);
  }
};

// ذخیره تغییرات
const saveProfile = async () => {
  if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
  try {
    await $axios.patch(`/profile/${id.value}`, form.value);
    feedback.success("ذخیره شد", "اطلاعات با موفقیت ذخیره شد.");
    await fetchProfile();
  } catch (err) {
    console.error("خطا در ذخیره پروفایل:", err);
    feedback.error("ذخیره انجام نشد", toUserFacingError(err).message);
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
  font-family: var(--font-yekan);
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
