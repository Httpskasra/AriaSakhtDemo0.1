<template>
  <div class="factor">
    <div class="off-code item">
      <input type="text" placeholder=" کد تخفیف را وارد کنید" />
      <button>اعمال</button>
    </div>

    <div class="total item">
      <h3>تعداد کل</h3>
      <span>18</span>
    </div>
    <div class="price item">
      <h3>مبلغ سبد خرید</h3>
      <span>15,156,220 تومان</span>
    </div>
    <div class="offer item">
      <h3>درصد تخفیف</h3>
      <span>20%</span>
    </div>
    <div class="total-price item">
      <h3>مبلغ قابل پرداخت</h3>
      <span>15,156,220 تومان</span>
    </div>
    <button class="submit">پرداخت</button>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.factor {
  margin-right: 20px;
  width: 35%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
.factor .off-code {
  display: flex;
  justify-content: center;
  align-items: center;
}
.off-code button {
  background-color: var(--blue-light);
  color: #fff;
  font-family: "iran-yekan-Bold";
  font-size: 14px;
  padding: 11px;
  border-radius: 8px 0 0 8px;
}
.factor .off-code input {
  width: 100%;
  font-size: 14px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0 8px 8px 0;

  border-left: none;
}
.factor {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.factor .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px 0;
}
.factor .item h3 {
  font-family: "iran-yekan-Bold";
  color: var(--gray-400);
  font-size: 16px;
}
.factor .item span {
  font-family: "iran-yekan-num-Bold";
  color: var(--blue-dark);
  font-size: 14px;
}
.factor .submit {
  width: 100%;
  text-align: center;
  background-color: var(--yellow-warning);
  border-radius: 8px;
  padding: 10px;
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  font-size: 16px;
}
.factor .submit:hover {
  background-color: var(--yellow-warning);
  opacity: 0.8;
  cursor: pointer;
}
@media (max-width: 767px) {
  .factor {
    width: 80%;
    margin-right: 0;
    margin-top: 20px;
  }
  .off-code button {
    font-size: 10px;
  }
  .factor .off-code input {
    font-size: 10px;
  }
  .factor .item {
    padding: 15px 0;
  }
  .factor .item h3 {
    font-family: "iran-yekan-Bold";
    color: var(--gray-400);
    font-size: 10px;
  }
  .factor .item span {
    font-size: 12px;
  }
}
</style>
