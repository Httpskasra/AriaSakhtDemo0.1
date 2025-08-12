<!-- components/ModalWrapper.vue -->
<template>
  <!-- حذف modal-overlay و modal اضافی -->
  <SignIn
    v-if="authStep === 'signin'"
    @onSuccess="() => setStep('otp')"
    @goToSignup="setStep('signup')" />
  <SignUp v-if="authStep === 'signup'" @onSuccess="setStep('otp')" />
  <VerifyOtp v-if="authStep === 'otp'" @onVerified="setStep(null)" />
</template>

<script lang="ts" setup>
import { useAuthStep } from "@/composables/useAuthStep";
const { authStep, setStep } = useAuthStep();
</script>

<style scoped>
/* اگر استایل خاصی برای modal-overlay داشتی، حذف کن */
</style>
