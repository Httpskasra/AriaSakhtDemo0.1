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
  flow.value = null;
  setStep(null);
};
</script>

<template>
  <BaseModal @close="closeModal">
    <div class="signin-container">
      <img src="/logo/logo.png" alt="Logo" class="logo-img" />

      <form @submit.prevent.stop="handleSubmit" class="signin-form">
        <div class="input-group">
          <label class="input-label">
            <input
              type="text"
              v-model="phoneNumber"
              required
              placeholder="0912345678"
              class="input-field" />
            <div class="input-addon">
              <span>شماره تلفن</span>
            </div>
          </label>
          <span
            class="input-error"
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

      <span class="signup-hint">
        اگر تا حالا عضو سایت نشدید، با کلیک روی دکمه
        <UButton variant="link" size="xs" @click="emit('goToSignup')">عضویت</UButton>
        به جمع ما بپیوندید.
      </span>
    </div>
  </BaseModal>
</template>

<style scoped>
.signin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 350px;
  height: 50vh;
  padding: 16px 0;
  gap: 16px;
}

.logo-img {
  width: 180px;
  height: 160px;
  margin-bottom: 10px;
}
.signin-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 350px;
  gap: 18px;
  padding: 0 8px;
}
.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.input-label {
  /* Specialized auth input shell; shares field radius and typography tokens with Nuxt UI inputs. */
  font-family: var(--font-num);
  background: rgba(128, 128, 128, 0.08);
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: var(--radius-field);
  cursor: pointer;
  overflow: hidden;
}
.input-field {
  background: transparent;
  height: 100%;
  width: 100%;
  padding: 0 12px;
  font-size: 16px;
  border: none;
  outline: none;
  text-align: left;
}
.input-addon {
  background: var(--blue-dark);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  padding: 0 14px;
  height: 100%;
  min-width: 90px;
  border-radius: 0 15px 15px 0;
}
.input-error {
  color: #f87171;
  font-size: 12px;
  margin-top: 2px;
}
.signup-hint {
  font-size: 13px;
  color: var(--blue-dark);
  margin-top: 10px;
  text-align: center;
}
@media (max-width: 768px) {
  .signin-container {
    min-height: 250px;
    height: auto;
    padding: 8px 0;
    gap: 10px;
  }
  .logo-img {
    width: 70px;
    height: 50px;
    margin-bottom: 4px;
  }
  .signin-form {
    max-width: 95vw;
    gap: 12px;
    padding: 0 2px;
  }
  .input-label {
    height: 40px;
    font-size: 13px;
  }
  .input-field {
    font-size: 14px;
    padding: 0 6px;
  }
  .input-addon {
    font-size: 11px;
    min-width: 70px;
    padding: 0 6px;
  }
  .signup-hint {
    font-size: 12px;
    margin-top: 6px;
  }
}
</style>
