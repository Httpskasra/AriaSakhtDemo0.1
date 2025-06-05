<script setup lang="ts">
import { productService } from "~/services/productService";
import { useAuth } from "~/composables/useAuth";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products = ref<Product[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");
const { logout } = useAuth();

async function fetchProducts() {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    products.value = await productService.getProducts();
  } catch (error) {
    errorMessage.value = "خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.";
    console.error("Failed to fetch products:", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleLogout() {
  try {
    await logout();
    navigateTo("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">محصولات</h1>
      <button
        @click="handleLogout"
        class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        خروج
      </button>
    </div>

    <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>
    <div v-if="isLoading" class="text-center">
      <p>در حال بارگذاری...</p>
    </div>
    <ul v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <li
        v-for="product in products"
        :key="product.id"
        class="p-4 border rounded-md hover:shadow-md"
      >
        <h2 class="text-lg font-semibold">{{ product.name }}</h2>
        <p class="text-gray-600">{{ product.price }} تومان</p>
      </li>
    </ul>
  </div>
</template>
