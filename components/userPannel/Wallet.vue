<template>
  <div class="wallet">
    <div class="title">
      <p>موجودی کیف پول</p>
      <img src="/icons/wallet.png" alt="" />
    </div>
    <div class="price">
      <span>1,000,000 </span>
      <p>ریال</p>
    </div>
    <p class="last-transction">آخرین تراکنش ها</p>
    <div class="transactions">
      <div class="transaction" :class="{ success: true }">
        <span>1,000,000 ریال</span>
        <p>واریز</p>
        <img src="/icons/up-arrow.png" alt="" />
      </div>
      <div class="transaction" :class="{ success: false }">
        <span>1,000,000 ریال</span>
        <p>خرید</p>
        <img src="/icons/down-arrow.png" alt="" />
      </div>
    </div>
    <div class="btns">
      <button class="charge">
        شارژ کیف پول<img src="/icons/plus.png" alt="" />
      </button>
      <button class="drawal">
        برداشت از کیف پول<img src="/icons/minus.png" alt="" />
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.wallet {
  width: 390px;
  height: 370px;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  /* right: 600px;
  top: 20px; */
  padding: 15px;
}
.wallet .title {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px;
  width: 80%;
}
.wallet .title p {
  font-family: "iran-yekan-Bold";
  font-size: 24px;
  color: var(--blue-dark);
}
.wallet .title img {
  width: 66px;
  height: 66px;
}
.wallet .price {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}
.wallet .price p {
  font-family: "iran-yekan-Bold";
  color: var(--blue-dark);
  font-size: 14px;
  margin: 10px;
}
.wallet .price span {
  font-family: "iran-yekan-num-Bold";
  color: var(--green-number);
  font-size: 32px;
}
.wallet .last-transaction {
  font-family: "iran-yekan-num-DemiBold";
  color: var(--blue-dark);
  font-size: 14px;
  margin: 20px;
}
.wallet .transactions {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wallet .transaction {
  width: 100%;
  justify-content: flex-end;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  color: var(--red-danger);
  font-size: 14px;
  font-family: "iran-yekan-num-Bold";
}
.wallet .transaction.success {
  justify-content: flex-start;
  color: var(--green-number);
}
.wallet .transaction * {
  margin-right: 10px;
}

.wallet .transaction img {
  width: 17px;
  height: 17px;
}
.wallet .btns {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
}
.wallet .btns button {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: var(--blue-light) 1px solid;
  border-radius: 12px;
  color: var(--blue-light);
  padding: 10px 8px;
  font-family: "iran-yekan-num-Medium";
  font-size: 13px;
}
.wallet .btns button:hover {
  background-color: var(--blue-light);
  color: #fff;
  cursor: pointer;
  transition-duration: 0.5s;
}
.wallet .btns img {
  width: 23px;
  height: 23px;
  margin: 0 10px 0 0;
}
@media (max-width: 767px) {
  .wallet {
    width: 90%;
  }

  .wallet .title img {
    width: 40px;
    height: 40px;
  }
}
</style>
