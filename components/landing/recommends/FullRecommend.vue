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
      <SingleProduct
        v-if="products && products.length"
        v-for="p in products"
        :key="getId(p)"
        :productId="String(getId(p))" />
      <template v-else>
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
defineProps<{ products?: Array<{ id?: string | number } | string | number> }>();

const productsRef = ref(null as null | HTMLElement);
const isDown = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

function isDesktop() {
  return window.innerWidth > 767;
}

function onMouseDown(e: MouseEvent) {
  if (!isDesktop()) return;
  isDown.value = true;
  if (!productsRef.value) return;
  startX.value = (e as any).pageX - (productsRef.value as any).offsetLeft;
  scrollLeft.value = (productsRef.value as any).scrollLeft;
  (productsRef.value as any).style.cursor = "grabbing";
}

function onMouseLeave() {
  if (!isDesktop()) return;
  isDown.value = false;
  if (productsRef.value) (productsRef.value as any).style.cursor = "";
}

function onMouseUp() {
  if (!isDesktop()) return;
  isDown.value = false;
  if (productsRef.value) (productsRef.value as any).style.cursor = "";
}

function onMouseMove(e: MouseEvent) {
  if (!isDesktop() || !isDown.value || !productsRef.value) return;
  e.preventDefault();
  const x = (e as any).pageX - (productsRef.value as any).offsetLeft;
  const walk = (x - startX.value) * 1.2; // scroll speed
  (productsRef.value as any).scrollLeft = scrollLeft.value - walk;
}

let touchStartX = 0;
let touchScrollLeft = 0;

function onTouchStart(e: TouchEvent) {
  if (isDesktop() || !productsRef.value) return;
  touchStartX = e.touches[0].pageX - (productsRef.value as any).offsetLeft;
  touchScrollLeft = (productsRef.value as any).scrollLeft;
}

function onTouchMove(e: TouchEvent) {
  if (isDesktop() || !productsRef.value) return;
  const x = e.touches[0].pageX - (productsRef.value as any).offsetLeft;
  const walk = (x - touchStartX) * 1.2;
  (productsRef.value as any).scrollLeft = touchScrollLeft - walk;
}

function onTouchEnd() {
  // nothing needed
}

function getId(p: any) {
  if (p == null) return "";
  if (typeof p === "string" || typeof p === "number") return String(p);
  if (typeof p === "object") return String((p as any).id ?? "");
  return String(p);
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
  height: 50%;
  min-width: 260px;
  padding: 0;
  background: #ffff;
  display: flex;
  flex-direction: column;
  /* Main */

  box-shadow: 5px 5px 32.4px rgba(176, 176, 176, 0.38);
  border-radius: 0 15px 15px 0;
}
.products {
  margin: auto;
  width: 100%;
  flex-basis: 60%;
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: center;
  align-items: flex-start;
  position: relative;
  bottom: 20px;
  flex: 1;
  overflow-x: auto;
  /* overflow-y: auto; */
  padding: 10px 0;
  cursor: grab;
  gap: 20px;
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
