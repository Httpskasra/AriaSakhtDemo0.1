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
    // اگر در صفحه products نیستیم، به آنجا بروید
    if (route.name !== "products") {
      router.push({
        name: "products",
        query: { query: searchQuery, page: 1 },
      });
      // ریست کردن مقدار input در صفحه دیگری
      emit("update:modelValue", "");
    } else {
      // اگر در صفحه products هستیم، فقط کوئری را آپدیت کنید
      router.replace({
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
  /* border: 1px solid #ccc; */
  border-radius: 25px;
  outline: none;
  transition: all 0.3s ease;
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
