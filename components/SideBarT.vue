<template>
  <div class="container" :class="{ open: isMenuOpen }">
    <!-- header -->

    <!-- body -->
    <div class="body">
      <NuxtLink
        v-for="resource in availableResources"
        :key="resource"
        :to="`/dashboard/${resource}`"
        class="item"
        :class="{ active: activePath === `/dashboard/${resource}` }">
        <div class="icon">
          <img
            :src="`/dashboardIcons/${
              activePath === `/dashboard/${resource}`
                ? `${resource}-active`
                : resource
            }.svg`"
            alt="" />
        </div>
        <div class="title">
          <span>{{ resourceLabels[resource] || resource }}</span>
        </div>
      </NuxtLink>
      <button class="item" @click="handleLogOut">
        <div class="icon">
          <img style="color: red" src="/dashboardIcons/logout.svg" alt="" />
        </div>
        <div class="title" style="color: red">
          <span>خروج</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { usePermissions } from "~/composables/usePermissions";
import { Resource } from "~/types/permissions";

// Props
defineProps({
  isMenuOpen: { type: Boolean, default: false },
  isScrolled: { type: Boolean, default: false },
});

defineEmits(["update:isMenuOpen"]);

const { getResources } = usePermissions();
const availableResources = computed(() => getResources());
const route = useRoute();
const activePath = ref(route.path);
watch(route, (newRoute) => {
  activePath.value = newRoute.path;
});

// Resource Label map
const resourceLabels: Record<string, string> = {
  [Resource.CARTS]: "سبدها",
  [Resource.CATEGORIES]: "دسته‌بندی‌ها",
  [Resource.COMPANIES]: "شرکت‌ها",
  [Resource.ORDERS]: "سفارش‌ها",
  [Resource.PAYMENT]: "پرداخت‌ها",
  [Resource.PRODUCTS]: "محصولات",
  [Resource.ROLES]: "نقش‌ها",
  [Resource.TICKETING]: "تیکت‌ها",
  [Resource.TRANSACTION]: "تراکنش‌ها",
  [Resource.TRANSPORTING]: "حمل و نقل",
  [Resource.USERS]: "کاربران",
  [Resource.WALLETS]: "کیف پول",
  [Resource.PROFILE]: "پروفایل",
};
const { $axios } = useNuxtApp();
const handleLogOut = async () => {
  try {
    const response = await $axios.post("/auth/signout");

    if (response?.status === 200 || response?.status === 204) {
    } else {
    }
  } catch (error) {
  } finally {
  }
};
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
.body {
  margin-top: 20px;
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
