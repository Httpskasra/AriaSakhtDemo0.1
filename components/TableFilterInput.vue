<template>
  <UInput
    :model-value="modelValue"
    type="search"
    :icon="icon"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    class="table-filter-input"
    @update:model-value="emitValue"
    @keyup.enter="$emit('submit')" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    icon?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    disabled?: boolean;
  }>(),
  {
    placeholder: "جستجو...",
    icon: "i-lucide-search",
    size: "md",
    disabled: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  submit: [];
}>();

const emitValue = (value: string | number | null | undefined) => {
  emit("update:modelValue", String(value ?? ""));
};
</script>

<style scoped>
.table-filter-input {
  width: min(100%, 320px);
}
</style>
