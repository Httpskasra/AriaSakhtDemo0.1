<template>
  <div class="container">
    <div class="title"><p>محصولات انتخاب شده</p></div>
    <div class="orders">
      <div class="order" v-for="order in orders" :key="order.id">
        <img src="/products/ajor.jpg" alt="" />
        <div class="name">
          <p>یک عدد آجر فرد اعلاء</p>
          <span>مصالخ ساختمانی</span>
        </div>
        <div class="price">
          <span class="off">200000</span>
          <span class="actual-price"> 165000 ریال</span>
        </div>
        <div class="see">
          <button>
            <UIcon name="i-lucide-eye" class="size-icon-inline" />
            مشاهده
          </button>
        </div>
      </div>

      <NuxtLink to="/" class="see-more">مشاهده همه</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const orders = ref([
  {
    id: 1,
    name: "آجر فرد اعلاء",
    price: 165000,
  },
  {
    id: 2,
    name: "آجر فرد اعلاء",
    price: 165000,
  },
  {
    id: 3,
    name: "آجر فرد اعلاء",
    price: 165000,
  },
]);
</script>

<style scoped>
.container {
  width: min(100%, 605px);
  background-color: #fff;
  border-radius: var(--radius-field);
  padding: 10px;
}
.title p {
  font-family: var(--font-yekan);
  color: var(--blue-dark);
  font-size: 16px;
  margin: 20px;
}
.orders {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 10px;
}
.order {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order img {
  width: 106px;
  height: 94px;
}
.order .name {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: flex-start;
}
.order .name p {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  font-size: 16px;
}
.order .name span {
  color: var(--gray-600);
  font-family: var(--font-yekan);
  font-size: 12px;
}
.order .price {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
.order .price .off {
  color: var(--gray-600);
  font-family: var(--font-num);
  font-size: 10px;
  text-decoration: line-through;
  align-self: flex-start;
}
.order .price .actual-price {
  color: var(--blue-dark);
  font-family: var(--font-num);
  font-size: 12px;
}

.see button {
  font-family: var(--font-yekan);
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  color: var(--blue-dark);
  background-color: var(--yellow-warning);
}
.see button svg {
  margin-right: 8px;
}
.see-more {
  margin-top: 15px;
  text-align: center;
  color: var(--blue-bright);
  padding: 10px;
}
@media (max-width: 767px) {
  .container {
    width: 95%;
    padding: 8px;
  }
  .title p {
    font-size: 14px;
  }
  .order img {
    width: 80px;
  }
  .order .name p {
    font-size: 14px;
  }
  .order .name span {
    font-size: 10px;
  }
  .order .price .off {
    font-size: 8px;
  }
  .order .price .actual-price {
    font-size: 10px;
  }
  .see-more {
    font-size: 12px;
    padding: 5px;
  }
  .see button {
    font-size: 10px;
    padding: 5px 8px;
  }
  .see button svg {
    margin-right: 5px;
  }
}
</style>
