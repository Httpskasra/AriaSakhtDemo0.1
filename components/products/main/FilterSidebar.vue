<template>
  <div class="mt-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">فیلترها</h2>
      <button
        @click="closeSidebar"
        class="md:hidden text-gray-600 hover:text-gray-800"
      >
        ✕
      </button>
    </div>

    <!-- Price Filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">حداکثر قیمت</label>
      <input
        v-model.number="filters.price"
        type="number"
        class="w-full border rounded-lg px-3 py-2"
        placeholder="مثال: 500000"
      />
    </div>

    <!-- Brand Filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">برند</label>
      <select
        v-model="filters.brand"
        class="w-full border rounded-lg px-3 py-2"
      >
        <option value="">همه برندها</option>
        <option value="برند A">برند A</option>
        <option value="برند B">برند B</option>
      </select>
    </div>

    <button
      @click="applyFilters"
      class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      اعمال فیلترها
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const filters = ref({
  price: null,
  brand: null,
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
/* اگر نیاز به استایل خاصی دارید، اینجا اضافه کنید */
</style>
