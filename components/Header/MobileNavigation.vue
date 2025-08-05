<template>
  <div class="container">
    <ul>
      <li v-for="item in navigationItems" :key="item.name">
        <NuxtLink :to="item.path">
          <img :src="item.icon" alt="icon" />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
const navigationItems = [
  {
    name: "سبد خرید",
    path: "/dashboard/carts",
    icon: "/MobileIcon/cart.svg",
  },
  {
    name: "خانه",
    path: "/",
    icon: "/MobileIcon/home.svg",
  },
  {
    name: "فروشگاه",
    path: "/products",
    icon: "/MobileIcon/shop.svg",
  },
  {
    name: "حساب کاربری",
    path: "/dashboard/",
    icon: "/MobileIcon/account.svg",
  },
];
</script>

<style scoped>
.container {
  background-color: #fff;
  padding: 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  z-index: 1000;
  display: none;
  /* Frame 12006 */

  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
}
ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 10px;
  font-family: "iran-yekan-Bold";
  color: var(--blue-dark);
}
@media (max-width: 768px) {
  .container {
    display: block;
  }
}
</style>
