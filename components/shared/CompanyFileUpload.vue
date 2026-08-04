
<template>
  <div class="w-full">
    <div
      class="company-dropzone relative rounded-field p-6 transition-all duration-200"
      :class="[
        isDragging ? 'company-dropzone--dragging' : '',
        loading ? 'opacity-50 pointer-events-none' : ''
      ]"
      role="button"
      tabindex="0"
      aria-label="انتخاب لوگو یا تصویر کسب‌وکار"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @keydown.enter.prevent="fileInput?.click()"
      @keydown.space.prevent="fileInput?.click()"
    >
      <!-- Specialized upload control: native file input covers the full drop zone for drag/click uploads. -->
      <input
        type="file"
        ref="fileInput"
        class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        :multiple="multiple"
        @change="handleFileChange"
      />

      <div class="flex flex-col items-center justify-center text-center space-y-2">
        <UIcon
          :name="loading ? 'i-lucide-loader-circle' : 'i-lucide-upload-cloud'" 
          class="size-10 text-slate-500"
          :class="{ 'animate-spin': loading }"
        />
        <div class="text-sm">
          <span class="font-bold text-primary">کلیک کنید</span> یا تصویر را اینجا رها کنید
        </div>
        <p class="text-xs text-slate-600">فرمت‌های مجاز: PNG، JPG و WEBP — حداکثر حجم: ۵ مگابایت</p>
      </div>
    </div>

    <div v-if="selectedFile" class="company-file-meta" aria-live="polite">
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-slate-800">{{ selectedFile.name }}</p>
        <p class="text-xs text-slate-600">{{ formatBytes(selectedFile.size) }}<span v-if="uploadComplete"> · بارگذاری شد</span></p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <UIcon v-if="uploadComplete" name="i-lucide-check-circle-2" class="size-icon-inline text-green-700" aria-label="بارگذاری موفق" />
        <UButton type="button" size="sm" variant="outline" color="neutral" @click="clearSelection">حذف</UButton>
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
    <p v-if="errorMessage" class="mt-2 flex items-center gap-1 text-xs text-red-700" role="alert" aria-live="assertive">
      <UIcon name="i-lucide-alert-circle" aria-hidden="true" />
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
  (e: 'clear'): void;
}>();

const { $axios } = useNuxtApp();
const isDragging = ref(false);
const loading = ref(false);
const uploadProgress = ref(0);
const errorMessage = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const uploadComplete = ref(false);

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

const getFileExtension = (filename: string) =>
  filename.split('.').pop()?.toLowerCase() || '';

const formatBytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} مگابایت`;

const clearSelection = () => {
  selectedFile.value = null;
  uploadComplete.value = false;
  errorMessage.value = '';
  uploadProgress.value = 0;
  if (fileInput.value) fileInput.value.value = '';
  emit('clear');
};

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
  const extension = getFileExtension(file.name);
  if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(extension)) {
    errorMessage.value = 'فرمت فایل باید JPG، PNG یا WEBP باشد.';
    emit('error', errorMessage.value);
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'حجم فایل نباید بیشتر از ۵ مگابایت باشد.';
    emit('error', errorMessage.value);
    return;
  }

  loading.value = true;
  selectedFile.value = file;
  uploadComplete.value = false;
  errorMessage.value = '';
  uploadProgress.value = 0;

  try {
    // Public vendor applications must not receive anonymous presigned URLs.
    // Upload company images through the server, where content validation and
    // the public IP rate limit are applied.
    if (props.type === 'company') {
      const formData = new FormData();
      formData.append('files', file);
      const { data } = await $axios.post('/images/public-company-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      uploadProgress.value = 100;
      uploadComplete.value = true;
      emit('success', data.items[0].publicUrl);
      return;
    }

    // Authenticated product uploads continue to use presigned URLs.
    const { data } = await $axios.post('/images/presign', {
      type: props.type,
      files: [{ filename: file.name, contentType: file.type, size: file.size }]
    });

    const item = data.items[0];
    if (!item.presignedUrl) {
      // Fallback: If no presigned URL, maybe backend uploaded it or we should use direct upload
      uploadComplete.value = true;
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
    uploadComplete.value = true;
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

<style scoped>
.company-dropzone {
  min-height: 10rem;
  border: 2px dashed #94a3b8;
  background: #f8fafc;
  outline: none;
}

.company-dropzone:hover,
.company-dropzone:focus-visible {
  border-color: var(--color-brand-blue);
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgb(22 115 255 / 15%);
}

.company-dropzone--dragging {
  border-color: var(--color-brand-blue);
  background: #dbeafe;
}

.company-file-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: .75rem;
  padding: .75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-field);
  background: #fff;
}
</style>
