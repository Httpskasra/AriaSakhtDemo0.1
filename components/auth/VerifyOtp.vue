<template>
  <BaseModal @close="closeModal">
    <div class="relative flex flex-col items-center gap-5 otp-wrapper">
      <img src="/logo/logo.png" alt="Logo" class="w-[180px] h-[160px] mx-auto" />

      <p
        class="font-['iran-yekan-Light'] w-1/2 text-center mx-auto py-[15px] text-base mb-5"
      >
        کد 4 رقمی ارسال شده به شماره
        <span
          class="font-['iran-yekan-num-Regular'] text-blue-dark border-b border-blue-dark"
          >{{phoneNumber}}</span
        >
        را وارد نمایید
      </p>

      <div class="flex flex-row-reverse justify-center gap-5 code-inputs">
        <input
          v-for="(value, index) in inputs"
          :key="index"
          type="text"
          maxlength="1"
          pattern="[0-9]{1}"
          v-model="inputs[index]"
          ref="otpRefs"
          @input="onInput(index)"
          @keydown="onKeydown(index, $event)"
          :disabled="expired || loading"
          required
          class="w-[45px] h-[50px] text-xl text-center border-2 border-gray-400 rounded-lg outline-none transition-colors duration-200 ease-in-out dir-ltr text-blue-dark font-['iran-yekan-num-DemiBold'] focus:border-blue-dark disabled:bg-gray-200 disabled:cursor-not-allowed"
        />
      </div>

      <div
        v-if="!expired"
        class="absolute right-0 bottom-[130px] font-['iran-yekan-num-Regular'] text-xs text-gray-800"
      >
        🕒 زمان باقی‌مانده: {{ formattedTime }}
      </div>
      <div v-else class="absolute right-0 bottom-[130px] text-red-500 text-sm">
        ⛔ کد منقضی شد
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>

      <button
        class="py-2.5 px-5 text-base bg-blue-500 text-white rounded-lg cursor-pointer transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        @click="verifyOtp"
        :disabled="!isComplete || expired || loading"
      >
        {{ loading ? "در حال ارسال..." : "ارسال کد" }}
      </button>

      <button
        class="absolute left-0 bottom-[130px] bg-transparent border-none text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
        @click="resetTimer"
        :disabled="!expired || loading"
      >
        ارسال دوباره کد
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from "vue";
import { useAuthStep } from "@/composables/useAuthStep";
import { useAuthData } from "@/composables/useAuthData";
import { useAuthStore } from "@/stores/auth";
const { phoneNumber } = useAuthData();
const inputs = ref(Array(4).fill(""));
const otpRefs = ref<(HTMLInputElement | null)[]>([]);

const duration = 120; // 2 دقیقه
const timeLeft = ref(duration);
const timer = ref<number | null>(null);

const loading = ref(false);
const errorMessage = ref("");

const $axios = useNuxtApp().$axios;

onMounted(() => {
  startTimer();
  nextTick(() => otpRefs.value[0]?.focus());
});

watch(timeLeft, (val) => {
  if (val <= 0) {
    clearInterval(timer.value!);
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

const startTimer = () => {
  clearInterval(timer.value!);
  timeLeft.value = duration;
  timer.value = setInterval(() => {
    timeLeft.value--;
  }, 1000) as unknown as number;
};

const resetTimer = () => {
  inputs.value = Array(4).fill("");
  errorMessage.value = "";
  startTimer();
  nextTick(() => otpRefs.value[0]?.focus());
};

const onInput = async (index: number) => {
  const value = inputs.value[index];
  if (!/^\d$/.test(value)) {
    inputs.value[index] = "";
    return;
  }
  await nextTick();
  const next = otpRefs.value[index + 1];
  if (next) next.focus();
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
    // درخواست به سرور ارسال کن (آدرس و payload رو با بک‌اند چک کن)
    const response = await $axios.post("/auth/verify-otp", {
       phoneNumber: phoneNumber.value,
       otp: otpCode.value,
    });

    if (response.status === 200) {
      const authStore = useAuthStore();
      authStore.setTokens(
      response.data.accessToken,
      response.data.refreshToken
);
      emit("onVerified");
    } else {
      errorMessage.value = "کد وارد شده اشتباه است.";
    }
  } catch (err) {
    errorMessage.value = "خطا در اعتبارسنجی کد. دوباره تلاش کنید.";
  } finally {
    loading.value = false;
  }
};

const { setStep } = useAuthStep();

const closeModal = () => {
  setStep(null);
};
</script>
