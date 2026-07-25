<script setup lang="ts">
type AsyncState = "loading" | "error" | "empty";

const props = withDefaults(
  defineProps<{
    state?: AsyncState;
    title?: string;
    message?: string;
    skeletonRows?: number;
  }>(),
  {
    state: "empty",
    title: "",
    message: "",
    skeletonRows: 3,
  },
);

const emit = defineEmits<{ retry: [] }>();

const showSkeletons = computed(() => props.state === "loading");
</script>

<template>
  <div class="w-full py-8 px-4 sm:px-6">
    <div v-if="state === 'loading'" class="flex flex-col items-center justify-center gap-4 text-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-slate-100 text-slate-500">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin" />
      </div>

      <div class="space-y-2">
        <h3 v-if="title" class="text-lg font-bold text-slate-800">{{ title }}</h3>
        <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
      </div>

      <div v-if="showSkeletons" class="w-full max-w-xl space-y-3">
        <div v-for="index in skeletonRows" :key="index" class="h-14 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    </div>

    <div v-else-if="state === 'error'" class="flex flex-col items-center justify-center gap-4 text-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-red-50 text-red-500">
        <UIcon name="i-lucide-triangle-alert" class="size-8" />
      </div>

      <div class="space-y-2">
        <h3 v-if="title" class="text-lg font-bold text-slate-800">{{ title }}</h3>
        <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
      </div>

      <UButton color="primary" variant="soft" class="rounded-full px-6" @click="emit('retry')">
        تلاش مجدد
      </UButton>
    </div>

    <div v-else class="flex flex-col items-center justify-center gap-4 text-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-slate-100 text-slate-400">
        <UIcon name="i-lucide-inbox" class="size-8" />
      </div>

      <div class="space-y-2">
        <h3 v-if="title" class="text-lg font-bold text-slate-800">{{ title }}</h3>
        <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
      </div>
    </div>
  </div>
</template>
