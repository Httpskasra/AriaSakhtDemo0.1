<!-- components/ModalWrapper.vue -->
<template>
  <div v-if="authStep" class="modal-overlay">
    <div class="modal">
      <SignIn
        v-if="authStep === 'signin'"
        @onSuccess="() => setStep('otp')"
        @goToSignup="setStep('signup')"
      />
      <SignUp v-if="authStep === 'signup'" @onSuccess="setStep('otp')" />
      <VerifyOtp v-if="authStep === 'otp'" @onVerified="setStep(null)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStep } from "@/composables/useAuthStep";

const { authStep, setStep } = useAuthStep();
</script>

<style scoped>
/* استایل‌های مودال */
</style>