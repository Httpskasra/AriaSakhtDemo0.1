<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '~/types/order'

const props = defineProps<{
  status: OrderStatus
}>()

const config = computed(() => getOrderStatusConfig(props.status))
</script>

<template>
  <StatusPill
    :label="config.label"
    :semantic="config.semantic"
    :icon="config.icon"
  />
</template>
