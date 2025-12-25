<template>
  <div :class="['search-bar-container', { black: dark }]">
    <div class="search">
      <input
        v-model="searchInput"
        @keyup.enter="handleSearch"
        type="text"
        class="search-input"
        :class="{ black: dark }"
        placeholder="جستجو..." />
      <button class="search-button" @click="handleSearch">🔍</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "#app";

const props = withDefaults(
  defineProps<{
    dark?: boolean;
  }>(),
  {
    dark: false,
  }
);

const router = useRouter();
const route = useRoute();
const searchInput = ref("");

const updateInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  searchInput.value = value;
};

const handleSearch = async () => {
  const searchQuery = searchInput.value?.trim() || "";

  //console.log("🔍 Search triggered:", searchQuery);

  // فقط اگر کوئری خالی نباشد
  if (searchQuery) {
    // بررسی: آیا در صفحه products هستیم؟
    const isProductsPage = route.path.includes("/products");

    //console.log("📍 Current path:", route.path);
    //console.log("📍 Is products page:", isProductsPage);

    if (!isProductsPage) {
      // اگر در صفحه دیگری هستیم، به products برویم
      //console.log("➡️ Navigating to products with query:", searchQuery);
      await router.push({
        path: "/products",
        query: { query: searchQuery, page: 1, limit: 12 },
      });
      // ریست کردن مقدار input
      searchInput.value = "";
    } else {
      // اگر در صفحه products هستیم، فقط کوئری را آپدیت کنید
      //console.log("🔄 Updating search on products page:", searchQuery);
      await router.push({
        path: "/products",
        query: {
          ...route.query,
          query: searchQuery,
          page: 1,
        },
      });
    }
  } else {
    //console.log("⚠️ Empty search query");
  }
};
</script>

<style scoped>
.search-bar-container {
  position: relative;
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
  border-radius: 25px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input.black:focus {
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
