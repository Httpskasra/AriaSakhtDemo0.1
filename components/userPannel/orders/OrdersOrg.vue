<template>
  <div class="container">
    <div class="header">
      <div class="menu">
        <ul>
          <li
            @click="selectedTab = 'completed'"
            :class="{ active: selectedTab === 'completed' }">
            انجام شده
            <!-- <div class="num">4</div> -->
          </li>
          <li
            @click="selectedTab = 'current'"
            :class="{ active: selectedTab === 'current' }">
            جاری
            <!-- <div class="num">4</div> -->
          </li>
          <li
            @click="selectedTab = 'cancelled'"
            :class="{ active: selectedTab === 'cancelled' }">
            لغو شده
            <!-- <div class="num">4</div> -->
          </li>
          <li
            @click="selectedTab = 'returned'"
            :class="{ active: selectedTab === 'returned' }">
            مرجوعی
            <!-- <div class="num">4</div> -->
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

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Order, OrderStatus } from "@/services/orderService";
import { listOrders } from "@/services/orderService";

const selectedTab = ref<"completed" | "current" | "cancelled" | "returned">(
  "completed"
);
const orders = ref<Order[]>([]);
const loading = ref(false);
const errorMsg = ref("");

// Filter orders by status
const completedOrders = computed(() =>
  orders.value.filter((o) => o.status === "delivered")
);

const currentOrders = computed(() =>
  orders.value.filter((o) => ["pending", "paid", "shipped"].includes(o.status))
);

const cancelledOrders = computed(() =>
  orders.value.filter((o) => o.status === "cancelled")
);

const returnedOrders = computed(() =>
  orders.value.filter((o) => o.status === "refunded")
);

const fetchOrders = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const result = await listOrders();
    orders.value = Array.isArray(result) ? result : result.items || [];
  } catch (err: any) {
    errorMsg.value =
      err?.response?.data?.message || err?.message || "خطای نامشخص";
    orders.value = [];
    console.error("خطا در دریافت سفارش‌ها:", err);
  } finally {
    loading.value = false;
  }
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
