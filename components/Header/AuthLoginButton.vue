<template>
  <UButton 
    color="primary" 
    variant="soft" 
    class="px-5 font-bold"
    label="ورود / ثبت‌نام"
    icon="i-lucide-user"
    @click="handleClick"
  />
  <ModalWrapper v-if="authStep" />
</template>

<script setup lang="ts">
const { isAuthenticated } = useUser();
const { authStep, setStep } = useAuthStep();

const handleClick = () => {
  if (isAuthenticated.value) {
    return navigateTo("/dashboard");
  }

  setStep("signin");
};
</script>
