<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });
useHead({ title: "دسترسی غیرمجاز" });
</script>

<template>
  <main class="forbidden-page">
    <section class="forbidden-card" aria-labelledby="forbidden-title">
      <UIcon name="i-lucide-shield-alert" class="forbidden-card__icon" aria-hidden="true" />
      <p class="forbidden-card__code">خطای ۴۰۳</p>
      <h1 id="forbidden-title">دسترسی به این بخش ممکن نیست</h1>
      <p class="forbidden-card__message">
        حساب کاربری شما مجوز لازم برای مشاهده یا انجام این عملیات را ندارد.
      </p>
      <div class="forbidden-card__actions">
        <UButton to="/dashboard" color="primary">بازگشت به داشبورد</UButton>
        <UButton to="/" color="neutral" variant="outline">بازگشت به سایت</UButton>
      </div>
    </section>
  </main>
</template>

<style scoped>
.forbidden-page { display: grid; min-height: 60vh; place-items: center; padding: 4rem 1rem; text-align: center; }
.forbidden-card { display: grid; justify-items: center; gap: .75rem; width: min(100%, 42rem); padding: clamp(2rem, 5vw, 3rem); background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-dialog); box-shadow: var(--shadow-raised); }
.forbidden-card__icon { width: 3.5rem; height: 3.5rem; color: var(--color-warning-fg); }
.forbidden-card__code { margin: .75rem 0 0; color: var(--color-text-muted); font-size: .85rem; font-weight: 800; }
.forbidden-card h1 { margin: 0; color: var(--color-text-heading); font-size: clamp(1.35rem, 3vw, 1.8rem); font-weight: 900; }
.forbidden-card__message { max-width: 34rem; margin: 0; color: var(--color-text-body); line-height: var(--line-height-long-form); }
.forbidden-card__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; margin-top: 1rem; }
</style>
