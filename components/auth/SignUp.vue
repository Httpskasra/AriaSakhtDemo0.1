<template>
  <BaseModal @close="closeModal">
    <div class="flex flex-col items-center justify-between h-[60vh] container">
      <img
        src="/logo/logo.png"
        alt="Logo"
        class="w-[180px] h-[160px] max-md:w-[70px] max-md:h-[50px]"
      />

      <form
        @submit.prevent="handleSubmit"
        class="h-[400px] w-full flex flex-col items-center justify-evenly"
      >
        <!-- کد ملی -->
        <div class="w-full">
          <label
            class="font-['iran-yekan-num-Regular'] bg-gray-500/20 w-full dir-ltr h-[50px] flex justify-between items-center box-border rounded-[15px] cursor-pointer"
          >
            <input
              type="text"
              v-model="meliCode"
              required
              placeholder="مثال: 2665554789"
              class="bg-transparent h-full w-full px-5 focus:outline-none text-left"
              @input="validateMeli"
            />
            <div
              class="box-border bg-[var(--blue-dark)] flex items-center justify-center text-white text-sm px-[18px] h-full w-[100px] rounded-l-[15px]"
            >
              <span>کد ملی</span>
            </div>
          </label>
          <span
            class="text-red-500 text-xs mt-1.5"
            :class="{ inline: meliError, hidden: !meliError }"
            >کد ملی وارد شده صحیح نمی باشد</span
          >
        </div>

        <!-- شماره تلفن -->
        <div class="w-full">
          <label
            class="font-['iran-yekan-num-Regular'] bg-gray-500/20 w-full dir-ltr h-[50px] flex justify-between items-center box-border rounded-[15px] cursor-pointer"
          >
            <input
              type="text"
              v-model="phoneNumber"
              required
              placeholder="مثال: 0912345678"
              class="bg-transparent h-full w-full px-5 focus:outline-none text-left"
              @input="validatePhone"
            />
            <div
              class="box-border bg-[var(--blue-dark)] flex items-center justify-center text-white text-sm px-[5px] h-full w-[100px] rounded-l-[15px]"
            >
              <span>شماره تلفن</span>
            </div>
          </label>
          <span
            class="text-red-500 text-xs mt-1.5"
            :class="{ inline: phoneError, hidden: !phoneError }"
            >شماره تماس وارد شده صحیح نمی باشد</span
          >
        </div>

        <!-- قبول قوانین -->
        <label class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            v-model="acceptedRules"
            required
            class="cursor-pointer"
          />
          <span class="text-xs mx-1.5"
            >شرایط و قوانین را مطالعه کردم و قبول دارم</span
          >
        </label>

        <!-- دکمه ارسال -->
        <button
          type="submit"
          class="bg-[var(--blue-dark)] py-2.5 px-[18px] text-white rounded-[15px] relative top-3 hover:cursor-pointer"
          :disabled="loading"
        >
          {{ loading ? "در حال ارسال..." : "عضویت" }}
        </button>

        <!-- خطای تطابق -->
        <span
          class="text-red-500 text-xs -mt-1"
          :class="{ inline: matchingError, hidden: !matchingError }"
          >کد ملی وارد شده با شماره تماس مطابقت ندارد</span
        >

        <!-- خطای سرور -->
        <span
          class="text-red-500 text-xs -mt-1"
          :class="{ inline: serverError, hidden: !serverError }"
          >خطا در ثبت‌نام، دوباره تلاش کنید.</span
        >
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
