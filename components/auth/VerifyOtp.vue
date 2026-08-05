<template>
  <BaseModal @close="closeModal">
    <div class="otp-wrapper">
      <img
        src="/logo/logo.png"
        alt="Logo"
        class="otp-logo" />

      <p class="otp-message">
        کد ۴ رقمی ارسال شده به شماره
        <span class="otp-phone">
          {{ phoneNumber }}
        </span>
        را وارد نمایید
      </p>

      <div class="code-inputs">
        <!-- Specialized OTP digit boxes keep per-character focus and paste behavior. -->
        <input
          v-for="(value, index) in inputs"
          :key="index"
          type="text"
          maxlength="1"
          inputmode="numeric"
          autocomplete="one-time-code"
          v-model="inputs[index]"
          ref="otpRefs"
          @input="onInput(index)"
          @paste.prevent="onPaste(index, $event)"
          @keydown="onKeydown(index, $event)"
          :disabled="expired || loading"
          required
          class="otp-input" />
      </div>

      <div class="otp-meta">
        <div v-if="!expired" class="otp-timer">
          زمان باقی‌مانده: {{ formattedTime }}
        </div>
        <div v-else class="otp-expired">
          کد منقضی شد
        </div>

        <button
          type="button"
          class="otp-resend"
          @click="resetTimer"
          :disabled="!expired || loading">
          ارسال دوباره کد
        </button>
      </div>

      <p v-if="errorMessage" class="otp-error" role="alert">{{ errorMessage }}</p>

      <button
        class="otp-submit"
        @click="verifyOtp"
        :disabled="!isComplete || expired || loading">
        {{ loading ? "در حال ارسال..." : "ارسال کد" }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import { useAuthStep } from "@/composables/useAuthStep";
import { useAuthData } from "@/composables/useAuthData";
import { useAuthStore } from "@/stores/auth";
import { useUser } from "@/composables/useUser";
import { toEnglishDigits } from "@/utils/PhoneNumber";
import { toUserFacingError } from "~/services/apiClient";

const { phoneNumber } = useAuthData();
const inputs = ref(Array(4).fill(""));
const otpRefs = ref<(HTMLInputElement | null)[]>([]);

const duration = 120;
const timeLeft = ref(duration);
const timer = ref<ReturnType<typeof setInterval> | null>(null);

const loading = ref(false);
const errorMessage = ref("");

const $axios = useNuxtApp().$axios;
const toast = useToast();
const { fetchUser } = useUser();

onMounted(() => {
  startTimer();
  // resendOtp();
  nextTick(() => otpRefs.value[0]?.focus());
});

watch(timeLeft, (val) => {
  if (val <= 0) {
    clearTimer();
    timeLeft.value = 0;
  }
});

const formattedTime = computed(() => {
  const min = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, "0");
  const sec = (timeLeft.value % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
});

const expired = computed(() => timeLeft.value <= 0);

const clearTimer = () => {
  if (timer.value !== null) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const startTimer = () => {
  clearTimer();
  timeLeft.value = duration;
  timer.value = setInterval(() => {
    timeLeft.value--;
  }, 1000);
};

const resendOtp = async () => {
  try {
    loading.value = true;
    await $axios.post("/auth/signin", {
      phoneNumber: phoneNumber.value,
    });
  } catch (err) {
    toast.add({ title: "ارسال دوباره کد ناموفق بود", description: "لطفاً دوباره تلاش کنید.", color: "error" });
  } finally {
    loading.value = false;
  }
};

const resetTimer = async () => {
  inputs.value = Array(4).fill("");
  errorMessage.value = "";
  loading.value = false;
  startTimer();
  await resendOtp();
  nextTick(() => otpRefs.value[0]?.focus());
};

onUnmounted(clearTimer);

const onInput = async (index: number) => {
  const value = toEnglishDigits(inputs.value[index] || "").replace(/\D/g, "");
  inputs.value[index] = value.slice(-1);
  if (!inputs.value[index]) {
    inputs.value[index] = "";
    return;
  }
  await nextTick();
  const next = otpRefs.value[index + 1];
  if (next) next.focus();
};

const onPaste = async (index: number, event: ClipboardEvent) => {
  const pasted = toEnglishDigits(event.clipboardData?.getData("text") || "")
    .replace(/\D/g, "")
    .slice(0, inputs.value.length - index);
  if (!pasted) return;
  pasted.split("").forEach((digit, offset) => {
    inputs.value[index + offset] = digit;
  });
  await nextTick();
  otpRefs.value[Math.min(index + pasted.length, inputs.value.length - 1)]?.focus();
};

const onKeydown = (index: number, e: KeyboardEvent) => {
  if (e.key === "Backspace" && !inputs.value[index]) {
    const prev = otpRefs.value[index - 1];
    if (prev) prev.focus();
  }
};

const otpCode = computed(() => inputs.value.join(""));
const isComplete = computed(() => inputs.value.every((val) => val !== ""));

const emit = defineEmits(["onVerified"]);

const verifyOtp = async () => {
  if (!isComplete.value) return;
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await $axios.post("/auth/verify-otp", {
      phoneNumber: phoneNumber.value,
      otp: otpCode.value,
    });

    if (response.status === 200 || response.status === 201) {
      const authStore = useAuthStore();
      authStore.setTokens(
        response.data.accessToken,
        response.data.csrfToken
      );
      await fetchUser(true);
      emit("onVerified");
    } else {
      errorMessage.value = "کد واردشده معتبر نیست. کد جدید دریافت کنید و دوباره تلاش کنید.";
    }
  } catch (err) {
    const userError = toUserFacingError(err, "اعتبارسنجی کد انجام نشد.");
    errorMessage.value = userError.info.status === 400 || userError.info.status === 401
      ? "کد واردشده اشتباه یا منقضی شده است. کد را بررسی کنید یا کد جدید بگیرید."
      : userError.message;
  } finally {
    loading.value = false;
  }
};

const { setStep } = useAuthStep();

const closeModal = () => {
  setStep(null);
};
</script>

<style scoped>
.otp-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 8px 0 4px;
}

