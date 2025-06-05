<template>
  <div class="container-img">
    <div class="main">
      <img :src="data.image" alt="" />
    </div>
    <div class="sub">
      <img src="/products/ajor.jpg" alt="" />
      <img src="/products/ajor.jpg" alt="" />
      <img src="/products/ajor.jpg" alt="" />
    </div>
    <button class="prev">
      <svg
        width="21"
        height="34"
        viewBox="0 0 21 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.7453 33.688L0.13725 20.632V13.912L20.7453 0.919998V8.728L6.47325 17.304L20.7453 25.944V33.688Z"
          fill="#666666"
        />
      </svg>
    </button>
    <button class="next">
      <svg
        width="21"
        height="34"
        viewBox="0 0 21 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.254749 33.688L20.8627 20.632V13.912L0.254749 0.919998V8.728L14.5267 17.304L0.254749 25.944V33.688Z"
          fill="#666666"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";
const props = defineProps<{
  data: Product;
}>();
</script>
<style scoped>
.container-img {
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 400px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 60px;
  background-color: #fff;
  padding: 20px;
  position: relative;
  bottom: 60px;
}
.main {
  width: 90%;
  height: 285px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.sub {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  padding: 10px;
}
.sub img {
  width: 100px;
  height: 75px;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}
.sub img:first-child {
  border: none;
}
button {
  position: absolute;
  cursor: pointer;
}
button.next {
  right: 10px;
}
button.prev {
  left: 10px;
}
@media (max-width: 767px) {
  .container-img {
    width: 90%;
    height: 350px;
    margin: auto;
  }
  button svg {
    width: 10px;
  }
  .sub img {
    width: 30%;
  }
}
</style>
