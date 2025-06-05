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
      <div
        class="transaction"
        v-for="(transaction, index) in transactions"
        :key="transaction.id"
      >
        <div class="num">{{ index + 1 }}</div>
        <div class="price">{{ transaction.price }}</div>
        <div class="type">{{ transaction.type }}</div>
        <div class="date">{{ transaction.date }}</div>
        <div class="time">{{ transaction.time }}</div>
        <div class="id">88461314984</div>
        <div class="icon">
          <span>واریز</span>
          <img src="/public/icons/up-arrow.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const transactions = ref([
  {
    id: 313412334,
    price: 14222000,
    type: "شارژ حساب",
    date: "1403/02/25",
    time: "22:14:15",
  },
  {
    id: 3134123342,
    price: 14222000,
    type: "شارژ حساب",
    date: "1403/02/25",
    time: "22:14:15",
  },
  {
    id: 313412334543,
    price: 14222000,
    type: "شارژ حساب",
    date: "1403/02/25",
    time: "22:14:15",
  },
  {
    id: 313412334346,
    price: 14222000,
    type: "شارژ حساب",
    date: "1403/02/25",
    time: "22:14:15",
  },
]);
const counter = ref(0);
</script>

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
.transaction .num {
  background-color: rgba(37, 61, 78, 0.8);
  border-radius: 8px;
  padding: 5px 10px;
  color: #fff;
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
@media (max-width: 767px) {
  .container {
    width: 95%;
  }
  .title h2 {
    font-size: 12px;
  }
  .header ul {
    width: 95%;
    font-size: 8px;
    justify-content: space-between;
  }
  .header ul li {
    margin-left: 16px;
  }

  .transaction {
    padding: 8px;
    padding: 10px 0px;
  }
  .transaction * {
    font-size: 8px;
  }
  .transaction .num {
    padding: 2px 6px;
    color: #fff;
  }
  .transaction .icon img {
    width: 14px;
    height: 14px;
  }
}
</style>
