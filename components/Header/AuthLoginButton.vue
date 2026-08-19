<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });

const { isAuthenticated, authStatus } = useUser();
const { setStep } = useAuthStep();

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
    :class="{ 'auth-login-button--compact': compact, 'auth-login-button--profile': isAuthenticated }"
    :square="compact"
    :aria-busy="authStatus === 'loading'"
    :aria-label="authStatus === 'loading' ? 'در حال بررسی حساب کاربری' : isAuthenticated ? 'پروفایل کاربری' : 'ورود یا ثبت‌نام'"
    @click="handleClick"
  >
    <UIcon
      :name="isAuthenticated ? 'i-lucide-user-round-check' : 'i-lucide-user'"
      class="size-5"
      aria-hidden="true" />
    <span v-if="!compact">{{ isAuthenticated ? 'حساب کاربری' : 'ورود / ثبت‌نام' }}</span>
  </UButton>
</template>

<style scoped>
.auth-login-button { min-height: 2.5rem; }
.auth-login-button:not(.auth-login-button--compact) { padding-inline: 1rem; }
.auth-login-button--compact { width: 2.5rem; padding-inline: 0; }
</style>
