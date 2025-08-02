<template>
  <BaseModal @close="closeModal">
    <div class="flex flex-col items-center justify-between h-[50vh] container">
      <img
        src="/logo/logo.png"
        alt="Logo"
        class="w-[180px] h-[160px] max-md:w-[70px] max-md:h-[50px]"
      />

      <form
        @submit.prevent="handleSubmit"
        class="h-[400px] w-full flex flex-col items-center justify-evenly"
      >
        <div class="w-full">
          <label
            class="font-['iran-yekan-num-Regular'] bg-gray-500/20 w-full dir-ltr h-[50px] flex justify-start items-center box-border rounded-[15px] cursor-pointer"
          >
            <input
              type="text"
              pattern="[0]{1}[9]{1}[0-9]{9}"
              required
              placeholder="مثال: 0912345678"
              class="bg-transparent h-full w-full px-5 focus:outline-none text-left"
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
          >
            شماره تماس وارد شده صحیح نمی باشد
          </span>
        </div>

        <button
          class="bg-[var(--blue-dark)] py-2.5 px-[18px] text-white rounded-[15px] relative top-3 hover:cursor-pointer"
          type="submit"
        >
          ورود
        </button>
      </form>

      <span class="text-sm text-blue-dark mt-2.5">
        اگر تا حالا عضو سایت نشدید، با کلیک روی دکمه
        <button
          class="text-blue-dark font-['iran-yekan-DemiBold'] py-0.5 px-1.5 border-b border-blue-dark cursor-pointer"
          @click="emit('goToSignup')"
        >
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

// Assuming BaseModal is a registered component
// import BaseModal from './BaseModal.vue';

const phoneError = ref<boolean>(true);

const emit = defineEmits(["onSuccess", "goToSignup"]);

const { setStep } = useAuthStep();

const handleSubmit = () => {
  // فرض کنیم که اطلاعات درست باشد
  if (phoneError.value) {
    // This logic should probably be inverted
    // وقتی اطلاعات درست است، به OTP می‌رویم
    emit("onSuccess"); // ایونت onSuccess که باید از parent گرفته شود
  } else {
    // در غیر این صورت، پیغام خطا یا هر چیزی که بخواهی می‌تونی مدیریت کنی.
  }
};

const closeModal = () => {
  setStep(null); // Reset the authStep to null to close the modal
};
</script>
