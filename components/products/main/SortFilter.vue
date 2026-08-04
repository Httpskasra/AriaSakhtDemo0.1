<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string;
  disabled?: boolean;
}>(), {
  modelValue: '',
  disabled: false,
});

const emit = defineEmits<{
  'update:model-value': [value: string];
}>();

const options = [
  { label: 'پیش‌فرض', value: '' },
  { label: 'قیمت، صعودی', value: 'basePrice:asc' },
  { label: 'قیمت، نزولی', value: 'basePrice:desc' },
  { label: 'جدیدترین', value: 'createdAt:desc' },
  { label: 'پربازدیدترین', value: 'rating:desc' },
];
</script>

<template>
  <div class="sort-filter" :class="{ 'sort-filter--disabled': props.disabled }">
    <UIcon name="i-lucide-arrow-down-up" class="sort-filter__icon" aria-hidden="true" />
    <span class="sort-filter__label">مرتب‌سازی:</span>
    <select
      :value="props.modelValue"
      class="sort-filter__select"
      aria-label="مرتب‌سازی محصولات"
      :disabled="props.disabled"
      @change="emit('update:model-value', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value || 'default'" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <UIcon name="i-lucide-chevron-down" class="sort-filter__chevron" aria-hidden="true" />
  </div>
</template>

<style scoped>
.sort-filter {
  display: flex;
  width: 15rem;
  min-width: 15rem;
  min-height: 2.75rem;
  align-items: center;
  gap: .5rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-field);
  padding: .25rem .75rem;
  background: #fff;
  color: #334155;
  direction: rtl;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

.sort-filter:hover:not(.sort-filter--disabled) {
  border-color: #94a3b8;
  background: #f8fafc;
}

.sort-filter:focus-within:not(.sort-filter--disabled) {
  border-color: var(--color-brand-blue);
  box-shadow: var(--focus-ring);
}

.sort-filter__icon {
  flex: 0 0 auto;
  width: 1.125rem;
  height: 1.125rem;
  color: var(--color-brand-blue);
}

.sort-filter__label {
  flex: 0 0 auto;
  white-space: nowrap;
  font-size: .8125rem;
  font-weight: 600;
  color: #475569;
}

.sort-filter__select {
  min-width: 0;
  flex: 1;
  appearance: none;
  border: 0;
  outline: 0;
  padding: .375rem 0;
  background: transparent;
  color: #0f172a;
  cursor: pointer;
  font-size: .8125rem;
  font-weight: 700;
}

.sort-filter__select:disabled {
  cursor: not-allowed;
}

.sort-filter__chevron {
  flex: 0 0 auto;
  width: 1rem;
  height: 1rem;
  color: #64748b;
  pointer-events: none;
}

.sort-filter--disabled {
  cursor: not-allowed;
  opacity: .58;
}

@media (max-width: 767px) {
  .sort-filter {
    width: 100%;
    min-width: 0;
  }
}
</style>