.otp-logo {
  width: min(180px, 70vw);
  height: auto;
  max-height: 160px;
  object-fit: contain;
}

.otp-message {
  width: min(100%, 360px);
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: var(--font-yekan);
  font-size: 1rem;
  line-height: 1.8;
}

.otp-phone {
  font-family: var(--font-num);
  color: var(--blue-dark);
  border-bottom: 1px solid var(--blue-dark);
  direction: ltr;
  unicode-bidi: isolate;
}

.code-inputs {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  gap: clamp(6px, 3vw, 14px);
  width: 100%;
}

.otp-input {
  width: clamp(40px, 13vw, 45px);
  height: clamp(44px, 14vw, 50px);
  border: 2px solid #9ca3af;
  border-radius: var(--radius-field);
  color: var(--blue-dark);
  direction: ltr;
  font-family: var(--font-num);
  font-size: 1.25rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.otp-input:focus {
  border-color: var(--blue-dark);
}

.otp-input:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}

.otp-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(100%, 360px);
  min-height: 28px;
  font-size: 0.8125rem;
}

.otp-error {
  width: min(100%, 360px);
  margin: 0;
  padding: .65rem .8rem;
  border: 1px solid #fecaca;
  border-radius: var(--radius-field);
  background: #fef2f2;
  color: #b91c1c;
  font-size: .8rem;
  line-height: 1.7;
  text-align: center;
}

.otp-timer {
  color: #1f2937;
  font-family: var(--font-num);
}

.otp-expired {
  color: #ef4444;
}

.otp-resend {
  border: 0;
  background: transparent;
  color: var(--color-brand-blue);
  cursor: pointer;
  padding: 4px 0;
}

.otp-resend:hover:not(:disabled) {
  text-decoration: underline;
}

.otp-resend:disabled {
  color: #9ca3af;
  cursor: not-allowed;
  text-decoration: none;
}

.otp-submit {
  border: 0;
  border-radius: var(--radius-field);
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.otp-submit:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .otp-logo {
    width: min(140px, 55vw);
    max-height: 120px;
  }

  .code-inputs {
    gap: 6px;
  }

  .otp-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
