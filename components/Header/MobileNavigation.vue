<template>
  <div class="container">
    <ul>
      <li v-for="item in navigationItems" :key="item.name">
        <NuxtLink :to="item.path">
          <img :src="item.icon" alt="icon" />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </li>
      <li>
        <button @click="handleAccount">
          <img src="/MobileIcon/account.svg" alt="icon" />
          <span>{{ isLogin ? "حساب کاربری" : "ورود" }}</span>
        </button>
        <!-- فقط زمانی که مودال فعال است نمایش بده -->
        <ModalWrapper v-if="authStep" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
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
    name: "محصولات",
    path: "/products",
    icon: "/MobileIcon/shop.svg",
  },
  // {
  //   name: "حساب کاربری",
  //   path: "/dashboard/",
  //   icon: "/MobileIcon/account.svg",
  // },
];
import { useAuthStep } from "@/composables/useAuthStep";
import { useAuthStore } from "#imports";
const authStore = useAuthStore();
const isLogin = computed(
  () => !!authStore.getAccessToken() && !!authStore.getRefreshToken()
);
const { authStep, setStep } = useAuthStep();

const handleAccount = () => {
  if (isLogin.value) {
    router.push("/dashboard/profile");
  } else {
    setStep("signin");
  }
};
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
}
span {
  font-size: 10px;
  font-family: "iran-yekan-Bold";
  color: var(--blue-dark);
}
@media (max-width: 768px) {
  .container {
    display: block;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    display: block;
    width: 100%;
  }
}
</style>
