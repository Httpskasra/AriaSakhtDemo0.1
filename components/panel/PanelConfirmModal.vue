<script setup lang="ts">
withDefaults(defineProps<{
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  titleId?: string;
}>(), {
  confirmLabel: "تأیید",
  cancelLabel: "انصراف",
  busy: false,
  titleId: "panel-confirm-title",
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>

<template>
  <BaseModal :title-id="titleId" :busy="busy" @close="emit('close')">
    <div class="panel-confirm-modal">
      <div class="panel-confirm-modal__icon" aria-hidden="true">
        <UIcon name="i-lucide-circle-alert" />
      </div>
      <h2 :id="titleId">{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <UButton type="button" color="neutral" variant="soft" :disabled="busy" @click="emit('close')">
          {{ cancelLabel }}
        </UButton>
        <UButton type="button" color="error" :loading="busy" @click="emit('confirm')">
          {{ confirmLabel }}
        </UButton>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.panel-confirm-modal { display: grid; gap: .75rem; padding-top: 1rem; }
.panel-confirm-modal__icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: var(--radius-circle); color: var(--color-danger-fg); background: var(--color-danger-bg); font-size: 1.35rem; }
.panel-confirm-modal h2 { margin: 0; color: var(--color-text-heading); font-size: 1.15rem; font-weight: 800; }
.panel-confirm-modal p { margin: 0; color: var(--color-text-muted); line-height: var(--line-height-long-form); }
</style>
