<template>
  <div class="container">
    <div class="header">
      <div class="menu">
        <ul>
          <li
            @click="selectedTab = 'completed'"
            :class="{ active: selectedTab === 'completed' }">
            انجام شده
            <div class="num">4</div>
          </li>
          <li
            @click="selectedTab = 'current'"
            :class="{ active: selectedTab === 'current' }">
            جاری
            <div class="num">4</div>
          </li>
          <li
            @click="selectedTab = 'cancelled'"
            :class="{ active: selectedTab === 'cancelled' }">
            لغو شده
            <div class="num">4</div>
          </li>
          <li
            @click="selectedTab = 'returned'"
            :class="{ active: selectedTab === 'returned' }">
            مرجوعی
            <div class="num">4</div>
          </li>
        </ul>
      </div>
      <div class="search">
        <SearchBar :dark="true" />
      </div>
    </div>
    <div class="content">
      <CompletedOrders
        v-if="selectedTab === 'completed'"
        :orders="completedOrders" />
      <CurrentOrders v-if="selectedTab === 'current'" :orders="currentOrders" />
      <CancelledOrders
        v-if="selectedTab === 'cancelled'"
        :orders="cancelledOrders" />
      <ReturnedOrders
        v-if="selectedTab === 'returned'"
        :orders="returnedOrders" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { $axios } = useNuxtApp();
const selectedTab = ref("completed");
const orders = ref([]);
const products = ref([]);
const companies = ref([]);

const completedOrders = ref([]);
const currentOrders = ref([]);
const cancelledOrders = ref([]);
const returnedOrders = ref([]);

const fetchOrders = async () => {
  const res = await $axios.get("/orders");
  orders.value = res.data.items ? res.data.items : [];
  // گرفتن اطلاعات محصولات و کمپانی‌ها
  const productIds = [
    ...new Set(orders.value.flatMap((o) => o.items.map((i) => i.productId))),
  ];
  const companyIds = [...new Set(orders.value.map((o) => o.companyId))];
  const productsRes = await $axios.get("/products", {
    params: { ids: productIds },
  });
  products.value = productsRes.data;
  const companiesRes = await $axios.get("/companies", {
    params: { ids: companyIds },
  });
  companies.value = companiesRes.data;
  // ترکیب اطلاعات سفارش با محصول و کمپانی
  const ordersWithDetails = orders.value.map((order) => {
    return {
      ...order,
      products: order.items.map((item) => {
        const product =
          products.value.find((p) => p._id === item.productId) || {};
        return {
          ...product,
          quantity: item.quantity,
        };
      }),
      company: companies.value.find((c) => c._id === order.companyId) || {},
    };
  });
  completedOrders.value = ordersWithDetails.filter(
    (o) => o.status === "completed"
  );
  currentOrders.value = ordersWithDetails.filter(
    (o) => o.status === "pending" || o.status === "current"
  );
  cancelledOrders.value = ordersWithDetails.filter(
    (o) => o.status === "cancelled"
  );
  returnedOrders.value = ordersWithDetails.filter(
    (o) => o.status === "returned"
  );
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.container {
  width: 90%;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px;
}
.menu {
  flex-basis: 50%;
}
ul {
  display: flex;
  justify-content: space-between;
}
ul li {
  display: flex;
  align-items: center;
  color: var(--gray-600);
}
ul li:hover {
  color: #000;
  cursor: pointer;
  transition: 0.5s;
}
ul li.active {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
}
ul li.active .num {
  background-color: var(--blue-dark);
}
.num {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--gray-600);
  color: #fff;
  border-radius: 5px;
  padding: 5px;
  margin-right: 8px;
  width: 18px;
  height: 20px;
  font-size: 10px;
  text-align: center;
  font-family: "iran-yekan-num-Medium";
}
.content {
  margin-top: 20px;
}
@media (max-width: 767px) {
  .header {
    flex-direction: column-reverse;
    padding: 3px;
    padding-bottom: 25px;
  }

  .menu {
    padding-top: 25px;
    width: 100%;
  }
  ul li {
    font-size: 10px;
  }
  .num {
    border-radius: 5px;
    padding: 5px;
    margin-right: 8px;
    width: 14px;
    height: 14px;
    font-size: 8px;
    text-align: center;
    font-family: "iran-yekan-num-Medium";
  }
  .content {
    margin: 0;
    padding: 0;
    width: 100%;
  }
}
</style>
