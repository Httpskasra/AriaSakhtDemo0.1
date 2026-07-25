<template>
  <div class="relative">
    <!-- دکمه پشتیبانی -->
    <button
      @click="toggleChat"
      class="fixed bottom-20 md:bottom-6 right-6 bg-blue-600 text-white rounded-full px-4 py-4 shadow-lg hover:bg-blue-700 transition-colors z-50"
      aria-label="باز کردن چت پشتیبانی">
      <UIcon name="i-lucide-message-circle" class="size-icon-empty-state" />
      <!-- <Icon name="ic:outline-support-agent" size="36px" /> -->
    </button>

    <!-- پنجره چت -->
    <div
      v-if="isChatOpen"
      class="fixed inset-x-4 bottom-28 w-auto max-w-[calc(100vw-2rem)] md:bottom-20 md:left-auto md:right-6 md:w-80 md:max-w-none bg-white rounded-field shadow-xl z-50 border border-gray-200">
      <!-- هدر چت -->
      <div
        class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 class="text-lg font-semibold">پشتیبانی</h3>
        <button @click="toggleChat" class="text-white hover:text-gray-200">
          <UIcon name="i-lucide-x" class="size-icon-action" />
        </button>
      </div>

      <!-- بدنه چت -->
      <div class="p-4 h-64 overflow-y-auto">
        <!-- پیام‌های نمونه -->
        <div class="mb-2">
          <p class="text-sm text-gray-500">پشتیبانی - 10:30</p>
          <p class="bg-blue-100 p-2 rounded-field text-sm">
            سلام! چگونه می‌توانم به شما کمک کنم؟
          </p>
        </div>
        <div class="mb-2 text-right">
          <p class="text-sm text-gray-500">شما - 10:32</p>
          <p class="bg-gray-200 p-2 rounded-field text-sm">
            نیاز به کمک در مورد پروژه دارم.
          </p>
        </div>
      </div>

      <!-- فرم ارسال پیام -->
      <div class="p-4 border-t">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="message"
            type="text"
            placeholder="پیام خود را بنویسید..."
            class="flex-1 p-2 border rounded-field focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <button
            type="submit"
            class="bg-blue-600 text-white p-2 rounded-field hover:bg-blue-700 transition-colors"
            :disabled="!message.trim()"
            aria-label="ارسال پیام">
            <UIcon name="i-lucide-send" class="size-icon-action" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// مدیریت حالت باز/بسته شدن چت
const isChatOpen = ref(false);
const message = ref("");

// تابع برای باز و بسته کردن چت
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

// تابع موقت برای ارسال پیام (برای طراحی)
const sendMessage = () => {
  if (message.value.trim()) {
    //console.log("پیام:", message.value); // در آینده با API جایگزین می‌شود
    message.value = "";
  }
};
</script>

<style scoped>
/* استایل‌های اضافی در صورت نیاز */
</style>
