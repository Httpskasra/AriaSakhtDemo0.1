<template>
  <h1>صفحه تست</h1>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
const { $axios } = useNuxtApp();
const l = "689c8d3e02c24cc35cab5c21";
onMounted(async () => {
  try {
    const response = await $axios.get(`/categories/${l}`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
});
</script>
