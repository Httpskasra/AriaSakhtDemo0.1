<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });
useHead({ title: "دسترسی غیرمجاز" });
</script>

<template>
  <main class="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16 text-center">
    <section class="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12" aria-labelledby="forbidden-title">
      <UIcon name="i-lucide-shield-alert" class="mx-auto size-14 text-amber-500" aria-hidden="true" />
      <p class="mt-5 text-sm font-bold text-slate-500">خطای ۴۰۳</p>
      <h1 id="forbidden-title" class="mt-2 text-2xl font-black text-slate-900">دسترسی به این بخش ممکن نیست</h1>
      <p class="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
        حساب کاربری شما مجوز لازم برای مشاهده یا انجام این عملیات را ندارد.
      </p>
      <div class="mt-7 flex flex-wrap justify-center gap-3">
        <UButton to="/dashboard" color="primary">بازگشت به داشبورد</UButton>
        <UButton to="/" color="neutral" variant="outline">بازگشت به سایت</UButton>
      </div>
    </section>
  </main>
</template>
