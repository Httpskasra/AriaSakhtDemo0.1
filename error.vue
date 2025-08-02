<!-- /pages/error.vue -->
<template>
  <NuxtLayout name="default">
    <div
      class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6 py-14 mt-[10%]">
      <h1
        class="text-7xl font-extrabold text-red-600 mb-6 animate-pulse"
        aria-label="Error Code">
        {{ error.statusCode }}
      </h1>
      <p
        class="text-3xl text-gray-800 mb-6 max-w-xl animate-fadeInUp"
        aria-label="Error Message">
        {{
          error.statusCode === 404
            ? "صفحه‌ای که دنبالش بودی پیدا نشد!"
            : "یه مشکلی پیش اومده!"
        }}
      </p>
      <br /><br />
      <img
        src="/error/404-error.png"
        alt="Error Illustration"
        class="h-[35vh] mb-8 animate-bounce" />

      <NuxtLink
        to="/"
        class="inline-block my-0 px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
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
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.7s ease forwards;
}
</style>
