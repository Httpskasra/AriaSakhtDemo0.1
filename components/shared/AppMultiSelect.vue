<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useAttrs } from "vue";
import { useFormField } from "@nuxt/ui/composables/useFormField";

defineOptions({ inheritAttrs: false });

type SelectItem = Record<string, unknown>;

const props = withDefaults(defineProps<{
  modelValue?: unknown[];
  items?: readonly SelectItem[];
  valueKey?: string;
  labelKey?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  id?: string;
}>(), {
  modelValue: () => [],
  items: () => [],
  valueKey: "value",
  labelKey: "label",
  placeholder: "انتخاب کنید",
  loading: false,
  disabled: false,
});

const emit = defineEmits<{ "update:modelValue": [value: string[]] }>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const open = ref(false);
const { id: fieldId, disabled: fieldDisabled, ariaAttrs, emitFormChange, emitFormInput, emitFormBlur, emitFormFocus } = useFormField(props);
const triggerAttrs = computed(() => {
  const result = { ...attrs, ...(ariaAttrs.value || {}) };
  delete result.class;
  return result;
});

const selectedValues = computed(() => new Set((props.modelValue || []).map((item) => String(
  typeof item === "object" && item !== null
    ? (item as SelectItem)[props.valueKey]
    : item,
))));
const selectedLabels = computed(() => props.items
  .filter((item) => selectedValues.value.has(String(item[props.valueKey] ?? "")))
  .map((item) => String(item[props.labelKey] ?? item[props.valueKey] ?? "")));

function itemValue(item: SelectItem) {
  return String(item[props.valueKey] ?? "");
}

function itemLabel(item: SelectItem) {
  return String(item[props.labelKey] ?? item[props.valueKey] ?? "");
}

function toggle() {
  if (props.disabled || props.loading) return;
  open.value = !open.value;
}

function toggleItem(item: SelectItem) {
  const value = itemValue(item);
  const next = new Set(selectedValues.value);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  emit("update:modelValue", [...next]);
  emitFormChange();
  emitFormInput();
}

function closeOnOutside(event: MouseEvent) {
  if (root.value && event.target instanceof Node && !root.value.contains(event.target)) open.value = false;
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === "Escape") open.value = false;
}

onMounted(() => {
  document.addEventListener("click", closeOnOutside);
  document.addEventListener("keydown", closeOnEscape);
});

onUnmounted(() => {
  document.removeEventListener("click", closeOnOutside);
  document.removeEventListener("keydown", closeOnEscape);
});
</script>

<template>
  <div ref="root" class="app-multi-select" :class="attrs.class">
    <button
      v-bind="triggerAttrs"
      :id="fieldId || id"
      type="button"
      class="app-multi-select__trigger"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="`${fieldId || id || 'app-multi-select'}-options`"
      :disabled="fieldDisabled || loading"
      @focus="emitFormFocus"
      @blur="emitFormBlur"
      @click.stop="toggle">
      <span class="app-multi-select__value">
        <span v-if="loading">در حال بارگذاری…</span>
        <span v-else-if="selectedLabels.length">{{ selectedLabels.slice(0, 2).join("، ") }}<template v-if="selectedLabels.length > 2"> و {{ selectedLabels.length - 2 }} مورد دیگر</template></span>
        <span v-else class="app-multi-select__placeholder">{{ placeholder }}</span>
      </span>
      <UIcon :name="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" aria-hidden="true" />
    </button>

    <div
      v-if="open"
      :id="`${fieldId || id || 'app-multi-select'}-options`"
      class="app-multi-select__options"
      role="listbox"
      aria-multiselectable="true"
      :aria-label="String(attrs['aria-label'] || 'گزینه‌ها')"
      @click.stop>
      <button
        v-for="item in items"
        :key="itemValue(item)"
        type="button"
        class="app-multi-select__option"
        :class="{ 'app-multi-select__option--selected': selectedValues.has(itemValue(item)) }"
        role="option"
        :aria-selected="selectedValues.has(itemValue(item))"
        @click="toggleItem(item)">
        <span>{{ itemLabel(item) }}</span>
        <UIcon v-if="selectedValues.has(itemValue(item))" name="i-lucide-check" aria-hidden="true" />
      </button>
      <p v-if="!items.length" class="app-multi-select__empty">گزینه‌ای برای انتخاب وجود ندارد.</p>
    </div>
  </div>
</template>

<style scoped>
.app-multi-select { position:relative; display:block; width:100%; max-width:100%; }
.app-multi-select__trigger { display:flex; width:100%; min-height:2.75rem; align-items:center; gap:.5rem; justify-content:space-between; padding:.55rem .75rem; border:1px solid var(--color-border-strong); border-radius:var(--radius-field); color:var(--color-text-body); background:var(--color-bg-surface); font:inherit; font-size:.82rem; text-align:right; cursor:pointer; transition:border-color .18s ease, box-shadow .18s ease, background-color .18s ease; }
.app-multi-select__trigger:hover { border-color:var(--color-brand-blue); background:var(--color-info-bg); }
.app-multi-select__trigger:focus-visible, .app-multi-select__option:focus-visible { outline:none; box-shadow:var(--focus-ring); }
.app-multi-select__trigger:disabled { opacity:.6; cursor:not-allowed; }
.app-multi-select__value { min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.app-multi-select__placeholder { color:var(--color-text-muted); }
.app-multi-select__options { position:absolute; inset-inline:0; top:calc(100% + .35rem); z-index:80; display:grid; max-height:16rem; gap:.2rem; overflow-y:auto; padding:.35rem; border:1px solid var(--color-border-strong); border-radius:var(--radius-field); background:var(--color-bg-surface); box-shadow:var(--shadow-raised); }
.app-multi-select__option { display:flex; min-height:2.5rem; align-items:center; justify-content:space-between; gap:.5rem; padding:.5rem .65rem; border:0; border-radius:.45rem; color:var(--color-text-body); background:transparent; font:inherit; font-size:.78rem; text-align:right; cursor:pointer; }
.app-multi-select__option:hover, .app-multi-select__option--selected { color:var(--color-text-heading); background:var(--color-bg-light); }
.app-multi-select__option span { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.app-multi-select__empty { margin:0; padding:.75rem; color:var(--color-text-muted); font-size:.75rem; }
@media (prefers-reduced-motion: reduce) { .app-multi-select__trigger { transition:none; } }
</style>
