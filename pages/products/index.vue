<template>
  <NuxtLayout>
    <div class="w-full mx-auto px-4 sm:px-8">
      <div class="flex justify-between items-center w-full md:w-1/2 mx-auto">
        <div class="flex items-center space-x-6 rtl:space-x-reverse">
          <SortFilter />
          <RecordCount :count="filteredProducts.length" />
        </div>
        <button
          @click="toggleSidebar"
          class="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          فیلترها
        </button>
      </div>

      <div class="flex w-full flex-col md:flex-row ">
        <div
          class="fixed md:sticky top-16 md:top-10 right-0 w-full md:w-72 bg-white shadow-lg p-6 z-50 transition-transform duration-300 overflow-y-auto md:h-[60vh] h-[100vh]"
          :class="{
            'translate-x-0': isSidebarOpen,
            'translate-x-full md:translate-x-0': !isSidebarOpen && !$mq.md,
            'md:translate-x-0 md:right-0': $mq.md,
          }"
        >
          <FilterSidebar @apply-filters="applyFilters" />
        </div>

        <div class="pt-20 md:pt-0 flex-1 w-full mx-auto ">
          <ProductGrid :products="filteredProducts" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMediaQuery } from "@vueuse/core";

const $mq = useMediaQuery("(min-width: 768px)");

const products = ref([
  { id: 1, name: "محصول 1", price: 100000, brand: "برند A" },
  { id: 2, name: "محصول 2", price: 150000, brand: "برند B" },
  { id: 3, name: "محصول 3", price: 200000, brand: "برند A" },
  { id: 4, name: "محصول 4", price: 150000, brand: "برند B" },
  { id: 5, name: "محصول 5", price: 200000, brand: "برند A" },
  { id: 6, name: "محصول 6", price: 150000, brand: "برند B" },
  { id: 7, name: "محصول 7", price: 200000, brand: "برند A" },
  { id: 8, name: "محصول 8", price: 150000, brand: "برند B" },
  { id: 9, name: "محصول 9", price: 200000, brand: "برند A" },
  { id: 10, name: "محصول 10", price: 150000, brand: "برند B" },
  { id: 11, name: "محصول 11", price: 200000, brand: "برند A" },
  { id: 12, name: "محصول 12", price: 150000, brand: "برند B" },
]);

const isSidebarOpen = ref(false);
const filters = ref({ price: null, brand: null });
const sortOption = ref("default");

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const applyFilters = (newFilters) => {
  filters.value = newFilters;
  isSidebarOpen.value = false;
};

const filteredProducts = computed(() => {
  let result = [...products.value];

  if (filters.value.price) {
    result = result.filter((product) => product.price <= filters.value.price);
  }
  if (filters.value.brand) {
    result = result.filter((product) => product.brand === filters.value.brand);
  }
  if (sortOption.value === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
});
</script>
