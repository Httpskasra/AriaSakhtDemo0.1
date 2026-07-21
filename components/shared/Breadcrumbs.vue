<template>
  <nav class="flex py-4 text-sm text-gray-500 overflow-x-auto whitespace-nowrap mb-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-2 space-x-reverse">
      <li class="inline-flex items-center">
        <ULink to="/" class="hover:text-primary flex items-center gap-1">
          <UIcon name="i-lucide-house" class="size-4" />
          خانه
        </ULink>
      </li>
      <li v-for="(item, index) in items" :key="index" class="inline-flex items-center">
        <UIcon name="i-lucide-chevron-left" class="size-4 mx-2 text-gray-400" />
        <ULink v-if="item.to" :to="item.to" class="hover:text-primary">
          {{ item.label }}
        </ULink>
        <span v-else class="text-gray-800 font-semibold cursor-default">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>
