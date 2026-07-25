<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCategories } from '~/composables/useCategories';

const props = defineProps<{
  initialMaxPrice?: number;
  initialCompanyName?: string;
  initialCategoryIds?: string[];
}>();

const emit = defineEmits<{
  (event: 'update:filters', payload: {
    maxPrice?: number;
    companyName?: string;
    categoryIds?: string[];
  }): void;
  (event: 'clear'): void;
}>();

const { categories, load: loadCategories } = useCategories();

const maxPrice = ref(props.initialMaxPrice || undefined);
const companyName = ref(props.initialCompanyName || '');
const selectedCategories = ref<string[]>(props.initialCategoryIds || []);

onMounted(async () => {
  await loadCategories();
});

const applyFilters = () => {
  emit('update:filters', {
    maxPrice: maxPrice.value,
    companyName: companyName.value,
    categoryIds: selectedCategories.value
  });
};

const clearFilters = () => {
  maxPrice.value = undefined;
  companyName.value = '';
  selectedCategories.value = [];
  emit('clear');
};
</script>

<template>
  <div class="bg-white p-6 rounded-field shadow-sm space-y-8 sticky top-24 border border-gray-100">
    <div class="flex items-center justify-between">
      <h3 class="font-yekan font-bold text-lg text-blue-dark">فیلترهای جستجو</h3>
      <ActionButton
        tone="ghost"
        size="sm"
        @click="clearFilters"
        class="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
      >
        <UIcon name="i-lucide-trash-2" class="size-icon-inline" />
        پاکسازی
      </ActionButton>
    </div>

    <!-- Category Filter -->
    <div class="space-y-4">
      <h4 class="font-yekan font-semibold text-blue-dark">دسته‌بندی‌ها</h4>
      <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pe-2">
        <div v-for="cat in categories" :key="cat.id || cat._id" class="flex items-center">
          <UCheckbox
            v-model="selectedCategories"
            :value="cat.id || cat._id"
            :label="cat.name"
            class="font-num"
          />
        </div>
      </div>
    </div>

    <!-- Price Filter -->
    <div class="space-y-4">
      <h4 class="font-yekan font-semibold text-blue-dark">محدوده قیمت (ریال)</h4>
      <UInput
        v-model="maxPrice"
        type="number"
        placeholder="حداکثر قیمت..."
        icon="i-lucide-banknote"
        class="font-num"
      />
    </div>

    <!-- Company Filter -->
    <div class="space-y-4">
      <h4 class="font-yekan font-semibold text-blue-dark">نام تامین‌کننده</h4>
      <UInput
        v-model="companyName"
        placeholder="جستجوی شرکت..."
        icon="i-lucide-building"
      />
    </div>

    <UButton
      block
      color="primary"
      size="lg"
      @click="applyFilters"
      class="font-yekan font-semibold"
    >
      اعمال فیلترها
    </UButton>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: var(--radius-card);
}
</style>
