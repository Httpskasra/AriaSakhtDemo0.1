<script setup lang="ts">
type ButtonTone = "primary" | "secondary" | "ghost" | "destructive";

withDefaults(defineProps<{
  tone?: ButtonTone;
  iconOnly?: boolean;
  icon?: string;
  label?: string;
  type?: "button" | "submit" | "reset";
  to?: string;
  disabled?: boolean;
  loading?: boolean;
}>(), {
  tone: "primary",
  iconOnly: false,
  icon: undefined,
  label: undefined,
  type: "button",
  to: undefined,
  disabled: false,
  loading: false,
});
</script>

<template>
  <UButton
    :color="tone === 'destructive' ? 'error' : tone === 'secondary' ? 'neutral' : 'primary'"
    :variant="tone === 'ghost' ? 'ghost' : tone === 'secondary' ? 'soft' : 'solid'"
    :square="iconOnly"
    :icon="icon"
    :label="label"
    :type="type"
    :to="to"
    :disabled="disabled"
    :loading="loading"
    class="action-button"
  >
    <slot />
  </UButton>
</template>
