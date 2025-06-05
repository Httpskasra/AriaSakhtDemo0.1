<template>
  <div class="container">
    <div class="item" v-for="order in orders" :key="order.id">
      <span class="see-more">مشاهده جزئیات</span>
      <div class="status">
        <img src="/icons/check.png" alt="" />
        <p>انجام شده</p>
      </div>
      <div class="infos">
        <div class="info">
          <p class="name">شناسه تراکنش</p>
          <p class="val">{{ order.id }}</p>
        </div>
        <div class="info">
          <p class="name">تاریخ ثبت</p>
          <p class="val">{{ order.date }}</p>
        </div>
        <div class="info">
          <p class="name">زمان ثبت</p>
          <p class="val">{{ order.time }}</p>
        </div>
        <div class="info">
          <p class="name">مبلغ کل</p>
          <p class="val">{{ order.totalPrice }} ریال</p>
        </div>
      </div>
      <div class="products">
        <div
          class="product"
          v-for="product in limitedProducts(order.products)"
          :key="product.id"
        >
          <img :src="product.img" alt="" />
          <p>{{ product.name }}</p>
          <div class="rate">
            <Raiting />
          </div>
          <div class="price">
            <span>{{ product.price }} ریال</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const orders = ref([
  {
    id: 16784698,
    date: "1403/10/08",
    time: "23:45:08",
    totalPrice: 1200000,

    products: [
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
    ],
  },
  {
    id: 16784698,
    date: "1403/10/08",
    time: "23:45:08",
    totalPrice: 1200000,
    products: [
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
    ],
  },
  {
    id: 16784698,
    date: "1403/10/08",
    time: "23:45:08",
    totalPrice: 1200000,
    products: [
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
      {
        id: 1,
        name: "کفش اجر",
        price: 1651653,
        img: "/products/ajor.jpg",
      },
    ],
  },
]);
const isMobile = ref(false);
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 767;
};

// تابع محدود کردن تعداد محصولات
const limitedProducts = (products) => {
  const limit = isMobile.value ? 2 : 3;
  return products.slice(0, limit);
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 90%;
  height: 400px;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  margin-bottom: 20px;
  margin: 15px auto;
}
.item .status {
  display: flex;
  align-items: center;
}
.item .status p {
  color: var(--green-number);
  font-family: "iran-yekan-DemiBold";
  font-size: 22px;
}
.infos {
  display: flex;
  justify-content: space-between;
}
.info {
  padding: 15px;
  display: flex;
}
.info .name {
  margin-left: 10px;
  font-family: "iran-yekan-Light";
  color: var(--blue-darck);
  font-size: 13px;
}
.info .val {
  font-family: "iran-yekan-num-Medium";
  color: var(--blue-darck);
  font-size: 14px;
}
.products {
  width: 80%;
  height: 80%;
  margin: auto 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.product {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 35%;

  border-left: 1px solid rgba(0, 0, 0, 0.1);
}
.product * {
  margin: 5px 0;
}
.product img {
  width: 115px;
  height: 105px;
}
.product .rate {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.product .stars {
  display: flex;
  justify-content: center;
  align-items: center;
}
.product .stars svg {
  background-color: #fdc040;
}
.product .price {
  font-family: "iran-yekan-num-DemiBold";
  color: var(--blue-darck);
  font-size: 12px;
}
.product p {
  font-family: "iran-yekan-Bold";
  color: var(--blue-darck);
  font-size: 16px;
}

.see-more {
  font-family: "iran-yekan-num-Regular";
  color: var(--blue-bright);
  font-size: 11px;
  cursor: pointer;
  position: absolute;
  left: 45px;
  top: 215px;
}
@media (max-width: 767px) {
  .container {
    width: 100%;
  }
  .item {
    position: relative;
    left: 35px;
    width: 80vw;
    height: 290px;
  }
  .item .status p {
    font-size: 16px;
  }
  .infos {
    width: 100%;
    flex-wrap: wrap;
  }
  .info {
    padding: 5px;
    display: flex;
  }
  .info .name {
    font-size: 8px;
  }
  .info .val {
    font-size: 10px;
  }
  .products {
    position: relative;
    bottom: 20px;
  }
  .status p {
    font-size: 16px;
  }
  .status img {
    width: 24px;
    height: 24px;
  }
  .product {
    text-align: center;

    width: 45%;
  }
  .product * {
    margin: 2px 0;
  }
  .product img {
    width: 90px;
    height: 90px;
  }
  .product .price {
    font-size: 8px;
  }
  .product p {
    font-size: 8px;
  }
  .see-more {
    font-size: 8px;

    left: 12px;
    top: 170px;
  }
}
</style>
