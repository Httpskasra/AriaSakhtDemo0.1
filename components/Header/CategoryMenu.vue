<script setup lang="ts">
import { useCategories } from "~/composables/useCategories";
import type { Category } from "~/services/categories";

const isOpen = ref(false);
const { categories, load } = useCategories();
await load().catch(() => undefined);

const topLevelCategories = computed(() => categories.value.filter((category) => !category.parentId));
const childrenOf = (category: Category) => categories.value.filter((child) => child.parentId === (category._id || category.id));
const categoryId = (category: Category) => category._id || category.id || category.slug || category.name;
const categoryPath = (category: Category) => `/products?categoryIds=${encodeURIComponent(categoryId(category))}`;
</script>

<template>
  <div class="relative group h-full py-3" @keydown.escape="isOpen = false">
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      class="flex items-center gap-2 text-slate-700 font-bold text-sm hover:text-primary-600 transition-colors outline-none"
      @click="isOpen = !isOpen"
      @keydown.enter.prevent="isOpen = true"
      @keydown.space.prevent="isOpen = true">
      <UIcon name="i-lucide-grid-3x3" class="size-icon-action" />
      دسته‌بندی‌ها
      <UIcon name="i-lucide-chevron-down" class="size-icon-inline group-hover:rotate-180 transition-transform" />
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full start-0 mt-0 w-[80vw] max-w-5xl bg-white shadow-2xl rounded-b-2xl border-x border-b border-slate-100 z-50 p-6 flex gap-8">
      <div class="w-1/4 border-l border-slate-100 pr-2">
        <div class="space-y-4">
          <NuxtLink
            v-for="category in topLevelCategories"
            :key="categoryId(category)"
            :to="categoryPath(category)"
            class="w-full text-right text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors flex items-center justify-between group/item"
            @click="isOpen = false">
            {{ category.name }}
            <UIcon name="i-lucide-chevron-left" class="size-icon-compact opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
          </NuxtLink>
        </div>
      </div>

      <div class="flex-grow grid grid-cols-3 gap-8">
        <div v-for="category in topLevelCategories.slice(0, 3)" :key="`children-${categoryId(category)}`">
          <NuxtLink :to="categoryPath(category)" class="block font-black text-primary-600 text-sm mb-4" @click="isOpen = false">
            {{ category.name }}
          </NuxtLink>
          <ul class="space-y-3 text-slate-500 text-xs font-medium">
            <li v-for="child in childrenOf(category)" :key="categoryId(child)">
              <NuxtLink :to="categoryPath(child)" class="hover:text-slate-900" @click="isOpen = false">{{ child.name }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
