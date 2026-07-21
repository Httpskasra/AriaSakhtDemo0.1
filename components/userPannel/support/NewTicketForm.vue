<script setup lang="ts">
import { reactive, ref } from 'vue';
import { createTicket } from '~/services/ticketService';
import type { TicketPriority } from '~/services/ticketService';

const emit = defineEmits(['success', 'cancel']);
const toast = useToast();
const loading = ref(false);

const state = reactive({
  title: '',
  description: '',
  priority: 'low' as TicketPriority,
  orderId: ''
});

const priorities = [
  { label: 'کم', value: 'low' },
  { label: 'متوسط', value: 'medium' },
  { label: 'زیاد', value: 'high' },
  { label: 'فوری', value: 'urgent' }
];

const validate = (state: any) => {
  const errors = [];
  if (!state.title) errors.push({ path: 'title', message: 'وارد کردن عنوان الزامی است' });
  if (!state.description) errors.push({ path: 'description', message: 'وارد کردن توضیحات الزامی است' });
  return errors;
};

const onSubmit = async () => {
  loading.value = true;
  try {
    await createTicket(state);
    toast.add({ title: 'موفقیت', description: 'تیکت شما با موفقیت ثبت شد', color: 'success' });
    emit('success');
  } catch (error: any) {
    toast.add({ title: 'خطا', description: error?.response?.data?.message || 'ثبت تیکت با خطا مواجه شد', color: 'red' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-lg max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
      <h2 class="text-xl font-iran-yekan-Bold text-blue-dark">ثبت تیکت جدید پشتیبانی</h2>
      <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="$emit('cancel')" />
    </div>

    <UForm :validate="validate" :state="state" @submit="onSubmit" class="space-y-6">
      <UFormField label="عنوان تیکت" name="title" required>
        <UInput 
          v-model="state.title" 
          placeholder="موضوع مشکل خود را کوتاه بنویسید..." 
          size="lg"
        />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="اولویت" name="priority">
          <USelectMenu 
            v-model="state.priority" 
            :options="priorities" 
            value-attribute="value"
            option-attribute="label"
            size="lg"
          />
        </UFormField>

        <UFormField label="شناسه سفارش (اختیاری)" name="orderId">
          <UInput 
            v-model="state.orderId" 
            placeholder="مثلا: 64f2..." 
            size="lg" 
            class="font-num"
          />
        </UFormField>
      </div>

      <UFormField label="توضیحات کامل" name="description" required>
        <UTextarea 
          v-model="state.description" 
          placeholder="جزئیات مشکل خود را اینجا شرح دهید..." 
          :rows="6"
          size="lg"
        />
      </UFormField>

      <div class="flex items-center gap-4 pt-4">
        <UButton 
          type="submit" 
          color="primary" 
          size="xl" 
          block
          :loading="loading"
          class="font-iran-yekan-Bold"
        >
          ارسال تیکت به کارشناسان
        </UButton>
      </div>
    </UForm>
  </div>
</template>
