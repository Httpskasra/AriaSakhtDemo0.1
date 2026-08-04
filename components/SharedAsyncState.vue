<script setup lang="ts">
import AsyncState from '~/components/shared/AsyncState.vue';

withDefaults(defineProps<{
  state?: 'loading' | 'empty' | 'error';
  title?: string;
  message?: string;
  retryLabel?: string;
  skeletonRows?: number;
}>(), { state: 'empty', skeletonRows: 3 });

defineEmits<{ retry: [] }>();
</script>

<template>
  <!-- Compatibility alias: new code should import AsyncState directly. -->
  <AsyncState
    :state="state"
    :title="title"
    :message="message"
    :retry-label="retryLabel"
    :skeleton-rows="skeletonRows"
    @retry="$emit('retry')"
  />
</template>
