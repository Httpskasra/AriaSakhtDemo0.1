<template>
  <Teleport to="body">
    <div
      ref="overlayRef"
      class="modal-overlay"
      role="presentation"
      @click.self="handleBackdropClick"
      @keydown="handleKeydown"
    >
      <div
        ref="modalRef"
        class="modal-content"
        role="dialog"
        :aria-labelledby="titleId"
        :aria-busy="busy"
        aria-modal="true"
        tabindex="-1"
      >
        <ActionButton
          icon-only
          icon="i-lucide-x"
          tone="ghost"
          aria-label="بستن پنجره"
          :disabled="busy"
          class="close-btn"
          @click="emit('close')"
        />

        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const emit = defineEmits<{
  (event: "close"): void;
}>();

const props = withDefaults(defineProps<{
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  titleId?: string;
  busy?: boolean;
}>(), {
  closeOnBackdrop: true,
  closeOnEscape: true,
  titleId: undefined,
  busy: false,
});

const overlayRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLElement | null>(null);
const previouslyFocusedElement = ref<HTMLElement | null>(null);

let activeModalCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable=\"true\"]",
  "[tabindex]:not([tabindex=\"-1\"])",
].join(",");

const getFocusableElements = () =>
  Array.from(modalRef.value?.querySelectorAll<HTMLElement>(focusableSelector) || [])
    .filter((element) => element.offsetParent !== null || element === document.activeElement);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    if (!props.closeOnEscape || props.busy) return;
    event.preventDefault();
    emit("close");
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  if (!focusableElements.length) {
    event.preventDefault();
    modalRef.value?.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.busy) emit("close");
};

const lockBodyScroll = () => {
  if (activeModalCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
  }

  activeModalCount += 1;
};

const unlockBodyScroll = () => {
  activeModalCount = Math.max(0, activeModalCount - 1);
  if (activeModalCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
  }
};

onMounted(async () => {
  previouslyFocusedElement.value = document.activeElement as HTMLElement | null;
  lockBodyScroll();

  await nextTick();
  const firstFocusable = getFocusableElements()[0];
  (firstFocusable || modalRef.value)?.focus();
});

onUnmounted(() => {
  unlockBodyScroll();

  const elementToRestore = previouslyFocusedElement.value;
  if (elementToRestore?.isConnected) {
    nextTick(() => elementToRestore.focus());
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  background-color: #fff;
  border-radius: var(--radius-dialog);
  max-width: min(100%, 600px);
  width: min(100%, 600px);
  max-height: min(100vh, 760px);
  overflow-y: auto;
  padding: 1.5rem;
  box-sizing: border-box;
  box-shadow: var(--shadow-overlay);
  margin: auto;
}

.close-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  background: transparent;
  border: none;
  font-size: var(--spacing-icon-empty-state);
  line-height: 1;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: color 0.2s;
  padding: 0.625rem;
  user-select: none;
}

.close-btn:hover {
  color: var(--color-text-heading);
}
</style>
