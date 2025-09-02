<template>
  <NuxtLayout>
    <div
      class="bg-gradient-to-br from-[#f8fafc] via-[#f8fafc] to-[#e0e7ef] pt-12 pb-8 text-center rounded-b-3xl shadow-lg"
    >
      <div class="flex flex-col items-center">
        <span class="material-icons text-[#1976d2] text-5xl mb-2">mail</span>
        <h1 class="text-3xl font-bold text-[#2c3e50] mb-2">تماس با ما</h1>
        <p class="text-[#607d8b] text-base">
          در صورت هرگونه سوال یا نیاز به مشاوره، با ما در ارتباط باشید.
        </p>
      </div>
    </div>
    <div class="mx-auto mt-8 px-4 w-full md:w-3/4">
      <form class="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >نام و نام خانوادگی</label
          >
          <input
            type="text"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="نام شما"
          />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >ایمیل</label
          >
          <input
            type="email"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="ایمیل شما"
          />
        </div>
        <div>
          <label class="block mb-2 text-right font-semibold text-[#1976d2]"
            >پیام</label
          >
          <textarea
            rows="4"
            class="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
            placeholder="متن پیام"
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-[#1976d2] text-white rounded-lg py-3 font-bold hover:bg-[#125ea7] transition"
        >
          ارسال پیام
        </button>
      </form>
      <div class="mt-8 text-center text-[#607d8b]">
        <div class="flex flex-col gap-2 items-center">
          <div>
            <span class="material-icons align-middle text-[#1976d2]">call</span>
            <span class="mr-2">+989026995994</span>
          </div>
          <div>
            <span class="material-icons align-middle text-[#1976d2]"
              >location_on</span
            >
            <span class="mr-2">استان فارس ، شهعرستان شیراز ، شهرک کوثر ، رحمت ، کوچه (کاکتوس) ، کوچه (نرگس) پلاک 0و طبثه 1 و کد پستی 7158681439۱۲۳</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts"></script>

<style scoped>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
</style>
