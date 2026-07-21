<script setup lang="ts">
import { ref, reactive } from 'vue';
import { createCompany } from '~/services/companyService';

definePageMeta({
  middleware: ['dashboard-auth'],
  layout: 'dashboard'
});

const toast = useToast();
const router = useRouter();

const loading = ref(false);
const logoUrl = ref('');
const logoMeta = ref<{ filename: string; contentType: string; size: number } | null>(null);

const state = reactive({
  name: '',
  nationalId: '',
  registrationNumber: '',
  email: '',
  phone: '',
  address: ''
});

const onLogoUploaded = (data: { publicUrl: string; meta: any }) => {
  logoUrl.value = data.publicUrl;
  logoMeta.value = {
    filename: data.meta.filename,
    contentType: data.meta.contentType,
    size: data.meta.size
  };
};

const onSubmit = async () => {
  if (!state.name || !state.registrationNumber || !state.email) {
    toast.add({ title: 'خطا', description: 'لطفا فیلدهای اجباری را پر کنید', color: 'red' });
    return;
  }

  loading.value = true;
  try {
    const payload = {
      ...state,
      imageMeta: logoMeta.value || undefined
    };

    await createCompany(payload);
    
    toast.add({
      title: 'موفقیت',
      description: 'درخواست ثبت کسب‌وکار شما با موفقیت ارسال شد و در حال بررسی است.',
      color: 'green'
    });

    router.push('/dashboard');
  } catch (err: any) {
    toast.add({
      title: 'خطا در ثبت',
      description: err.response?.data?.message || 'مشکلی در ثبت کسب‌وکار پیش آمد',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2 font-yekan">ثبت‌نام تامین‌کننده (پنل فروشنده)</h1>
      <p class="text-gray-600">برای شروع فروش کالا در تجاریس، ابتدا باید مشخصات حقوقی یا حقیقی کسب‌وکار خود را تکمیل کنید.</p>
    </div>

    <UCard>
      <form @submit.prevent="onSubmit" class="space-y-6 text-right" dir="rtl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="نام شرکت یا کسب‌وکار" required>
            <UInput v-model="state.name" placeholder="مثال: شرکت فولاد آریا" icon="i-lucide-building" />
          </UFormGroup>

          <UFormGroup label="شناسه ملی / کد ملی" required>
            <UInput v-model="state.nationalId" placeholder="۱۰ رقم" icon="i-lucide-hash" />
          </UFormGroup>

          <UFormGroup label="شماره ثبت" required>
            <UInput v-model="state.registrationNumber" placeholder="شماره ثبت رسمی" icon="i-lucide-file-text" />
          </UFormGroup>

          <UFormGroup label="ایمیل سازمانی" required>
            <UInput v-model="state.email" type="email" placeholder="info@company.com" icon="i-lucide-mail" />
          </UFormGroup>

          <UFormGroup label="شماره تماس ثابت">
            <UInput v-model="state.phone" placeholder="۰۲۱XXXXXXXX" icon="i-lucide-phone" />
          </UFormGroup>

          <UFormGroup label="لوگو یا تصویر کسب‌وکار">
            <div class="flex items-center gap-4">
              <div v-if="logoUrl" class="w-16 h-16 rounded overflow-hidden border">
                <img :src="logoUrl" class="w-full h-full object-cover" />
              </div>
              <FileUpload 
                type="company" 
                label="انتخاب تصویر" 
                @uploaded="onLogoUploaded"
              />
            </div>
          </UFormGroup>
        </div>

        <UFormGroup label="آدرس دفتر مرکزی">
          <UTextarea v-model="state.address" placeholder="استان، شهر، خیابان ..." />
        </UFormGroup>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton 
            color="gray" 
            variant="ghost" 
            to="/dashboard"
          >
            انصراف
          </UButton>
          <UButton 
            type="submit" 
            color="primary" 
            size="lg" 
            :loading="loading"
            icon="i-lucide-check-circle"
          >
            تایید و ارسال درخواست
          </UButton>
        </div>
      </form>
    </UCard>

    <div class="mt-8 bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
      <UIcon name="i-lucide-info" class="size-6 text-blue-600 shrink-0 mt-0.5" />
      <div class="text-sm text-blue-800 leading-relaxed">
        <p class="font-bold mb-1">راهنما:</p>
        <p>پس از ارسال درخواست، کارشناسان ما ظرف مدت ۲۴ ساعت کاری مدارک شما را بررسی و پنل فروشندگی شما را فعال خواهند کرد. در صورت نیاز به راهنمایی بیشتر با پشتیبانی تماس بگیرید.</p>
      </div>
    </div>
  </div>
</template>
