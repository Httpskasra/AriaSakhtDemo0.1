<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { CreateProductDto } from '~/types/product';

const props = defineProps<{
  initialData?: Partial<CreateProductDto>;
  isUpdate?: boolean;
}>();

const emit = defineEmits(['submit', 'cancel']);

const state = reactive({
  name: props.initialData?.name || '',
  slug: props.initialData?.slug || '',
  sku: props.initialData?.sku || '',
  basePrice: props.initialData?.basePrice || 0,
  discount: props.initialData?.discount || 0,
  description: props.initialData?.description || '',
  stockQuantity: props.initialData?.stock?.quantity || 0,
  status: props.initialData?.status || 'draft'
});

const validate = (state: any) => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'نام محصول الزامی است' });
  if (!state.slug) errors.push({ path: 'slug', message: 'شناسه سئو (اسلاگ) الزامی است' });
  if (!state.sku) errors.push({ path: 'sku', message: 'کد کالا الزامی است' });
  if (state.basePrice <= 0) errors.push({ path: 'basePrice', message: 'قیمت پایه باید بیشتر از صفر باشد' });
  return errors;
};

const onSubmit = () => {
  emit('submit', {
    ...state,
    stock: { quantity: state.stockQuantity }
  });
};
</script>

<template>
  <UForm :validate="validate" :state="state" @submit="onSubmit" class="space-y-8 bg-white p-8 rounded-xl border border-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <UFormField label="نام محصول" name="name" required>
        <UInput v-model="state.name" placeholder="مثلا: سیمان تیپ ۲" size="lg" />
      </UFormField>

      <UFormField label="شناسه سئو (URL Friendly)" name="slug" required help="مثلا: cement-type-2">
        <UInput v-model="state.slug" size="lg" dir="ltr" />
      </UFormField>

      <UFormField label="کد کالا (SKU)" name="sku" required>
        <UInput v-model="state.sku" size="lg" dir="ltr" />
      </UFormField>

      <UFormField label="وضعیت انتشار" name="status">
        <USelect 
          v-model="state.status" 
          :options="[
            { label: 'پیش‌نویس', value: 'draft' },
            { label: 'فعال', value: 'active' },
            { label: 'غیرفعال', value: 'inactive' }
          ]"
          size="lg"
        />
      </UFormField>

      <UFormField label="قیمت پایه (ریال)" name="basePrice" required>
        <UInput v-model="state.basePrice" type="number" size="lg" class="font-num" />
      </UFormField>

      <UFormField label="درصد تخفیف" name="discount">
        <UInput v-model="state.discount" type="number" size="lg" class="font-num" max="100" />
      </UFormField>

      <UFormField label="تعداد موجودی" name="stockQuantity">
        <UInput v-model="state.stockQuantity" type="number" size="lg" class="font-num" />
      </UFormField>
    </div>

    <UFormField label="توضیحات فنی محصول" name="description">
      <UTextarea v-model="state.description" :rows="5" size="lg" placeholder="ویژگی‌های فنی و کاربرد محصول..." />
    </UFormField>

    <div class="flex justify-end gap-4 border-t pt-6">
      <UButton color="neutral" variant="outline" size="lg" @click="$emit('cancel')">
        انصراف
      </UButton>
      <UButton type="submit" color="primary" size="lg" class="px-10">
        {{ isUpdate ? 'بروزرسانی محصول' : 'ایجاد محصول جدید' }}
      </UButton>
    </div>
  </UForm>
</template>
