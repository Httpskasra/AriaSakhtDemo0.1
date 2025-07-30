<template>
  <div class="container" :class="{ open: isMenuOpen }">
    <div class="header">
      <div><img src="/assets/profile/blank-profile.png" alt="" /></div>
      <div class="title">
        <h3>نام شرکت</h3>
        <h5>09164532683</h5>
      </div>
    </div>
    <div class="body">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path"
        class="item"
        :class="{ active: activePath === item.path }">
        <div class="icon">
          <img
            :src="`/adminPannleIcons/${
              activePath === item.path ? `${item.icon}-active` : item.icon
            }.svg`"
            alt="" />
        </div>
        <div class="title">
          <span>{{ item.title }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const menuItems = [
  {
    icon: "dashboard",
    title: "داشبورد",
    isActive: false,
    path: "/userAdmin",
  },
  {
    icon: "finance",
    title: "گزارش مالی",
    isActive: false,
    path: "/userAdmin/finance",
  },
  { icon: "orders", title: "سفارش ها", path: "/userAdmin/orders" },
  {
    icon: "products",
    title: "محصولات",
    badge: 5,
    isActive: false,
    path: "/userAdmin/products",
  },
  {
    icon: "user",
    title: "اطلاعات  شرکت",
    isActive: false,
    path: "/userAdmin/user",
  },
  {
    icon: "support",
    title: "پشتیبانی",
    isActive: false,
    path: "/userAdmin/support",
  },
  { icon: "exit", title: "خروج", isActive: false, path: "/userAdmin/exit" },
];
// const route = useRoute();
// const isActive = (path) => route.path.startsWith(path);
const route = useRoute();
const activePath = ref(route.path);
watch(route, (newRoute) => {
  activePath.value = newRoute.path;
});
defineEmits(["update:isMenuOpen"]);

defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false,
  },
  isScrolled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.container {
  position: fixed;
  top: 60px;
  width: 288px;
  height: 90vh;
  border: 1px solid #eaecef;
  background: #ffffff;
  z-index: 999;
  display: flex;
  flex-direction: column;
}
.header {
  padding-top: 45px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 161px;
  background-color: var(--blue-sky);
  flex-shrink: 0;
}
.header img {
  width: 80px;
  height: 80px;
}
.header .title {
  display: flex;
  flex-direction: column;
}
h3 {
  font-family: "iran-yekan-DemiBold";
  color: var(--blue-dark);
  font-size: 14px;
  margin-bottom: 8px;
}
h5 {
  font-family: "iran-yekan-num-regular";
  color: var(--gray-600);
  font-size: 14px;
}

.item {
  width: 75%;
  margin: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: "iran-yekan-num-regular";
  margin: 20px;
  padding: 10px 10px 10px 0;
}
.item.active {
  background-color: var(--blue-sky);
  border-radius: 10px;
  transform: scale(1.05);
}

.item.active .title {
  color: var(--blue-dark);
}
.item .title {
  padding-right: 15px;
  font-family: "iran-yekan-DemiBold";
  color: var(--gray-600);
  font-size: 14px;
}
.item .icon {
  width: 20px;
  height: 20px;
}
.item .icon img {
  width: 100%;
  height: 100%;
}
@media (max-width: 767px) {
  .container {
    font-family: "iran-yekan-Bold";
    color: var(--blue-dark);
    position: fixed;
    top: 70px;
    right: -500px;
    width: 50%;
    height: 100%;
    background-color: #fff;
    z-index: 999;
    transition: 0.5s;
    height: 83vh;
  }
  .container.open {
    right: 0px;
  }
  .header {
    padding: 0;
    margin: 0;
    position: relative;
    bottom: 10px;
    justify-content: space-evenly;
  }
  .header img {
    width: 50px;
    height: 50px;
  }
  .header h3 {
    font-size: 14px;
  }
  h5 {
    font-size: 14px;
  }
  .item {
    width: 80%;
  }
  .item .title {
    font-size: 12px;
  }
  .item .icon {
    width: 20px;
    height: 20px;
  }
}

.container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
}
.container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}
</style>
