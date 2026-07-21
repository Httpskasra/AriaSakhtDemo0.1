
<template>
  <div class="w-full">
    <div
      class="relative border-2 border-dashed rounded-lg p-6 transition-all duration-200"
      :class="[
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary',
        loading ? 'opacity-50 pointer-events-none' : ''
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        type="file"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        :multiple="multiple"
        @change="handleFileChange"
      />

      <div class="flex flex-col items-center justify-center text-center space-y-2">
        <UIcon 
          :name="loading ? 'i-lucide-loader-circle' : 'i-lucide-upload-cloud'" 
          class="size-10 text-gray-400"
          :class="{ 'animate-spin': loading }"
        />
        <div class="text-sm">
          <span class="font-bold text-primary">کلیک کنید</span> یا تصویر را اینجا رها کنید
        </div>
        <p class="text-xs text-gray-500">حداکثر حجم فایل ۱۰ مگابایت (JPG, PNG, WEBP)</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="loading" class="mt-4 space-y-1">
      <div class="flex justify-between text-xs text-gray-600">
        <span>در حال بارگذاری...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <UProgress :value="uploadProgress" color="primary" size="sm" />
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-2 text-xs text-red-500 flex items-center gap-1">
      <UIcon name="i-lucide-alert-circle" />
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';

const props = defineProps<{
  type: 'product' | 'company';
  multiple?: boolean;
}>();

const emit = defineEmits<{
  (e: 'success', url: string): void;
  (e: 'error', msg: string): void;
}>();

const { $axios } = useNuxtApp();
const isDragging = ref(false);
const loading = ref(false);
const uploadProgress = ref(0);
const errorMessage = ref('');

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    processFile(target.files[0]);
  }
};

const processFile = async (file: File) => {
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  uploadProgress.value = 0;

  try {
    // 1. Get Presigned URL
    const { data } = await $axios.post('/images/presign', {
      type: props.type,
      files: [{
        filename: file.name,
        contentType: file.type,
        size: file.size
      }]
    });

    const item = data.items[0];
    if (!item.presignedUrl) {
      // Fallback: If no presigned URL, maybe backend uploaded it or we should use direct upload
      emit('success', item.publicUrl);
      return;
    }

    // 2. Direct PUT to S3/R2
    await axios.put(item.presignedUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      }
    });

    // 3. Finalize
    emit('success', item.publicUrl);
    uploadProgress.value = 100;
  } catch (err: any) {
    console.error('Upload error:', err);
    errorMessage.value = 'خطا در بارگذاری تصویر. لطفا مجددا تلاش کنید.';
    emit('error', errorMessage.value);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
};
</script>
