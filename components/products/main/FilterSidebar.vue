<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useCategories } from '~/composables/useCategories';

const props = withDefaults(defineProps<{
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialCompanyName?: string;
  initialCategoryIds?: string[];
  inputIdPrefix?: string;
}>(), {
  inputIdPrefix: 'products',
});

const emit = defineEmits<{
  (event: 'update:filters', payload: {
    minPrice?: number;
    maxPrice?: number;
    companyName?: string;
    categoryIds?: string[];
  }): void;
  (event: 'clear'): void;
}>();

const { categories, loading, error, load: loadCategories } = useCategories();
const isCategoriesExpanded = ref(false);
const visibleCategoryLimit = 6;
const visibleCategories = computed(() => isCategoriesExpanded.value ? categories.value : categories.value.slice(0, visibleCategoryLimit));

const minPrice = ref(props.initialMinPrice || undefined);
const maxPrice = ref(props.initialMaxPrice || undefined);
const companyName = ref(props.initialCompanyName || '');
const selectedCategories = ref<string[]>(props.initialCategoryIds || []);
const hasActiveFilters = computed(() => Boolean(minPrice.value || maxPrice.value || companyName.value.trim() || selectedCategories.value.length));
const priceRangeInvalid = computed(() => Boolean(minPrice.value !== undefined && maxPrice.value !== undefined && Number(minPrice.value) > Number(maxPrice.value)));
const normalizeCategories = (values?: string[]) => [...(values || [])].sort().join('|');
const hasChanges = computed(() => (
  (minPrice.value || undefined) !== (props.initialMinPrice || undefined)
  || (maxPrice.value || undefined) !== (props.initialMaxPrice || undefined)
  || companyName.value.trim() !== (props.initialCompanyName || '').trim()
  || normalizeCategories(selectedCategories.value) !== normalizeCategories(props.initialCategoryIds)
));

watch(() => props.initialMinPrice, value => { minPrice.value = value; });
watch(() => props.initialMaxPrice, value => { maxPrice.value = value; });
watch(() => props.initialCompanyName, value => { companyName.value = value || ''; });
watch(() => props.initialCategoryIds, value => { selectedCategories.value = [...(value || [])]; }, { deep: true });

const retryCategories = () => loadCategories().catch(() => undefined);

onMounted(retryCategories);

const applyFilters = () => {
  if (priceRangeInvalid.value) return;
  emit('update:filters', {
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    companyName: companyName.value,
    categoryIds: selectedCategories.value
  });
};

const clearFilters = () => {
  minPrice.value = undefined;
  maxPrice.value = undefined;
  companyName.value = '';
  selectedCategories.value = [];
  emit('clear');
};
</script>

<template>
  <div class="filter-panel bg-white p-6 rounded-field space-y-8 sticky top-24 border border-gray-100">
    <div class="flex items-center justify-between">
      <h3 class="filter-panel__title font-yekan font-bold text-lg text-blue-dark">فیلترهای جستجو</h3>
      <ActionButton
        v-if="hasActiveFilters"
        tone="ghost"
        size="sm"
        @click="clearFilters"
        class="filter-reset"
      >
        بازنشانی
      </ActionButton>
    </div>

    <!-- Category Filter -->
    <div class="space-y-4">
        <h4 class="filter-group__title font-yekan font-semibold text-blue-dark">دسته‌بندی‌ها</h4>
      <div v-if="loading" class="category-skeleton" aria-label="در حال بارگذاری دسته‌بندی‌ها">
        <USkeleton v-for="index in 4" :key="index" class="h-5 w-full rounded-field" />
      </div>
      <div v-else-if="error" class="category-empty">
        <p>دریافت دسته‌بندی‌ها ناموفق بود.</p>
        <UButton type="button" size="sm" variant="ghost" @click="retryCategories">تلاش مجدد</UButton>
      </div>
      <div v-else-if="!categories.length" class="category-empty">
        <p>هنوز دسته‌بندی‌ای تعریف نشده است.</p>
      </div>
      <div v-else class="category-list custom-scrollbar pe-2">
        <div v-for="cat in visibleCategories" :key="cat.id || cat._id" class="flex items-center">
          <UCheckbox
            v-model="selectedCategories"
            :value="cat.id || cat._id"
            :label="cat.name"
            class="font-num"
          />
        </div>
      </div>
      <UButton
        v-if="categories.length > visibleCategoryLimit"
        type="button"
        size="sm"
        variant="ghost"
        color="neutral"
        class="category-toggle"
        @click="isCategoriesExpanded = !isCategoriesExpanded"
      >
        {{ isCategoriesExpanded ? 'نمایش کمتر' : `نمایش ${categories.length - visibleCategoryLimit} دسته دیگر` }}
        <UIcon :name="isCategoriesExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" aria-hidden="true" />
      </UButton>
    </div>

    <!-- Price Filter -->
      <div class="filter-field space-y-4">
        <span class="filter-label font-yekan font-semibold text-blue-dark">محدوده قیمت</span>
        <div class="price-fields">
          <div class="filter-input-group">
          <UInput
            :id="`${props.inputIdPrefix}-min-price`"
            v-model="minPrice"
            type="number"
            inputmode="numeric"
            placeholder="حداقل قیمت"
            size="lg"
            variant="outline"
            color="neutral"
            class="filter-input font-num"
            :aria-invalid="priceRangeInvalid"
          >
            <template #trailing><UIcon name="i-lucide-banknote" aria-hidden="true" /></template>
          </UInput>
          <span class="filter-input-unit">ریال</span>
          </div>
          <div class="filter-input-group">
          <UInput
            :id="`${props.inputIdPrefix}-max-price`"
            v-model="maxPrice"
            type="number"
            inputmode="numeric"
            placeholder="مثلاً ۵۰٬۰۰۰٬۰۰۰"
            size="lg"
            variant="outline"
            color="neutral"
            class="filter-input font-num"
            :aria-invalid="priceRangeInvalid"
          >
            <template #trailing>
              <UIcon name="i-lucide-banknote" aria-hidden="true" />
            </template>
          </UInput>
          <span class="filter-input-unit">ریال</span>
          </div>
        </div>
        <p class="filter-help" :class="{ 'filter-help--error': priceRangeInvalid }">
          {{ priceRangeInvalid ? 'حداقل قیمت نمی‌تواند از حداکثر قیمت بیشتر باشد.' : 'مبلغ را فقط به‌صورت عدد وارد کنید.' }}
        </p>
    </div>

    <!-- Company Filter -->
      <div class="filter-field space-y-4">
        <label :for="`${props.inputIdPrefix}-company-name`" class="filter-label font-yekan font-semibold text-blue-dark">نام تأمین‌کننده</label>
        <div class="filter-input-wrapper">
          <UInput
            :id="`${props.inputIdPrefix}-company-name`"
            v-model="companyName"
            placeholder="نام شرکت را وارد کنید"
            autocomplete="organization"
            size="lg"
            variant="outline"
            color="neutral"
            class="filter-input"
          >
            <template #trailing>
              <UIcon name="i-lucide-building" aria-hidden="true" />
            </template>
          </UInput>
        </div>
        <p class="filter-help">برای یافتن محصولات یک تأمین‌کننده مشخص.</p>
    </div>

    <UButton
      block
      color="primary"
      size="lg"
      :disabled="!hasChanges"
      @click="applyFilters"
      class="apply-filters-button font-yekan font-semibold"
    >
      اعمال فیلترها
    </UButton>
  </div>
