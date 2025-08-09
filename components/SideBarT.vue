<template>
  <div class="container" :class="{ open: isMenuOpen }">
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
      <pre>{{ availableResources }}</pre>

      <!-- Logout -->
      <button class="item" @click="handleLogOut">
        <div class="icon">
          <img src="/dashboardIcons/logout.svg" alt="" />
        </div>
        <div class="title logout-text">
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
import { useAuthStore } from "~/stores/auth";
import { useUser } from "~/composables/useUser";

defineProps({
  isMenuOpen: { type: Boolean, default: false },
  isScrolled: { type: Boolean, default: false },
});
defineEmits(["update:isMenuOpen"]);

const route = useRoute();
const activePath = ref(route.path);
watch(route, (newRoute) => {
  activePath.value = newRoute.path;
});

// دسترسی‌ها
const { getResources } = usePermissions();
const availableResources = computed(() => getResources());

// لیبل منابع
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

// Logout
const { $axios } = useNuxtApp();
const authStore = useAuthStore();
const { clearUser } = useUser();

const handleLogOut = async () => {
  try {
    await $axios.post("/auth/signout");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // پاک کردن همه state و کوکی‌ها
    authStore.clearTokens();
    clearUser();
    navigateTo("/");
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
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.container::-webkit-scrollbar {
  display: none;
}

.body {
  margin-top: 20px;
}

.item {
  width: 75%;
  margin: auto;
  display: flex;
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
.logout-text {
  color: red;
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
    height: 83vh;
    background-color: #fff;
    z-index: 999;
    transition: 0.5s;
  }
  .container.open {
    right: 0px;
  }
  .item {
    width: 80%;
  }
  .item .title {
    font-size: 12px;
  }
}
</style>
