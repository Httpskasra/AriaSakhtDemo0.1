<template>
  <div>
    <img :src="imgSrc" alt="" />
  </div>
</template>
<script setup>
import { defineProps } from "vue";

defineProps({
  imgSrc: String,
});
</script>
<style scoped>
div {
  width: 100%;
  height: 100%;
}
img {
  border-radius: 10px;
  height: 100%;
  width: 100%;
}
@media (max-width: 600px) {
  div {
    width: 100%;
    height: auto;
    aspect-ratio: 2/1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
}
</style>
