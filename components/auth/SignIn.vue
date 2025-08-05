<template>
  <BaseModal @close="closeModal">
    <div class="flex flex-col items-center justify-between h-[50vh] container">
      <img
        src="/logo/logo.png"
        alt="Logo"
        class="w-[180px] h-[160px] max-md:w-[70px] max-md:h-[50px]" />

      <form
        @submit.prevent="handleSubmit"
        class="h-[400px] w-full flex flex-col items-center justify-evenly">
        <div class="w-full">
          <label
            class="font-['iran-yekan-num-Regular'] bg-gray-500/20 w-full dir-ltr h-[50px] flex justify-start items-center box-border rounded-[15px] cursor-pointer">
            <input
              type="text"
              v-model="phoneNumber"
              pattern="[9]{1}[0-9]{9}"
              required
              placeholder="912345678"
              class="bg-transparent h-full w-full px-5 focus:outline-none text-left" />
            <div
              class="box-border bg-[var(--blue-dark)] flex items-center justify-center text-white text-sm px-[5px] h-full w-[100px] rounded-l-[15px]">
              <span>شماره تلفن</span>
            </div>
          </label>
          <span
            class="text-red-500 text-xs mt-1.5"
            :class="{ inline: phoneError, hidden: !phoneError }">
            شماره تماس وارد شده صحیح نمی‌باشد
          </span>
        </div>

        <button
          class="bg-[var(--blue-dark)] py-2.5 px-[18px] text-white rounded-[15px] relative top-3 hover:cursor-pointer"
          type="submit">
          ورود
        </button>
      </form>

      <span class="text-sm text-blue-dark mt-2.5">
        اگر تا حالا عضو سایت نشدید، با کلیک روی دکمه
        <button
          class="text-blue-dark font-['iran-yekan-DemiBold'] py-0.5 px-1.5 border-b border-blue-dark cursor-pointer"
          @click="emit('goToSignup')">
          عضویت
        </button>
        به جمع ما بپیوندید.
      </span>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStep } from "@/composables/useAuthStep";

const { $axios } = useNuxtApp();

const phoneNumber = ref("");
const phoneError = ref(false);

const emit = defineEmits(["onSuccess", "goToSignup"]);
const { setStep } = useAuthStep();

const validatePhone = (number: string): boolean => {
  return /^[9]{1}[0-9]{9}$/.test(number);
};

const toInternationalPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "+98" + digits.slice(1);
  if (digits.startsWith("9")) return "+98" + digits;
  if (digits.startsWith("98")) return "+" + digits;
  return phone;
};

const handleSubmit = async () => {
  if (!validatePhone(phoneNumber.value)) {
    phoneError.value = true;
    return;
  }

  phoneError.value = false;

  const formattedPhone = toInternationalPhone(phoneNumber.value);

  try {
    const response = await $axios.post("/auth/signin", {
      phoneNumber: formattedPhone, // اینجا شماره با +98 ارسال می‌شود
    });
  } catch (error) {
    console.error("Login error:", error);
  }
};
const closeModal = () => {
  setStep(null);
};
</script>
