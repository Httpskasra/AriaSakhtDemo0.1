<template>
  <BaseModal @close="closeModal">
    <div class="signup-container">
      <img src="/logo/logo.png" alt="Logo" class="logo-img" />

      <form @submit.prevent="handleSubmit" class="signup-form">
        <!-- کد ملی -->
        <div class="input-group">
          <label class="input-label">
            <input
              type="text"
              v-model="meliCode"
              required
              placeholder="مثال: 2665554789"
              class="input-field"
              @input="validateMeli" />
            <div class="input-addon">
              <span>کد ملی</span>
            </div>
          </label>
          <span
            class="input-error"
            :class="{ inline: meliError, hidden: !meliError }">
            کد ملی وارد شده صحیح نمی باشد
          </span>
        </div>

        <!-- شماره تلفن -->
        <div class="input-group">
          <label class="input-label">
            <input
              type="text"
              v-model="phoneNumber"
              required
              placeholder="مثال: 0912345678"
              class="input-field"
              @input="validatePhone" />
            <div class="input-addon">
              <span>شماره تلفن</span>
            </div>
          </label>
          <span
            class="input-error"
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
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "در حال ارسال..." : "عضویت" }}
        </button>

        <!-- خطای تطابق -->
        <span
          class="input-error"
          :class="{ inline: matchingError, hidden: !matchingError }">
          کد ملی وارد شده با شماره تماس مطابقت ندارد
        </span>

        <!-- خطای سرور -->
        <span
          class="input-error"
          :class="{ inline: serverError, hidden: !serverError }">
          خطا در ثبت‌نام، دوباره تلاش کنید.
        </span>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStep } from "@/composables/useAuthStep";
import { useAuthData } from "@/composables/useAuthData";

const { phoneNumber: globalPhoneNumber } = useAuthData();
const $axios = useNuxtApp().$axios;

const meliCode = ref("");
const phoneNumber = ref("");
const acceptedRules = ref(false);

const meliError = ref(false);
const phoneError = ref(false);
const matchingError = ref(false);
const serverError = ref(false);
const loading = ref(false);

const emit = defineEmits(["onSuccess"]);
const { setStep } = useAuthStep();

// اعتبارسنجی ساده کد ملی (می‌تونی دقیق‌ترش رو پیاده‌کنی)
function validateMeli() {
  const valid = /^[0-9]{10}$/.test(meliCode.value);
  meliError.value = !valid;
  return valid;
}

// اعتبارسنجی شماره تلفن
function validatePhone() {
  const valid = /^[9]{1}[0-9]{9}$/.test(phoneNumber.value);
  phoneError.value = !valid;
  return valid;
}

// تبدیل شماره به فرمت بین‌المللی مثل SignIn
function toInternationalPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "+98" + digits.slice(1);
  if (digits.startsWith("9")) return "+98" + digits;
  if (digits.startsWith("98")) return "+" + digits;
  return phone;
}

// چک تطابق شماره و کد ملی (مثال ساده، باید API بهتر باشه)
function checkMatching() {
  // فرض کن فقط شماره شروع‌شده با 09 و کد ملی معتبر رو تطابق می‌ده
  // اگر منطق پیچیده‌تری داری جایگزین کن
  matchingError.value = false;
  return true;
}

const handleSubmit = async () => {
  serverError.value = false;

  const meliValid = validateMeli();
  const phoneValid = validatePhone();
  const rulesAccepted = acceptedRules.value;
  const isMatching = checkMatching();

  if (!meliValid || !phoneValid || !rulesAccepted || !isMatching) {
    return;
  }

  loading.value = true;

  try {
    const response = await $axios.post("/auth/signup", {
      phoneNumber: toInternationalPhone(phoneNumber.value),
      nationalId: meliCode.value,
    });

    if (response.status === 200 || response.status === 201) {
      globalPhoneNumber.value = toInternationalPhone(phoneNumber.value);
      emit("onSuccess");
    } else {
      serverError.value = true;
    }
  } catch (error) {
    console.error("Signup error:", error);
    serverError.value = true;
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  setStep(null);
};
</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 400px;
  height: 60vh;
  padding: 16px 0;
  gap: 16px;
}

.logo-img {
  width: 180px;
  height: 160px;
  margin-bottom: 10px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 370px;
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
  font-family: "iran-yekan-num-Regular";
  background: rgba(128, 128, 128, 0.08);
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 15px;
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

.rules-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  width: 100%;
  justify-content: flex-start;
}

.rules-checkbox {
  cursor: pointer;
  accent-color: var(--blue-dark);
}

.rules-text {
  font-size: 12px;
  margin-right: 2px;
}

.submit-btn {
  background: var(--blue-dark);
  color: #fff;
  padding: 10px 28px;
  border-radius: 15px;
  font-size: 16px;
  margin-top: 8px;
  transition: opacity 0.2s;
  cursor: pointer;
  border: none;
  font-family: "iran-yekan-Bold";
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .signup-container {
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
  .signup-form {
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
  .submit-btn {
    font-size: 14px;
    padding: 8px 18px;
    margin-top: 4px;
  }
  .rules-text {
    font-size: 11px;
  }
}
</style>