</template>

<style scoped>
.filter-panel {
  box-shadow: none;
}

.filter-panel__title {
  font-size: 1.25rem;
  line-height: 1.5;
}

.filter-group__title {
  font-size: 0.9375rem;
  line-height: 1.5;
}

.filter-label {
  font-size: 0.8125rem;
  line-height: 1.5;
}

.apply-filters-button {
  min-height: 2.75rem;
  color: #fff !important;
}

.apply-filters-button:disabled {
  color: #64748b !important;
}

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

.category-list {
  display: grid;
  max-height: 12rem;
  gap: .5rem;
  overflow-y: auto;
}

.category-skeleton,
.category-empty {
  display: grid;
  gap: .5rem;
  min-height: 5rem;
  place-content: center;
  color: #64748b;
  font-size: .75rem;
  text-align: center;
}

.category-toggle {
  justify-content: space-between;
  width: 100%;
  color: #64748b;
  font-size: .75rem;
}

.filter-reset {
  color: #64748b;
  font-size: .75rem;
  font-weight: 600;
  transition: color 150ms ease, background-color 150ms ease;
}

.filter-reset:hover {
  color: var(--color-brand-blue);
  background: #eff6ff;
}

.filter-input-wrapper {
  position: relative;
  width: 100%;
}

.filter-input-group {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.price-fields { display: grid; gap: .625rem; }

.filter-input-unit {
  flex: 0 0 auto;
  color: #475569;
  font-size: .8125rem;
  font-weight: 600;
}

.filter-help {
  color: #475569;
  font-size: .75rem;
  line-height: 1.6;
}
.filter-help--error { color: #b91c1c; }

:deep(.filter-input) {
  width: 100%;
}

:deep(.filter-input input) {
  min-height: 2.75rem;
  padding-block: 0.625rem;
  padding-inline-start: 0.875rem;
  padding-inline-end: 2.75rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-field);
  background: #fff;
  color: var(--color-text-heading);
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

:deep(.filter-input:hover input:not(:disabled)) {
  border-color: #94a3b8;
  background: #f8fafc;
}

:deep(.filter-input input:focus-visible) {
  border-color: var(--color-brand-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgb(22 115 255 / 15%);
}

:deep(.filter-input input:disabled) {
  background: #f1f5f9;
  color: #94a3b8;
}

:deep(.filter-input input[aria-invalid="true"]) {
  border-color: #dc2626;
}

:deep(.filter-input input[aria-invalid="true"]:focus-visible) {
  box-shadow: 0 0 0 3px rgb(220 38 38 / 15%);
}

:deep(.filter-input > span:last-of-type) {
  inset-inline-end: 0.75rem;
  margin-inline-start: 0.5rem;
  color: #64748b;
  pointer-events: none;
}
</style>
