<template>
  <BaseModal @close="closeModal">
    <div class="flex flex-col items-center justify-between h-[60vh] container">
      <img
        src="/logo/logo.png"
        alt="Logo"
        class="w-[180px] h-[160px] max-md:w-[70px] max-md:h-[50px]" />

      <form
        @submit.prevent="handleSubmit"
        class="h-[400px] w-full flex flex-col items-center justify-evenly">
        <div class="w-full">
          <label
            class="font-['iran-yekan-num-Regular'] bg-gray-500/20 w-full dir-ltr h-[50px] flex justify-between items-center box-border rounded-[15px] cursor-pointer">
            <input
              type="text"
              pattern="[0-9]{10}"
              required
              placeholder="مثال: 2665554789"
              class="bg-transparent h-full w-full px-5 focus:outline-none text-left" />
            <div
              class="box-border bg-[var(--blue-dark)] flex items-center justify-center text-white text-sm px-[18px] h-full w-[100px] rounded-l-[15px]">
              <span>کد ملی</span>
            </div>
          </label>
          <span
            class="text-red-500 text-xs mt-1.5"
            :class="{ inline: meliError, hidden: !meliError }">
            کد ملی وارد شده صحیح نمی باشد
          </span>
        </div>

        <div class="w-full">
          <label
            class="font-['iran-yekan-num-Regular'] bg-gray-500/20 w-full dir-ltr h-[50px] flex justify-between items-center box-border rounded-[15px] cursor-pointer">
            <input
              type="text"
              pattern="[0]{1}[9]{1}[0-9]{9}"
              required
              placeholder="مثال: 0912345678"
              class="bg-transparent h-full w-full px-5 focus:outline-none text-left" />
            <div
              class="box-border bg-[var(--blue-dark)] flex items-center justify-center text-white text-sm px-[5px] h-full w-[100px] rounded-l-[15px]">
              <span>شماره تلفن</span>
            </div>
          </label>
          <span
            class="text-red-500 text-xs mt-1.5"
            :class="{ inline: phoneError, hidden: !phoneError }">
            شماره تماس وارد شده صحیح نمی باشد
          </span>
        </div>

        <label class="flex items-center cursor-pointer">
          <span class="text-xs mx-1.5"
            >شرایط و قوانین را مطالعه کردم و قبول دارم</span
          >
          <input
            type="checkbox"
            value="promise"
            required
            class="cursor-pointer" />
        </label>

        <button
          type="submit"
          class="bg-[var(--blue-dark)] py-2.5 px-[18px] text-white rounded-[15px] relative top-3 hover:cursor-pointer">
          عضویت
        </button>

        <span
          class="text-red-500 text-xs -mt-1"
          :class="{ inline: matchingError, hidden: !matchingError }">
          کد ملی وارد شده با شماره تماس مطابقت ندارد
        </span>
      </form>
    </div>
    <button
      @close="closeModal"
      class="absolute top-4 right-4 text-gray-500 color-red hover:text-gray-800">
      Close
    </button>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStep } from "@/composables/useAuthStep";

// Assuming BaseModal is a registered component
// import BaseModal from './BaseModal.vue';

const phoneError = ref<boolean>(false); // Example value
const meliError = ref<boolean>(true); // Example value
const matchingError = ref<boolean>(false); // Example value

const emit = defineEmits(["onSuccess"]);

const { setStep } = useAuthStep();

const handleSubmit = () => {
  // Add your form validation and submission logic here
  const isFormValid =
    !phoneError.value && !meliError.value && !matchingError.value;
  if (isFormValid) {
    emit("onSuccess");
  }
};

const closeModal = () => {
  setStep(null); // Reset the authStep to null to close the modal
};
</script>
