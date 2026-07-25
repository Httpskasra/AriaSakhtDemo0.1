<template>
    <div
      class="bg-gradient-to-br from-[#f8fafc] via-[#f8fafc] to-[#e0e7ef] pt-12 pb-8 text-center rounded-b-3xl shadow-lg">
      <div class="flex flex-col items-center">
        <UIcon name="i-lucide-mail" class="text-primary size-icon-hero mb-2" />
        <h1 class="text-3xl font-bold text-heading mb-2">تماس با ما</h1>
        <p class="text-muted text-base">
          در صورت هرگونه سوال یا نیاز به مشاوره، با ما در ارتباط باشید.
        </p>
      </div>
    </div>
    <div class="mx-auto mt-8 px-4 w-full md:w-3/4">
      <UForm @submit.prevent="submit" :state="contactForm" class="premium-card p-8 flex flex-col gap-6">
        <UFormField label="نام و نام خانوادگی" name="name">
          <UInput v-model="contactForm.name" placeholder="نام شما" />
        </UFormField>
        <UFormField label="ایمیل" name="email">
          <UInput v-model="contactForm.email" type="email" placeholder="ایمیل شما" />
        </UFormField>
        <UFormField label="پیام" name="message">
          <UTextarea v-model="contactForm.message" :rows="4" placeholder="متن پیام" />
        </UFormField>
        <div v-if="error" class="text-red-600 text-sm text-right">{{ error }}</div>
        <div v-if="success" class="text-green-600 text-sm text-right">{{ success }}</div>
        <UButton type="submit" size="lg" block :loading="loading">
          ارسال پیام
        </UButton>
      </UForm>
      <div class="mt-8 text-center text-muted">
        <div class="flex flex-col gap-2 items-center">
          <div>
            <UIcon name="i-lucide-phone" class="inline-block align-middle text-primary size-icon-inline" />
            <span class="mr-2 number">+989026995994</span>
          </div>
          <div>
            <UIcon name="i-lucide-map-pin" class="inline-block align-middle text-primary size-icon-inline" />
            <span class="mr-2"
              >استان فارس ، شهرستان شیراز ، شهرک کوثر ، رحمت ، کوچه (کاکتوس) ،
              کوچه (نرگس) پلاک 0و طبقه 1 و کد پستی 7158681439۱۲۳</span
            >
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { sendContactInquiry } from '~/services/contactService';

const contactForm = reactive({
  name: '',
  email: '',
  message: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const resetForm = () => {
  contactForm.name = '';
  contactForm.email = '';
  contactForm.message = '';
};

const submit = async () => {
  error.value = null;
  success.value = null;
  loading.value = true;
  try {
    await sendContactInquiry({
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
    });
    success.value = 'پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس می‌گیریم.';
    resetForm();
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'خطا در ارسال پیام. لطفا دوباره تلاش کنید.';
  } finally {
    loading.value = false;
  }
};

useHead({
  title: 'ارتباط با ما',
});
</script>

<style scoped>
span.number {
  direction: ltr;
  unicode-bidi: embed;
  font-family: var(--font-num);
}
</style>
