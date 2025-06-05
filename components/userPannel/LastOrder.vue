<template>
  <div class="last-order">
    <NuxtLink to="/" class="see-more">مشاهده همه سفارش ها -></NuxtLink>
    <div class="status">
      <img src="/icons/delivery-truck.png" alt="" />
      <p>در حال ارسال</p>
      <span>4 سفارش</span>
    </div>
    <div class="status">
      <img src="/icons/product-delivered.png" alt="" />
      <p>ارسال شده</p>
      <span>4 سفارش</span>
    </div>
    <div class="status">
      <img src="/icons/payment.png" alt="" />
      <p>در انتظار پرداخت</p>
      <span>4 سفارش</span>
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
@media (max-width: 767px) {
  .last-order {
    width: 90%;
    height: 156px;
    padding: 10px 0;
  }
  .last-order .status {
    margin: 10px 20px 10px 20px;
    font-size: 12px;
  }
  .last-order .status img {
    width: 46px;
    height: 46px;
  }
  .last-order .status span {
    font-size: 10px;
  }
  .see-more {
    font-size: 8px;
    top: 6px;
  }
}
</style>
