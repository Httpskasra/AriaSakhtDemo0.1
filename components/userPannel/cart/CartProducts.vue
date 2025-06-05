<template>
  <div class="container">
    <div class="products">
      <div class="header">
        <ul>
          <li>محصولات</li>
          <li>قیمت واحد</li>
          <li>تعداد</li>
          <li>قیمت کل</li>
        </ul>
      </div>
      <div class="main">
        <div class="product" v-for="order in orders" :key="order.id">
          <img :src="order.img" alt="" />
          <div class="name">
            <p>{{ order.cat }}</p>
            <h3>{{ order.name }}</h3>
          </div>
          <div class="price">
            <span class="old"
              ><del>{{ order.oldPrice.toLocaleString() }}</del> ریال</span
            >
            <span class="new">{{ order.newPrice.toLocaleString() }} ریال</span>
          </div>
          <div class="count">
            <button>-</button>
            <span>{{ order.count }}</span>
            <button>+</button>
          </div>
          <div class="total">
            <span
              >{{ (order.count * order.newPrice).toLocaleString() }} تومان</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const orders = ref([
  {
    id: 1,
    cat: "مصالح ساختمانی",
    name: "یک عدد آجر",
    oldPrice: 120000,
    newPrice: 120000,
    count: 1,
    img: "/products/ajor.jpg",
  },
  {
    id: 2,
    cat: "مصالح ساختمانی",
    name: "یک عدد آجر",
    oldPrice: 120000,
    newPrice: 120000,
    count: 1,
    img: "/products/ajor.jpg",
  },
  {
    id: 3,
    cat: "مصالح ساختمانی",
    name: "یک عدد آجر",
    oldPrice: 120000,
    newPrice: 120000,
    count: 1,
    img: "/products/ajor.jpg",
  },
  {
    id: 4,
    cat: "مصالح ساختمانی",
    name: "یک عدد آجر",
    oldPrice: 120000,
    newPrice: 120000,
    count: 1,
    img: "/products/ajor.jpg",
  },
]);
</script>

<style scoped>
.container {
  width: 50%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
.products {
  width: 100%;
}
.products .header ul {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.products .header ul li {
  color: var(--gray-600);
  font-family: "iran-yekan-Light";
}
.products .header ul li:first-child {
  flex-basis: 40%;
  text-align: center;
}
.products .header ul li:nth-child(2) {
  flex-basis: 20%;
}
.products .header ul li:nth-child(3) {
  flex-basis: 20%;
}
.products .product {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 100%;
  margin: auto;
}
.products .product img {
  margin-top: 20px;
  width: 106px;
  height: 94px;
}
.products .product .name {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.products .product .name p {
  font-family: "iran-yekan-Light";
  color: var(--gray-600);
  font-size: 12px;
}
.products .product .name h3 {
  font-family: "iran-yekan-Bold";
  color: var(--blue-dark);
  font-size: 16px;
}
.products .product .price {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.products .product .price .old {
  font-family: "iran-yekan-num-Light";
  color: var(--gray-600);
  font-size: 12px;
}
.products .product .price .new {
  font-family: "iran-yekan-num-Bold";
  color: var(--blue-dark);
  font-size: 16px;
}
.products .product .count {
  display: flex;
  justify-content: space-around;
  align-items: center;

  background-color: var(--yellow-warning);
  border-radius: 5px;
}
.products .product .count span {
  font-family: "iran-yekan-num-Bold";
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
}
.products .product .count button {
  padding: 10px;
  font-family: "iran-yekan-num-Bold";
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.products .product .total {
  font-family: "iran-yekan-num-Bold";
  color: var(--blue-dark);
  font-size: 16px;
}
@media (max-width: 767px) {
  * {
    padding: 0;
    margin: 0;
  }
  .container {
    width: 100%;
    margin: auto;
    padding: 10px 0;

    margin: 0;
  }
  .products .product img {
    width: 40px;
    height: 40px;
    padding: 0;
    margin: 0;
  }
  .products .product .name p {
    font-size: 5px;
    padding: 0;
    margin: 0;
  }
  .products .product .name h3 {
    font-size: 10px;
    padding: 0;
    margin: 0;
  }
  .products .product .price .old {
    font-size: 6px;
    padding: 0;
    margin: 0;
  }
  .products .product .price .new {
    font-size: 10px;
    padding: 0;
    margin: 0;
  }
  .products .product .count {
    margin: 0 5px;
    padding: 0;
  }
  .products .product .count span {
    padding: 4px 8px;
    font-size: 12px;
    margin: 0;
  }
  .products .product .count button {
    padding: 2px 8px;
    margin: 0;
  }
  .products .product .total {
    font-size: 10px;
  }
  .products .header ul {
    padding: 0 10px;
  }
  .products .header ul li {
    font-size: 10px;
  }
  .products .header ul li:first-child {
    flex-basis: 25%;
    text-align: center;
  }
  .products .header ul li:nth-child(2) {
    flex-basis: 20%;
  }
  .products .header ul li:nth-child(3) {
    flex-basis: 20%;
  }
}
</style>
