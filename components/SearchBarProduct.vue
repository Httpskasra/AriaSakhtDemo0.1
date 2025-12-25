<template>
  <div :class="['search-bar-container', { black: dark }]">
    <div class="search">
      <input
        :value="modelValue"
        @keyup.enter="handleSearch"
        @input="updateInput"
        type="text"
        class="search-input"
        :class="{ black: dark }"
        placeholder="جستجو..." />
      <button class="search-button" @click="handleSearch">🔍</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "#app";

const props = withDefaults(
  defineProps<{
    dark?: boolean;
    modelValue?: string;
  }>(),
  {
    dark: false,
    modelValue: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const router = useRouter();
const route = useRoute();

const updateInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);
};

const handleSearch = () => {
  const searchQuery = props.modelValue?.trim() || "";

  // فقط اگر کوئری خالی نباشد
  if (searchQuery) {
    // بررسی: آیا در صفحه products هستیم؟
    const isProductsPage = route.path.includes("/products");

    if (!isProductsPage) {
      // اگر در صفحه دیگری هستیم، به products برویم
      router.push({
        path: "/products",
        query: { query: searchQuery, page: 1, limit: 12 },
      });
      // ریست کردن مقدار input
      emit("update:modelValue", "");
    } else {
      // اگر در صفحه products هستیم، فقط کوئری را آپدیت کنید
      router.push({
        path: "/products",
        query: {
          ...route.query,
          query: searchQuery,
          page: 1,
        },
      });
    }
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
