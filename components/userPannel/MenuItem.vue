<template>
  <div class="container" :class="{ active: isactive }">
    <div class="icon">
      <slot />
    </div>
    <div class="title">
      <span>{{ name }}</span>
    </div>
  </div>
</template>

<script setup>
const { name, isactive } = defineProps(["name", "isactive"]);
</script>
<style scoped></style>
