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
        <SearchBar dark="true" />
      </div>
    </div>
    <div class="content">
      <CompletedOrders v-if="selectedTab === 'completed'" />
      <CurrentOrders v-if="selectedTab === 'current'" />
      <CancelledOrders v-if="selectedTab === 'cancelled'" />
      <ReturnedOrders v-if="selectedTab === 'returned'" />
    </div>
  </div>
</template>

<script setup>
// import { ref } from "vue";
// import SearchBar from "../../Header/SearchBar.vue";
// import CompletedOrders from "./CompletedOrders.vue";
// import CurrentOrders from "./CurrentOrders.vue";
// import CancelledOrders from "./CancelledOrders.vue";
// import ReturnedOrders from "./ReturnedOrders.vue";

const selectedTab = ref("completed");
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
