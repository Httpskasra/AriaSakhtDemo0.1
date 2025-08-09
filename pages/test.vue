<template>
  <h1>صفحه تست</h1>
</template>
<script setup lang="ts">
const { $axios } = useNuxtApp();
try {
  const { data } = await $axios.get("/auth/me");
  console.log(data.data);
} catch (error) {
  console.log(error);
}
</script>
