<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });

const { isAuthenticated } = useUser();
const { authStep, setStep } = useAuthStep();

const handleClick = () => {
  if (isAuthenticated.value) {
    return navigateTo("/dashboard");
  }

  setStep("signin");
};
</script>

<template>
  <UButton
    color="primary"
    variant="soft"
    class="auth-login-button font-bold"
    :class="{ 'auth-login-button--compact': compact }"
    :square="compact"
    :aria-label="compact ? 'ورود یا ثبت‌نام' : 'ورود یا ثبت‌نام'"
    icon="i-lucide-user"
    @click="handleClick"
  >
    <span v-if="!compact">ورود / ثبت‌نام</span>
  </UButton>
  <ModalWrapper v-if="authStep" />
</template>

<style scoped>
.auth-login-button { min-height: 2.5rem; }
.auth-login-button:not(.auth-login-button--compact) { padding-inline: 1rem; }
.auth-login-button--compact { width: 2.5rem; }
</style>
