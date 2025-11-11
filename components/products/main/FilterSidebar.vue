<template>
  <div class="p-4 bg-white rounded-xl shadow-md border border-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        🧩 فیلترها
      </h2>
      <button
        @click="closeSidebar"
        class="md:hidden text-gray-500 hover:text-gray-700 transition">
        ✕
      </button>
    </div>

    <!-- Price Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2 text-gray-700"
        >حداکثر قیمت</label
      >
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>0</span>
        <span>{{ filters.price.toLocaleString() }} تومان</span>
        <span>1,000,000</span>
      </div>
      <input
        v-model.number="filters.price"
        type="range"
        min="0"
        max="1000000"
        step="10000"
        class="w-full accent-blue-600 cursor-pointer" />
    </div>

    <!-- Brand Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2 text-gray-700">برند</label>
      <select
        v-model="filters.brand"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <option value="">همه برندها</option>
        <option value="برند A">برند A</option>
        <option value="برند B">برند B</option>
        <option value="برند C">برند C</option>
      </select>
    </div>

    <!-- Category Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2 text-gray-700"
        >دسته‌بندی</label
      >
      <select
        v-model="filters.category"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <option value="">همه دسته‌ها</option>
        <option value="الکترونیک">الکترونیک</option>
        <option value="پوشاک">پوشاک</option>
        <option value="لوازم خانگی">لوازم خانگی</option>
      </select>
    </div>

    <!-- Apply Button -->
    <button
      @click="applyFilters"
      class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 transition-all">
      ✅ اعمال فیلترها
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const filters = ref({
  price: 500000,
  brand: "",
  category: "",
});

const emit = defineEmits(["apply-filters"]);

const applyFilters = () => {
  emit("apply-filters", { ...filters.value });
};

const closeSidebar = () => {
  emit("apply-filters", { ...filters.value });
};
</script>

<style scoped>
input[type="range"] {
  height: 6px;
  border-radius: 4px;
  background: linear-gradient(to right, #2563eb, #60a5fa);
}
</style>
