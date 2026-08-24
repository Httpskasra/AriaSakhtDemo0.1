<script setup lang="ts">
import { ref } from "vue";
import { useAuthStep } from "@/composables/useAuthStep";
import { useAuthData } from "@/composables/useAuthData";
import { isValidPhone, toInternationalPhone } from "@/utils/PhoneNumber";
import { requestSignInOtp } from '~/services/authService';
import { toUserFacingError, UserFacingApiError } from '~/services/apiClient';

const phoneNumber = ref("");
const phoneError = ref(false);
const errorMessage = ref('شماره تماس وارد شده صحیح نمی‌باشد');
const isLoading = ref(false); // ✅ مرحله 1
const showSignupAction = ref(false);

const { phoneNumber: globalPhoneNumber, flow } = useAuthData();
const emit = defineEmits<{ onSuccess: []; goToSignup: [] }>();
const { setStep } = useAuthStep();

const validatePhone = (number: string): boolean => {
  return isValidPhone(number);
};

const handleSubmit = async () => {
  if (!validatePhone(phoneNumber.value)) {
    phoneError.value = true;
    errorMessage.value = 'شماره تماس وارد شده صحیح نمی‌باشد';
    return;
  }

  phoneError.value = false;
  showSignupAction.value = false;
  isLoading.value = true; // ✅ مرحله 2

  const formattedPhone = toInternationalPhone(phoneNumber.value);

  try {
    await requestSignInOtp(formattedPhone);
    globalPhoneNumber.value = formattedPhone;
    flow.value = "signin";
    emit("onSuccess");
  } catch (error) {
    const userError = error instanceof UserFacingApiError ? error : toUserFacingError(error);
    phoneError.value = true;
    showSignupAction.value = userError.info.status === 404;
    errorMessage.value = showSignupAction.value
      ? 'این شماره در سامانه ثبت نشده است. لطفاً ابتدا عضو شوید.'
      : userError.message;
  } finally {
    isLoading.value = false; // ✅ مرحله 3
  }
};

const closeModal = () => {
  setStep(null);
};
</script>

<template>
  <BaseModal @close="closeModal">
    <div class="auth-container">
      <img src="/logo/logo.png" alt="لوگوی تجاریس" class="auth-logo" />

      <form @submit.prevent.stop="handleSubmit" class="auth-form">
        <div class="auth-input-group">
          <label class="auth-input-label">
            <input
              type="text"
              v-model="phoneNumber"
              required
              placeholder="0912345678"
              class="auth-input-field" />
            <div class="auth-input-addon">
              <span>شماره تلفن</span>
            </div>
          </label>
          <span
            class="auth-input-error"
            :class="{ inline: phoneError, hidden: !phoneError }">
          {{ errorMessage }}
          </span>
          <UButton
            v-if="showSignupAction"
            type="button"
            variant="link"
            color="primary"
            size="sm"
            class="mt-1 self-start"
            @click="emit('goToSignup')"
          >
            رفتن به صفحه عضویت
          </UButton>
        </div>

        <UButton type="submit" color="primary" variant="solid" size="lg" block :disabled="isLoading">
          {{ isLoading ? "در حال ارسال..." : "ورود" }}
        </UButton>
      </form>

      <span class="auth-signup-hint">
        اگر تا حالا عضو سایت نشدید، با کلیک روی دکمه
        <UButton variant="link" size="xs" @click="emit('goToSignup')">عضویت</UButton>
        به جمع ما بپیوندید.
      </span>
    </div>
  </BaseModal>
</template>

<style scoped>
.auth-signup-hint { margin-top: .25rem; }
</style>
