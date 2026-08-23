<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<{
  modelValue: boolean;
  label?: string;
  panelId?: string;
  width?: string;
  persistentOnDesktop?: boolean;
}>(), {
  label: "منوی کناری",
  panelId: "app-drawer-panel",
  width: "18rem",
  persistentOnDesktop: false,
});

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const panel = ref<HTMLElement | null>(null);
const previouslyFocused = ref<HTMLElement | null>(null);
const previousBodyOverflow = ref<string | null>(null);
// Keep the drawer closed during SSR. The real viewport is known only after mount.
const isDesktop = ref(false);
let viewportQuery: MediaQueryList | null = null;
const isOpen = computed(() => (props.persistentOnDesktop && isDesktop.value) || props.modelValue);

const focusableSelector = [
  "a[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])",
].join(",");

function close() {
  emit("update:modelValue", false);
}

function updateBodyLock(open: boolean) {
  if (typeof document === "undefined") return;
  if (open && !isDesktop.value) {
    if (previousBodyOverflow.value === null) previousBodyOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  } else if (previousBodyOverflow.value !== null) {
    document.body.style.overflow = previousBodyOverflow.value;
    previousBodyOverflow.value = null;
  }
}

function updateViewportState() {
  if (!viewportQuery) return;
  isDesktop.value = !viewportQuery.matches;
  updateBodyLock(props.modelValue);
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
    if (isDesktop.value) return;
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

watch([() => props.modelValue, isDesktop], ([open]) => updateBodyLock(open));

onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("keydown", handleKeydown);
  viewportQuery?.removeEventListener("change", updateViewportState);
  updateBodyLock(false);
});

onMounted(() => {
  viewportQuery = window.matchMedia("(max-width: 1024px)");
  viewportQuery.addEventListener("change", updateViewportState);
  updateViewportState();
  updateBodyLock(props.modelValue);
});
</script>

<template>
  <div class="app-drawer" :class="{ 'app-drawer--open': isOpen }" :style="{ '--drawer-width': width }">
    <button v-if="isOpen && !isDesktop" class="app-drawer__backdrop" type="button" :aria-label="`${label} را ببندید`" @click="close" />
    <aside ref="panel" :id="panelId" class="app-drawer__panel" role="dialog" :aria-label="label" :aria-modal="!isDesktop" :aria-hidden="!isOpen" :inert="!isOpen">
      <button v-if="isOpen && !isDesktop" class="app-drawer__close" type="button" :aria-label="`${label} را ببندید`" @click="close">
        <UIcon name="i-lucide-x" aria-hidden="true" />
      </button>
      <slot />
    </aside>
  </div>
</template>

<style scoped>
.app-drawer { grid-area: drawer; min-width: 0; overflow: clip; }
.app-drawer__backdrop { display: none; }
.app-drawer__panel {
  height: 100%;
  min-height: 0;
  width: min(100%, var(--drawer-width));
  max-width: none;
  box-sizing: border-box;
}
@media (max-width: 1024px) {
  .app-drawer { position: fixed; inset: 0; z-index: 1100; pointer-events: none; }
  .app-drawer--open { pointer-events: auto; }
  .app-drawer__backdrop { display: block; position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: rgb(15 23 42 / 45%); }
  .app-drawer__panel {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    inset-inline-end: auto;
    height: 100dvh;
    width: min(var(--drawer-width), calc(100vw - 1rem));
    max-width: calc(100vw - 1rem);
    visibility: hidden;
    pointer-events: none;
    min-height: 0;
    transform: translateX(100%);
    transition: transform .25s ease;
    background: #fff;
    box-shadow: var(--shadow-overlay);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 3.75rem 0.75rem 1rem;
  }
  .app-drawer__close {
    position: absolute;
    inset-block-start: .75rem;
    inset-inline-end: .75rem;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: .75rem;
    background: var(--color-bg-light);
    color: var(--color-text-heading);
    cursor: pointer;
  }
  .app-drawer--open .app-drawer__panel { visibility: visible; pointer-events: auto; transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .app-drawer__panel { transition: none !important; }
}
:global([dir="ltr"] .app-drawer__panel) { inset-inline-end: 0; inset-inline-start: auto; transform: translateX(-100%); }
:global([dir="ltr"] .app-drawer--open .app-drawer__panel) { transform: translateX(0); }
</style>
