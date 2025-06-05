<template>
  <div class="container">
    <div class="title">
      <h2>تراکنش ها</h2>
    </div>
    <div class="header">
      <ul>
        <li>ردیف</li>
        <li>مبلغ</li>
        <li>نوع تراکنش</li>
        <li>تاریخ</li>
        <li>زمان</li>
        <li>شماره پیگیری</li>
        <li></li>
      </ul>
    </div>
    <div class="transactions">
      <div class="transaction">
        <div class="num">1</div>
        <div class="price">14,222,333</div>
        <div class="type">شارژ حساب</div>
        <div class="date">1403/12/05</div>
        <div class="time">22:14:55</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
      <div class="transaction">
        <div class="num">1</div>
        <div class="price">14,222,333</div>
        <div class="type">شارژ حساب</div>
        <div class="date">1403/12/05</div>
        <div class="time">22:14:55</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
      <div class="transaction">
        <div class="num">1</div>
        <div class="price">14,222,333</div>
        <div class="type">شارژ حساب</div>
        <div class="date">1403/12/05</div>
        <div class="time">22:14:55</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
      <div class="transaction">
        <div class="num">1</div>
        <div class="price">14,222,333</div>
        <div class="type">شارژ حساب</div>
        <div class="date">1403/12/05</div>
        <div class="time">22:14:55</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
      <div class="transaction">
        <div class="num">1</div>
        <div class="price">14,222,333</div>
        <div class="type">شارژ حساب</div>
        <div class="date">1403/12/05</div>
        <div class="time">22:14:55</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
      <div class="transaction">
        <div class="num">1</div>
        <div class="price">14,222,333</div>
        <div class="type">شارژ حساب</div>
        <div class="date">1403/12/05</div>
        <div class="time">22:14:55</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
      <div class="transaction">
        <div class="num">1</div>
        <div class="price">14,222,333</div>
        <div class="type">شارژ حساب</div>
        <div class="date">1403/12/05</div>
        <div class="time">22:14:55</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.container {
  width: 85%;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}
.title h2 {
  font-family: "iran-yekan-Bold";
  color: var(--blue-dark);
  font-size: 24px;
}
.header {
  margin: 10px 0;
}
.header ul {
  padding: 10px;
  width: 95%;
  display: flex;
  justify-content: space-between;
}
.transactions {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.transaction {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 99%;
  text-align: center;
  padding: 20px;
}
.transaction:hover {
  background-color: var(--blue-sky);
  transition: 0.5s;
  cursor: pointer;
}
.transaction * {
  font-family: "iran-yekan-num-Medium";
  color: var(--blue-dark);
  font-size: 20px;
}
.transaction .icon {
  display: flex;
}
.transaction .icon span {
  color: var(--green-number);
  margin: 0 10px;
}
.transaction .icon img {
  width: 24px;
  height: 24px;
}
.transaction .price {
  font-family: "iran-yekan-num-Bold";
  color: var(--green-number);
}
</style>
