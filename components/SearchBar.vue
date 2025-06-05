<template>
  <div :class="['search-bar-container', { black: dark }]">
    <div class="search">
      <input
        v-model="query"
        @input="handleSearch"
        type="text"
        class="search-input"
        :class="{ black: dark }"
        placeholder="جستجو..."
      />
      <button class="search-button" @submit.prevent="handleSearch">🔍</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// متغیر برای ذخیره مقدار جستجو
const query = ref("");

// تابع برای انجام عملیات جستجو
const handleSearch = () => {
  if (query.value.trim()) {
    // عملیات جستجو (برای این مثال فقط در کنسول چاپ می‌کنیم)
    console.log("جستجو:", query.value);
  }
};
defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.search-bar-container {
  position: relative;
  /* background-color: #fff; */
  border-bottom: 1px solid #ccc;
  /* border-radius: 25px; */
  width: 100%;
  color: white;
}
.search-bar-container.black {
  color: rgb(0, 0, 0);
}
.search-input {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  /* border: 1px solid #ccc; */
  border-radius: 25px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  /* border-color: #007bff; */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
.search-input.black:focus {
  /* border-color: #007bff; */
  box-shadow: none;
}
.search {
  position: relative;
}
.search-button {
  position: absolute;
  left: 10px;
  top: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #007bff;
}

.search-button:hover {
  color: #0056b3;
}
</style>
