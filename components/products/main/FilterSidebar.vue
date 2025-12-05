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
        <span>{{ filters.maxPrice.toLocaleString() }} تومان</span>
        <span>1,000,000</span>
      </div>
      <input
        v-model.number="filters.maxPrice"
        type="range"
        min="0"
        max="1000000"
        step="10000"
        class="w-full accent-blue-600 cursor-pointer" />
    </div>

    <!-- Brand Filter (Companies) -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2 text-gray-700">برند</label>
      <select
        v-model="filters.companyName"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        :disabled="companiesLoading">
        <option value=" ">همه برندها</option>
        <option
          v-for="company in companies"
          :key="company._id"
          :value="company.name">
          {{ company.name }}
        </option>
      </select>
      <p v-if="companiesLoading" class="text-xs text-gray-500 mt-1">
        در حال بارگذاری...
      </p>
    </div>

    <!-- Category Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2 text-gray-700"
        >دسته‌بندی</label
      >
      <div class="space-y-2">
        <div v-if="categoriesLoading" class="text-xs text-gray-500">
          در حال بارگذاری...
        </div>
        <div
          v-else
          v-for="category in categories"
          :key="category._id"
          class="flex items-center">
          <input
            type="checkbox"
            :id="'cat-' + category._id"
            :value="category._id"
            v-model="filters.categoryIds"
            class="w-4 h-4 rounded accent-blue-600" />
          <label
            :for="'cat-' + category._id"
            class="mr-2 text-sm text-gray-700 cursor-pointer">
            {{ category.name }}
          </label>
        </div>
      </div>
    </div>

    <!-- Apply Button -->
    <button
      @click="applyFilters"
      class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 transition-all">
      ✅ اعمال فیلترها
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

interface Company {
  _id: string;
  name: string;
}

const filters = ref({
  maxPrice: 500000,
  companyName: "",
  categoryIds: [] as string[],
});

const categories = ref<Category[]>([]);
const companies = ref<Company[]>([]);
const categoriesLoading = ref(false);
const companiesLoading = ref(false);

const emit = defineEmits<{
  "apply-filters": [
    filters: {
      maxPrice?: number;
      companyName?: string;
      categoryIds?: string[];
    }
  ];
}>();

onMounted(async () => {
  await fetchCategories();
  await fetchCompanies();
});

const fetchCategories = async () => {
  try {
    categoriesLoading.value = true;
    const { $axios } = useNuxtApp();
    const response = await $axios.get("/categories");
    categories.value = response.data.data || response.data || [];
  } catch (error) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", error);
  } finally {
    categoriesLoading.value = false;
  }
};

const fetchCompanies = async () => {
  try {
    companiesLoading.value = true;
    const { $axios } = useNuxtApp();
    const response = await $axios.get("/companies");
    companies.value = response.data.data || response.data || [];
  } catch (error) {
    console.error("خطا در دریافت برندها:", error);
  } finally {
    companiesLoading.value = false;
  }
};

const applyFilters = () => {
  // اگر categoryIds خالی است، باید خالی ارسال شود تا از query حذف شود
  const filtersToEmit: any = {
    maxPrice: filters.value.maxPrice,
    companyName: filters.value.companyName || "",
    categoryIds: filters.value.categoryIds, // حتی اگر خالی باشد
  };

  emit("apply-filters", filtersToEmit);
};

const closeSidebar = () => {
  applyFilters();
};
</script>

<style scoped>
input[type="range"] {
  height: 6px;
  border-radius: 4px;
  background: linear-gradient(to right, #2563eb, #60a5fa);
}
</style>
