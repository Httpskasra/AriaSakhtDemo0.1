<script setup lang="ts">
import type { StatusSemantic, StatusValue } from "~/composables/useStatusStyle";

const props = withDefaults(defineProps<{
  label: string;
  status?: StatusValue;
  semantic?: StatusSemantic;
  icon?: string;
  size?: "compact" | "default";
}>(), {
  status: undefined,
  semantic: undefined,
  icon: undefined,
  size: "default",
});

const resolvedSemantic = computed(() => props.semantic || getStatusSemantic(props.status));
</script>

<template>
  <StatusPill :label="label" :semantic="resolvedSemantic" :icon="icon" :size="size" />
</template>
