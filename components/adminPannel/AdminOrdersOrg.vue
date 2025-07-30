<template>
  <div class="container">
    <div class="header">
      <ul>
        <li>ردیف</li>
        <li>نام محصول</li>
        <li>قیمت</li>
        <li>واحد</li>
        <li>تاریخ</li>
        <li>کد پیگیری</li>
        <li>وضعیت</li>
      </ul>
    </div>
    <div class="transactions">
      <div class="transaction" v-for="order in orders" :key="order.id">
        <div class="num">{{ order.id }}</div>
        <div class="name">{{ order.name }}</div>
        <div class="price">{{ order.price }}</div>
        <div class="unit">{{ order.unit }}</div>
        <div class="date">{{ order.date }}</div>
        <div class="id">{{ order.trackingCode }}</div>
        <div class="status">
          {{ order.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const orders = [
  {
    id: 1,
    name: "آجر",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 2,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 6,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
  {
    id: 7,
    name: "آجر 1",
    price: 100000,
    unit: "کیلوگرم",
    date: "1403/12/05",
    trackingCode: "88461314984",
    status: "تایید شده",
  },
];
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.header ul {
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.header ul li {
  font-family: "iran-yekan-num-Regular";
  font-size: 12px;
  flex: 1 1 0;
  text-align: center;
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header ul li:first-child {
  flex: 0.5 1 0;
  min-width: 32px;
  max-width: 40px;
  padding: 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  width: 100%;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}
.transaction > div {
  flex: 1 1 0;
  text-align: center;
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transaction > .num {
  flex: 0.5 1 0;
  min-width: 32px;
  max-width: 40px;
  padding: 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transaction:hover {
  background-color: var(--blue-sky);
  transition: 0.5s;
  cursor: pointer;
}
.transaction * {
  font-family: "iran-yekan-num-Medium";
  color: var(--blue-dark);
  font-size: 12px;
}
.transaction .name {
  font-family: "iran-yekan-Bold";
  font-size: 12px;
}
.transaction .id {
  font-family: "iran-yekan-num-Bold";
  font-size: 12px;
}

.transaction .status {
  color: var(--green-number);
  background-color: rgba(0, 186, 0, 0.2);
  padding: 5px;
  border-radius: 6px;
  font-family: "iran-yekan-num-Regular";
  font-size: 10px;
}
@media (max-width: 767px) {
  .container {
    width: 100%;
    padding: 10px 10px;
    overflow-x: auto;
  }
  .header {
    min-width: 420px;
    margin: auto;
  }
  .header ul {
    padding: 6px 2px;
    gap: 2px;
  }
  .header ul li {
    font-family: "iran-yekan-num-Regular";
    font-size: 9px;
    padding: 0 1px;
    margin: 0 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .transactions {
    width: 100%;
    min-width: 420px;
  }
  .transaction {
    padding: 8px 2px;
    gap: 2px;
  }

  .transaction * {
    font-size: 8px !important;
  }

  .transaction > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .transaction > .num {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .see-more {
    font-size: 12px;
    padding: 6px 0;
    display: block;
    margin: 8px auto 0 auto;
    width: max-content;
  }
  .transaction .status {
    font-size: 7px !important;
    padding: 3px !important;
  }
}
</style>
