<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { useFormField } from "@nuxt/ui/composables/useFormField";

defineOptions({ inheritAttrs: false });

type SelectValue = string | number | boolean;
type SelectItem = SelectValue | Record<string, unknown>;

const props = withDefaults(defineProps<{
  modelValue?: SelectValue | null;
  items?: readonly SelectItem[];
  options?: readonly SelectItem[];
  valueKey?: string;
  labelKey?: string;
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
}>(), {
  items: () => [],
  options: () => [],
  valueKey: "value",
  labelKey: "label",
  size: "md",
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: SelectValue | null];
  change: [event: Event];
}>();

const attrs = useAttrs();
const { id: fieldId, name: fieldName, disabled: fieldDisabled, ariaAttrs, emitFormChange, emitFormInput, emitFormBlur, emitFormFocus } = useFormField(props);
const items = computed(() => props.items?.length ? props.items : props.options || []);
const selectAttrs = computed(() => {
  const result = { ...attrs };
  delete result.class;
  return result;
});

function itemValue(item: SelectItem): SelectValue {
  if (typeof item === "object" && item !== null) {
    return (item[props.valueKey] as SelectValue | undefined) ?? "";
  }
  return item;
}

function itemLabel(item: SelectItem): string {
  if (typeof item === "object" && item !== null) {
    return String(item[props.labelKey] ?? itemValue(item));
  }
  return String(item);
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const selected = items.value.find((item) => String(itemValue(item)) === target.value);
  emit("update:modelValue", selected ? itemValue(selected) : target.value || null);
  emitFormChange();
  emitFormInput();
  emit("change", event);
}
</script>

<template>
  <div class="app-select" :class="[`app-select--${size}`, attrs.class]">
    <select
      v-bind="{ ...selectAttrs, ...ariaAttrs }"
      :id="fieldId || id"
      :name="fieldName || name"
      :required="required"
      :disabled="fieldDisabled"
      :value="modelValue == null ? '' : String(modelValue)"
      class="app-select__control"
      @focus="emitFormFocus"
      @blur="emitFormBlur"
      @change="handleChange">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="item in items"
        :key="String(itemValue(item))"
        :value="String(itemValue(item))">
        {{ itemLabel(item) }}
      </option>
    </select>
    <UIcon name="i-lucide-chevron-down" class="app-select__icon" aria-hidden="true" />
  </div>
</template>

<style scoped>
.app-select { position:relative; display:inline-flex; min-width:8rem; max-width:100%; }
.app-select__control { width:100%; min-height:2.75rem; appearance:none; padding:.55rem 2rem .55rem .75rem; border:1px solid var(--color-border-strong); border-radius:var(--radius-field); color:var(--color-text-body); background:var(--color-bg-surface); font:inherit; font-size:.82rem; line-height:1.35; cursor:pointer; transition:border-color .18s ease, box-shadow .18s ease, background-color .18s ease; }
.app-select__control:hover { border-color:var(--color-brand-blue); background:var(--color-info-bg); }
.app-select__control:focus-visible { outline:none; box-shadow:var(--focus-ring); border-color:var(--color-brand-blue); }
.app-select__control:disabled { opacity:.6; cursor:not-allowed; }
.app-select__icon { position:absolute; top:50%; inset-inline-end:.7rem; width:1rem; height:1rem; color:var(--color-text-muted); pointer-events:none; transform:translateY(-50%); }
.app-select--xs { min-width:6.5rem; }
.app-select--xs .app-select__control { min-height:2.35rem; padding-top:.4rem; padding-bottom:.4rem; font-size:.75rem; }
.app-select--sm { min-width:7.5rem; }
.app-select--lg { min-width:10rem; }
.app-select--xl { min-width:12rem; }
@media (prefers-reduced-motion: reduce) { .app-select__control { transition:none; } }
</style>
