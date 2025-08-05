<template>
  <section class="container">
    <div class="right">
      <Right />
    </div>
    <div
      class="products"
      ref="productsRef"
      @mousedown="onMouseDown"
      @mouseleave="onMouseLeave"
      @mouseup="onMouseUp"
      @mousemove="onMouseMove"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd">
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
      <SingleProduct :productID="1" />
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const productsRef = ref(null);
const isDown = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

function isDesktop() {
  return window.innerWidth > 767;
}

function onMouseDown(e) {
  if (!isDesktop()) return;
  isDown.value = true;
  startX.value = e.pageX - productsRef.value.offsetLeft;
  scrollLeft.value = productsRef.value.scrollLeft;
  productsRef.value.style.cursor = "grabbing";
}

function onMouseLeave() {
  if (!isDesktop()) return;
  isDown.value = false;
  productsRef.value.style.cursor = "";
}

function onMouseUp() {
  if (!isDesktop()) return;
  isDown.value = false;
  productsRef.value.style.cursor = "";
}

function onMouseMove(e) {
  if (!isDesktop() || !isDown.value) return;
  e.preventDefault();
  const x = e.pageX - productsRef.value.offsetLeft;
  const walk = (x - startX.value) * 1.2; // scroll speed
  productsRef.value.scrollLeft = scrollLeft.value - walk;
}

let touchStartX = 0;
let touchScrollLeft = 0;

function onTouchStart(e) {
  if (isDesktop()) return;
  touchStartX = e.touches[0].pageX - productsRef.value.offsetLeft;
  touchScrollLeft = productsRef.value.scrollLeft;
}

function onTouchMove(e) {
  if (isDesktop()) return;
  const x = e.touches[0].pageX - productsRef.value.offsetLeft;
  const walk = (x - touchStartX) * 1.2;
  productsRef.value.scrollLeft = touchScrollLeft - walk;
}

function onTouchEnd() {
  // nothing needed
}
</script>

<style scoped>
.container {
  margin-top: 35px;
  margin: 15px auto;
  position: relative;
  display: flex;
  width: 90%;
  height: 400px;
  justify-content: space-evenly;
  align-items: center;
}
.right {
  position: relative;
  flex-basis: 22%;
  height: 100%;
  min-width: 260px;
  padding: 0;
  background: #ffff;

  /* Main */

  box-shadow: 5px 5px 32.4px rgba(176, 176, 176, 0.38);
  border-radius: 0 15px 15px 0;
}
.products {
  margin: auto;
  flex-basis: 60%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  bottom: 20px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
  cursor: grab;
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 5px auto;
  }
  .right {
    flex-basis: 7%;
    width: 100%;
    height: 20px;
    padding: 0;
    border-radius: 8px 8px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .products {
    width: 100%;
    height: 500px;
    flex-basis: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding-right: 10px;
  }
}
</style>
