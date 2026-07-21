<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from '#app'
import { useCategories } from '~/composables/useCategories'
import { useProductSearch } from '~/composables/useProductSearch'

const route = useRoute()
const { categories, load: loadCategories } = useCategories()
const { onFiltersFromSidebar } = useProductSearch()

const selectedCategories = ref<string[]>([])
const maxPrice = ref<number | undefined>(undefined)
const companyName = ref('')

// Initialize state from URL query parameters
const syncStateWithQuery = () => {
  const query = route.query
  
  if (query.categoryIds) {
    selectedCategories.value = Array.isArray(query.categoryIds) 
      ? query.categoryIds as string[] 
      : [query.categoryIds as string]
  } else {
    selectedCategories.value = []
  }

  maxPrice.value = query.maxPrice ? Number(query.maxPrice) : undefined
  companyName.value = (query.companyName as string) || ''
}

onMounted(async () => {
  await loadCategories()
  syncStateWithQuery()
})

// Update UI if URL changes (e.g. user hits back/forward)
watch(() => route.query, () => {
  syncStateWithQuery()
}, { deep: true })

const applyFilters = () => {
  onFiltersFromSidebar({
    categoryIds: selectedCategories.value,
    maxPrice: maxPrice.value,
    companyName: companyName.value
  })
}

const clearFilters = () => {
  selectedCategories.value = []
  maxPrice.value = undefined
  companyName.value = ''
  applyFilters()
}
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm space-y-8 border border-gray-100">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-lg text-gray-800">فیلترها</h3>
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        @click="clearFilters"
      >
        حذف فیلترها
      </UButton>
    </div>

    <!-- Categories -->
    <div class="space-y-4">
      <h4 class="font-semibold text-gray-700 text-sm">دسته‌بندی‌ها</h4>
      <div class="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        <UCheckbox
          v-for="cat in categories"
          :key="cat._id"
          v-model="selectedCategories"
          :value="cat._id"
          :label="cat.name"
          @update:model-value="applyFilters"
        />
      </div>
    </div>

    <!-- Price Range -->
    <div class="space-y-4">
      <h4 class="font-semibold text-gray-700 text-sm">حداکثر قیمت (ریال)</h4>
      <UInput
        v-model.number="maxPrice"
        type="number"
        placeholder="مثلا ۱,۰۰۰,۰۰۰"
        icon="i-lucide-banknote"
        @keyup.enter="applyFilters"
        @blur="applyFilters"
      />
    </div>

    <!-- Company Name -->
    <div class="space-y-4">
      <h4 class="font-semibold text-gray-700 text-sm">نام شرکت / برند</h4>
      <UInput
        v-model="companyName"
        placeholder="جستجوی برند..."
        icon="i-lucide-building-2"
        @keyup.enter="applyFilters"
        @blur="applyFilters"
      />
    </div>

    <div class="pt-4">
      <UButton
        block
        color="primary"
        icon="i-lucide-filter"
        @click="applyFilters"
      >
        اعمال فیلتر
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
