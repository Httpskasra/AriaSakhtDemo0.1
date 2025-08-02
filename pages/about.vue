<template>
  <NuxtLayout>
    <div
      class="bg-gradient-to-br from-[#f8fafc] via-[#f8fafc] to-[#e0e7ef] pt-12 pb-8 text-center rounded-b-3xl shadow-lg">
      <div class="flex flex-col items-center">
        <img
          src="/logo/logo.png"
          alt="آریا ساخت"
          class="w-[90px] h-[90px] rounded-full mb-4 shadow-md bg-white object-contain" />
        <h1 class="text-3xl font-bold text-[#2c3e50] mb-2">
          درباره <span class="text-[#1976d2]">آریا ساخت</span>
        </h1>
        <p class="text-[#607d8b] text-base">
          خانه‌ای برای بهترین خدمات و محصولات ساختمانی
        </p>
      </div>
    </div>
    <div class="max-w-3xl mx-auto mt-8 px-4 flex flex-col gap-8">
      <section
        class="flex items-start bg-white rounded-2xl shadow-md p-8 gap-6 transition-shadow hover:shadow-xl">
        <div
          class="flex items-center justify-center min-w-[56px] min-h-[56px] bg-[#1976d2] text-white rounded-full text-3xl shadow-md mt-1 transition-all">
          <span class="material-icons">flag</span>
        </div>
        <div>
          <h2 class="text-[#1976d2] mb-2 text-lg font-semibold">ماموریت ما</h2>
          <p>
            ارائه محصولات با کیفیت و خدمات مشاوره‌ای به مشتریان عزیز در سراسر
            کشور، با تکیه بر تخصص و نوآوری.
          </p>
        </div>
      </section>
      <section
        class="flex items-start bg-gradient-to-l from-[#f5fafd] via-[#f5fafd] to-[#e3f2fd] rounded-2xl shadow-md p-8 gap-6 transition-shadow hover:shadow-xl">
        <div
          class="flex items-center justify-center min-w-[56px] min-h-[56px] bg-[#1976d2] text-white rounded-full text-3xl shadow-md mt-1 transition-all">
          <span class="material-icons">groups</span>
        </div>
        <div>
          <h2 class="text-[#1976d2] mb-2 text-lg font-semibold">تیم ما</h2>
          <ul class="pr-4 list-none m-0">
            <li class="mb-1 text-base">
              <b>علی رضایی</b>
              <span class="text-[#607d8b] text-sm mr-2">مدیرعامل</span>
            </li>
            <li class="mb-1 text-base">
              <b>سارا محمدی</b>
              <span class="text-[#607d8b] text-sm mr-2">مدیر فروش</span>
            </li>
            <li class="mb-1 text-base">
              <b>مهدی کریمی</b>
              <span class="text-[#607d8b] text-sm mr-2">پشتیبانی</span>
            </li>
          </ul>
        </div>
      </section>
      <section
        class="flex items-start bg-white rounded-2xl shadow-md p-8 gap-6 transition-shadow hover:shadow-xl">
        <div
          class="flex items-center justify-center min-w-[56px] min-h-[56px] bg-[#1976d2] text-white rounded-full text-3xl shadow-md mt-1 transition-all">
          <span class="material-icons">mail</span>
        </div>
        <div>
          <h2 class="text-[#1976d2] mb-2 text-lg font-semibold">
            ارتباط با ما
          </h2>
          <p>
            برای ارتباط با ما می‌توانید از طریق صفحه
            <NuxtLink to="/contact" class="text-[#1976d2] underline font-bold"
              >تماس با ما</NuxtLink
            >
            اقدام کنید.
          </p>
        </div>
      </section>
      <!-- بخش جدید اعتماد کسب‌وکارها -->
      <section
        class="flex items-center bg-gradient-to-l from-[#f8fafc] via-[#f8fafc] to-[#e0f7fa] rounded-2xl shadow-md p-8 gap-6 transition-shadow hover:shadow-xl flex-wrap">
        <div
          class="flex items-center justify-center min-w-[56px] min-h-[56px] bg-[#1976d2] text-white rounded-full text-3xl shadow-md transition-all">
          <span class="material-icons">verified</span>
        </div>
        <div class="flex-1 w-full">
          <h2 class="text-[#1976d2] mb-2 text-lg font-semibold">
            کسب‌وکارهایی که به ما اعتماد کردند
          </h2>
          <div
            class="flex flex-wrap gap-6 mt-4 items-center justify-start sm:justify-center">
            <img
              src="/companies/images.png"
              alt="لوگو ۱"
              class="w-20 h-12 object-contain bg-white rounded-lg shadow p-2 transition-transform hover:scale-105 hover:-rotate-2" />
            <img
              src="/companies/images.png"
              alt="لوگو ۲"
              class="w-20 h-12 object-contain bg-white rounded-lg shadow p-2 transition-transform hover:scale-105 hover:-rotate-2" />
            <img
              src="/companies/images.png"
              alt="لوگو ۳"
              class="w-20 h-12 object-contain bg-white rounded-lg shadow p-2 transition-transform hover:scale-105 hover:-rotate-2" />
            <img
              src="/companies/images.png"
              alt="لوگو ۴"
              class="w-20 h-12 object-contain bg-white rounded-lg shadow p-2 transition-transform hover:scale-105 hover:-rotate-2" />
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts"></script>

<!-- هیچ استایلی نیاز نیست، همه چیز با کلاس‌های Tailwind انجام شده است -->
<style scoped>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
</style>
