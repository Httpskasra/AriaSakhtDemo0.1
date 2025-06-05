<template>
  <BaseModal @close="closeModal">
    <div class="otp-wrapper">
      <img src="/logo/logo.webp" alt="" />
      <p class="title">
        کد 6 رقمی ارسال شده به شماره <span>09164532683</span> را وارد نمایید
      </p>
      <div class="code-inputs">
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
          :disabled="expired"
          required
        />
      </div>

      <div v-if="!expired" class="timer">
        🕒 زمان باقی‌مانده: {{ formattedTime }}
      </div>
      <div v-else class="expired-msg">⛔ کد منقضی شد</div>

      <!-- <div v-if="isComplete && !expired" class="result">
        ✅ کد وارد شده: <strong>{{ otpCode }}</strong>
      </div> -->

      <button
        class="send"
        @click="verifyOtp"
        :disabled="!isComplete || expired"
      >
        ارسال کد
      </button>
      <button class="send-again" @click="resetTimer" :disabled="!expired">
        ارسال دوباره کد
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
const inputs = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);

const duration = 10; // ثانیه
const timeLeft = ref(duration);
const timer = ref(null);

onMounted(() => {
  startTimer();
  otpRefs.value[0]?.focus();
});

watch(timeLeft, (val) => {
  if (val <= 0) {
    clearInterval(timer.value);
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
  clearInterval(timer.value);
  timeLeft.value = duration;
  timer.value = setInterval(() => {
    timeLeft.value--;
  }, 1000);
};

const resetTimer = () => {
  inputs.value = ["", "", "", "", "", ""];
  startTimer();
  otpRefs.value[0]?.focus();
};

const onInput = async (index) => {
  const value = inputs.value[index];
  if (!/^\d$/.test(value)) {
    inputs.value[index] = "";
    return;
  }

  // صبر کن تا DOM آپدیت بشه، بعد برو به input بعدی
  await nextTick();
  const next = otpRefs.value[index + 1];
  if (next) next.focus();
};

const onKeydown = (index, e) => {
  if (e.key === "Backspace" && !inputs.value[index]) {
    const prev = otpRefs.value[index - 1];
    if (prev) prev.focus();
  }
};

const otpCode = computed(() => inputs.value.join(""));
const isComplete = computed(() => inputs.value.every((val) => val !== ""));
const emit = defineEmits(["onVerified"]);
const verifyOtp = () => {
  if (otpCode.value === "123456") {
    // فرض کنیم کد درست است
    emit("onVerified");
  } else {
    // خطا
  }
};
import { useAuthStep } from "@/composables/useAuthStep";

const { authStep, setStep } = useAuthStep();

const closeModal = () => {
  setStep(null); // Reset the authStep to null to close the modal
};
</script>

<style scoped>
img {
  width: 180px;
  height: 160px;
  margin: auto;
}
.title {
  font-family: "iran-yekan-Light";
  width: 50%;
  text-align: center;
  margin: auto;
  padding: 15px 0;
  font-size: 16px;
  margin-bottom: 20px;
}
.title span {
  font-family: "iran-yekan-num-Regular";
  color: var(--blue-dark);
  border-bottom: 1px solid var(--blue-dark);
}
.otp-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}

.code-inputs {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-direction: row-reverse;
}

.code-inputs input {
  width: 45px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  border: 2px solid #aaa;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
  direction: ltr;
  color: var(--blue-dark);
  font-family: "iran-yekan-num-DemiBold";
}

.code-inputs input:focus {
  border-color: var(--blue-dark);
}

button.send {
  padding: 10px 20px;
  font-size: 16px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-again {
  position: absolute;
  position: absolute;
  left: 0;
  bottom: 130px;
}

button:disabled {
  color: #aaa;
  cursor: not-allowed;
}

.timer {
  font-family: "iran-yekan-num-Regular";
  font-size: 12px;
  color: #333;
}

.expired-msg {
  color: red;
  font-size: 14px;
}
.timer,
.expired-msg {
  position: absolute;
  right: 0;
  bottom: 130px;
}

.result {
  font-size: 18px;
  color: green;
}
</style>
