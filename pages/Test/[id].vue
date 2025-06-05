<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">جزئیات محصول</h1>
    <div v-if="loading">در حال بارگذاری...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="data">
      <h2 class="text-xl">{{ data.name }}</h2>
      <p class="text-gray-600">قیمت: {{ data.price }} تومان</p>
      <p>{{ data.description }}</p>
    </div>
    <div v-else class="text-gray-500">محصولی یافت نشد</div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = route.params.id;

const { data, loading, error } = useProductById(id);
</script>
