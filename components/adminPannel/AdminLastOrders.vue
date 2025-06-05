<template>
  <div class="last-order">
    <NuxtLink to="/" class="see-more">مشاهده همه سفارش ها -></NuxtLink>
    <div class="status">
      <img src="/adminIcon/pending.png" alt="" />
      <p>در حال پردازش</p>
      <span>4 سفارش</span>
    </div>
    <div class="status">
      <img src="/adminIcon/product-delivered.png" alt="" />
      <p>تایید شده</p>
      <span>4 سفارش</span>
    </div>
    <div class="status">
      <img src="/adminIcon/materials.png" alt="" />
      <p>محصولات</p>
      <span>4 محصول</span>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.last-order {
  position: relative;
  margin: auto;
  width: 1000px;
  height: 242px;
  display: flex;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
}
.last-order .status {
  margin: 20px 100px 20px 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
}
.last-order .status p,
.last-order .status span {
  color: var(--blue-dark);
  font-family: "iran-yekan-num-regular";
}
.last-order img {
  width: 120px;
  height: 120px;
}

.see-more {
  font-family: "iran-yekan-Light";
  color: var(--blue-bright);
  font-size: 10px;
  position: absolute;
  top: 15px;
  left: 15px;
}
</style>
