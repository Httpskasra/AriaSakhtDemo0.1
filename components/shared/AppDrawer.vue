<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<{
  modelValue: boolean;
  label?: string;
  width?: string;
  persistentOnDesktop?: boolean;
}>(), {
  label: "منوی کناری",
  width: "18rem",
  persistentOnDesktop: false,
});

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const panel = ref<HTMLElement | null>(null);
const previouslyFocused = ref<HTMLElement | null>(null);
// Keep the drawer closed during SSR. The real viewport is known only after mount.
const isDesktop = ref(false);
const isOpen = computed(() => (props.persistentOnDesktop && isDesktop.value) || props.modelValue);

const focusableSelector = [
  "a[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])",
].join(",");

function close() {
  emit("update:modelValue", false);
}

function updateBodyLock(open: boolean) {
  if (typeof document === "undefined" || isDesktop.value) return;
  document.body.style.overflow = open ? "hidden" : "";
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return;
  if (event.key === "Escape") {
    event.preventDefault();
    close();
    return;
  }
  if (event.key !== "Tab" || !panel.value) return;
  const focusable = [...panel.value.querySelectorAll<HTMLElement>(focusableSelector)];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(isOpen, async (open) => {
  if (typeof document === "undefined") return;
  if (open) {
    previouslyFocused.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.addEventListener("keydown", handleKeydown);
    await nextTick();
    panel.value?.querySelector<HTMLElement>(focusableSelector)?.focus();
  } else {
    document.removeEventListener("keydown", handleKeydown);
    await nextTick();
    previouslyFocused.value?.focus();
    previouslyFocused.value = null;
  }
});

watch(() => props.modelValue, updateBodyLock);

onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("keydown", handleKeydown);
  updateBodyLock(false);
});

onMounted(() => {
  isDesktop.value = !window.matchMedia("(max-width: 1024px)").matches;
  updateBodyLock(props.modelValue);
});
</script>

<template>
  <div class="app-drawer" :class="{ 'app-drawer--open': isOpen }" :style="{ '--drawer-width': width }">
    <button v-if="isOpen && !isDesktop" class="app-drawer__backdrop" type="button" :aria-label="`${label} را ببندید`" @click="close" />
    <aside ref="panel" class="app-drawer__panel" role="dialog" :aria-label="label" :aria-modal="!isDesktop" :aria-hidden="!isOpen" :inert="!isOpen">
      <slot />
    </aside>
  </div>
</template>

<style scoped>
.app-drawer { grid-area: drawer; min-width: 0; }
.app-drawer__backdrop { display: none; }
.app-drawer__panel {
  height: 100%;
  min-height: 0;
  width: min(100%, var(--drawer-width));
  max-width: min(86vw, var(--drawer-width));
  box-sizing: border-box;
}
@media (max-width: 1024px) {
  .app-drawer { position: fixed; inset: 0; z-index: 60; pointer-events: none; }
  .app-drawer--open { pointer-events: auto; }
  .app-drawer__backdrop { display: block; position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: rgb(15 23 42 / 45%); }
  .app-drawer__panel {
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    height: 100dvh;
    min-height: 0;
    transform: translateX(100%);
    transition: transform .25s ease;
    background: #fff;
    box-shadow: var(--shadow-overlay);
  }
  .app-drawer--open .app-drawer__panel { transform: translateX(0); }
}
:global(html[dir="rtl"] .app-drawer__panel) {
  inset-inline-start: 0;
  inset-inline-end: auto;
  transform: translateX(-100%);
}
:global(html[dir="rtl"] .app-drawer--open .app-drawer__panel) {
  transform: translateX(0);
}
</style>
