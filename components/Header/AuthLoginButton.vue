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
  <span v-if="authStatus === 'loading'" class="auth-login-placeholder" :class="{ 'auth-login-placeholder--compact': compact }" aria-hidden="true"></span>
  <UButton
    v-else
    color="primary"
    variant="soft"
    class="auth-login-button font-bold"
    :class="{ 'auth-login-button--compact': compact, 'auth-login-button--profile': isAuthenticated }"
    :aria-label="isAuthenticated ? 'پروفایل کاربری' : 'ورود یا ثبت‌نام'"
    @click="handleClick"
  >
    <UIcon
      name="i-lucide-user"
      class="size-5"
      aria-hidden="true" />
    <span v-if="!compact">{{ isAuthenticated ? 'حساب کاربری' : 'ورود / ثبت‌نام' }}</span>
  </UButton>
</template>

<style scoped>
.auth-login-button { min-height: 2.5rem; }
.auth-login-button:not(.auth-login-button--compact) { padding-inline: 1rem; }
.auth-login-button--compact { width: 2.5rem; padding-inline: 0; }
.auth-login-placeholder {
  display: inline-block;
  width: 7.5rem;
  min-height: 2.5rem;
  visibility: hidden;
}
.auth-login-placeholder--compact { width: 2.5rem; }
</style>
