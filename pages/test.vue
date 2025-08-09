<template>
  <h1>صفحه تست</h1>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
const { $axios } = useNuxtApp();

onMounted(async () => {
  try {
    const { data } = await $axios.get("/auth/me");
    console.log(data.data);
  } catch (error) {
    console.log(error);
  }
});
</script>
