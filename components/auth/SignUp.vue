<template>
  <BaseModal @close="closeModal">
    <div class="auth-container">
      <img src="/logo/logo.png" alt="لوگوی تجاریس" class="auth-logo" />

      <form @submit.prevent.stop="handleSubmit" class="auth-form">
        <!-- کد ملی -->
        <div class="auth-input-group">
          <label class="auth-input-label">
            <input
              type="text"
              v-model="meliCode"
              required
              placeholder="مثال: 2665554789"
              class="auth-input-field"
              @input="validateMeli" />
            <div class="auth-input-addon">
              <span>کد ملی</span>
            </div>
          </label>
          <span
            class="auth-input-error"
            :class="{ inline: meliError, hidden: !meliError }">
            کد ملی وارد شده صحیح نمی باشد
          </span>
        </div>

        <!-- شماره تلفن -->
        <div class="auth-input-group">
          <label class="auth-input-label">
            <input
              type="text"
              v-model="phoneNumber"
              required
              placeholder="مثال: 0912345678"
              class="auth-input-field"
              @input="validatePhone" />
            <div class="auth-input-addon">
              <span>شماره تلفن</span>
            </div>
          </label>
          <span
            class="auth-input-error"
            :class="{ inline: phoneError, hidden: !phoneError }">
            شماره تماس وارد شده صحیح نمی باشد
          </span>
        </div>

        <!-- قبول قوانین -->
        <label class="rules-label">
          <input
            type="checkbox"
            v-model="acceptedRules"
            required
            class="rules-checkbox" />
          <span class="rules-text">
            شرایط و قوانین را مطالعه کردم و قبول دارم
          </span>
        </label>

        <!-- دکمه ارسال -->
        <UButton type="submit" color="primary" variant="solid" size="lg" block :disabled="loading">
          {{ loading ? "در حال ارسال..." : "عضویت" }}
        </UButton>

        <!-- خطای سرور -->
        <span
          class="auth-input-error"
          :class="{ inline: serverError, hidden: !serverError }">
          {{ serverErrorMessage }}
        </span>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStep } from "@/composables/useAuthStep";
import { useAuthData } from "@/composables/useAuthData";
import { isValidPhone, toEnglishDigits, toInternationalPhone } from "@/utils/PhoneNumber";
import { useApiClient, toUserFacingError } from "~/services/apiClient";

const { phoneNumber: globalPhoneNumber, nationalId: globalNationalId, flow } = useAuthData();
const api = useApiClient();

const meliCode = ref("");
const phoneNumber = ref("");
const acceptedRules = ref(false);

const meliError = ref(false);
const phoneError = ref(false);
const serverError = ref(false);
const serverErrorMessage = ref("");
const loading = ref(false);

const emit = defineEmits(["onSuccess"]);
const { setStep } = useAuthStep();

// اعتبارسنجی ساده کد ملی (می‌تونی دقیق‌ترش رو پیاده‌کنی)
function validateMeli() {
  meliCode.value = toEnglishDigits(meliCode.value).replace(/\D/g, '');
  const valid = /^\d{10}$/.test(meliCode.value);
  meliError.value = !valid;
  return valid;
}

// اعتبارسنجی شماره تلفن
function validatePhone() {
  phoneNumber.value = toEnglishDigits(phoneNumber.value);
  const valid = isValidPhone(phoneNumber.value);
  phoneError.value = !valid;
  return valid;
}

const handleSubmit = async () => {
  serverError.value = false;
  serverErrorMessage.value = "";

  const meliValid = validateMeli();
  const phoneValid = validatePhone();
  const rulesAccepted = acceptedRules.value;

  if (!meliValid || !phoneValid || !rulesAccepted) {
    return;
  }

  loading.value = true;

  try {
    const response = await api.post("/auth/signup", {
      phoneNumber: toInternationalPhone(phoneNumber.value),
      nationalId: meliCode.value,
    });

    if (response.status === 200 || response.status === 201) {
      globalPhoneNumber.value = toInternationalPhone(phoneNumber.value);
      globalNationalId.value = meliCode.value;
      flow.value = "signup";
      emit("onSuccess");
    } else {
      serverError.value = true;
    }
  } catch (error) {
    console.error("Signup error:", error);
    serverError.value = true;
    const userError = toUserFacingError(error, "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.");
    serverErrorMessage.value = userError.info.status === 409
      ? "این شماره یا کد ملی قبلاً ثبت شده است. اگر حساب دارید، از بخش ورود استفاده کنید."
      : userError.info.status === 400 || userError.info.status === 422
        ? userError.message
        : userError.info.status && userError.info.status >= 500
          ? "سرویس ثبت‌نام موقتاً در دسترس نیست. چند دقیقه بعد دوباره تلاش کنید."
          : userError.message;
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  setStep(null);
};
</script>

<style scoped>
.rules-label { display:flex; width:100%; align-items:center; gap:.5rem; cursor:pointer; }
.rules-checkbox { accent-color:var(--color-brand-blue); cursor:pointer; }
.rules-text { margin-inline-start:.125rem; color:var(--color-text-body); font-size:.8rem; }
</style>
