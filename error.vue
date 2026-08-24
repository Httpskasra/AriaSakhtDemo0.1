<!-- /pages/error.vue -->
<template>
  <NuxtLayout name="default">
    <div class="error-page">
      <h1 class="error-page__code" aria-label="Error Code">
        {{ error.statusCode }}
      </h1>
      <p class="error-page__message" aria-label="Error Message">
        {{
          error.statusCode === 404
            ? "صفحه‌ای که دنبالش بودی پیدا نشد!"
            : "یه مشکلی پیش اومده!"
        }}
      </p>
      <img
        src="/error/404-error.png"
        alt="Error Illustration"
        class="error-page__illustration" />

      <NuxtLink
        to="/"
        class="error-page__link"
        aria-label="Back to Home">
        بازگشت به صفحه اصلی
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>();
</script>

<style scoped>
.error-page { display: grid; min-height: 100vh; place-items: center; align-content: center; gap: 1.25rem; padding: 3rem 1.5rem; background: var(--color-bg-app); text-align: center; }
.error-page__code { margin: 0; color: var(--color-danger-fg); font-size: clamp(3.5rem, 10vw, 7rem); font-weight: 900; line-height: 1; }
.error-page__message { max-width: 38rem; margin: 0; color: var(--color-text-heading); font-size: clamp(1.35rem, 4vw, 2rem); font-weight: 700; }
.error-page__illustration { width: min(100%, 28rem); max-height: 35vh; margin: .5rem 0 1rem; object-fit: contain; }
.error-page__link { display: inline-flex; align-items: center; justify-content: center; min-height: var(--control-height-md); padding: .65rem 2rem; border-radius: var(--radius-field); background: var(--color-brand-blue); color: var(--color-bg-surface); box-shadow: var(--shadow-raised); transition: background-color .16s ease, transform .16s ease; }
.error-page__link:hover { background: var(--color-brand-blue-hover); transform: translateY(-1px); }
</style>
