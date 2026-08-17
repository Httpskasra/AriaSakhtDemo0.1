<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Resource, Action } from "~/types/permissions";
import { usePermissions } from "~/composables/usePermissions";
import { listOrders } from "~/services/orderService";
import { listTickets } from "~/services/ticketService";
import { getWallet } from "~/services/walletService";
import { getAllProducts } from "~/services/productService";

useHead({
  title: "داشبورد",
});

definePageMeta({
  middleware: ["auth"],
});

const { getResources, hasPermission } = usePermissions();
const availableSections = computed(() =>
  getResources().filter((resource) => resource !== Resource.ALL),
);

const firstAvailableRoute = computed(() => {
  const resource = availableSections.value.find((item) =>
    hasPermission(item, Action.READ),
  );
  return resource ? `/dashboard/${resource}` : "/";
});

type OverviewCard = {
  resource: Resource;
  title: string;
  route: string;
  icon: string;
};

const overviewCards = computed<OverviewCard[]>(() => [
  { resource: Resource.ORDERS, title: "سفارش‌های من", route: "/dashboard/orders", icon: "🧾" },
  { resource: Resource.TICKETING, title: "تیکت‌های پشتیبانی", route: "/dashboard/ticketing", icon: "💬" },
  { resource: Resource.WALLETS, title: "موجودی کیف پول", route: "/dashboard/wallets", icon: "💳" },
  { resource: Resource.PRODUCTS, title: "محصولات قابل مشاهده", route: "/dashboard/products", icon: "📦" },
].filter((card) => hasPermission(card.resource, Action.READ)));

const values = ref<Record<string, string>>({});
const loading = ref(false);
const loadError = ref(false);

const formatNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value);

const countItems = (payload: unknown) => {
  if (Array.isArray(payload)) return payload.length;
  if (payload && typeof payload === "object") {
    const page = payload as { total?: number; items?: unknown[] };
    return page.total ?? page.items?.length ?? 0;
  }
  return 0;
};

async function loadOverview() {
  loading.value = true;
  loadError.value = false;
  const nextValues: Record<string, string> = {};

  const requests = overviewCards.value.map(async (card) => {
    if (card.resource === Resource.ORDERS) {
      nextValues[card.resource] = formatNumber(countItems(await listOrders()));
    } else if (card.resource === Resource.TICKETING) {
      nextValues[card.resource] = formatNumber(countItems(await listTickets({ page: 1, limit: 100 })));
    } else if (card.resource === Resource.WALLETS) {
      const wallet = await getWallet();
      nextValues[card.resource] = wallet ? `${formatNumber(wallet.balance)} ${wallet.currency || "ریال"}` : "—";
    } else if (card.resource === Resource.PRODUCTS) {
      const response = await getAllProducts(1, 1);
      nextValues[card.resource] = formatNumber(countItems(response.data));
    }
  });

  const results = await Promise.allSettled(requests);
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      loadError.value = true;
      nextValues[overviewCards.value[index].resource] = "—";
    }
  });
  values.value = nextValues;
  loading.value = false;
}

onMounted(loadOverview);
</script>

<template>
  <NuxtLayout name="dashboard">
    <section class="dashboard-overview" dir="rtl">
      <div class="dashboard-overview__header">
        <div>
          <h1>داشبورد شما</h1>
          <p>خلاصه‌ای از بخش‌هایی که به آن‌ها دسترسی دارید.</p>
        </div>
        <UButton variant="soft" :loading="loading" @click="loadOverview">به‌روزرسانی</UButton>
      </div>

      <UAlert
        v-if="loadError"
        color="warning"
        variant="soft"
        title="بخشی از اطلاعات در دسترس نیست"
        description="دسترسی به داده‌ها حفظ شده است؛ برای تلاش دوباره، به‌روزرسانی را بزنید."
      />

      <div v-if="overviewCards.length" class="dashboard-overview__grid">
        <NuxtLink
          v-for="card in overviewCards"
          :key="card.resource"
          :to="card.route"
          class="overview-card"
        >
          <span class="overview-card__icon" aria-hidden="true">{{ card.icon }}</span>
          <span class="overview-card__title">{{ card.title }}</span>
          <strong>{{ loading && values[card.resource] === undefined ? "…" : values[card.resource] ?? "—" }}</strong>
          <span class="overview-card__link">مشاهده جزئیات ←</span>
        </NuxtLink>
      </div>

      <div v-else class="dashboard-empty-state">
        <div class="dashboard-empty-state__icon" aria-hidden="true">⌂</div>
        <h2>بخش مجازی برای نمایش وجود ندارد</h2>
        <p>در حال حاضر دسترسی لازم برای نمایش اطلاعات داشبورد را ندارید.</p>
        <UButton v-if="firstAvailableRoute !== '/'" :to="firstAvailableRoute">
          ورود به اولین بخش مجاز
        </UButton>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.dashboard-overview { display: grid; gap: 1rem; }
.dashboard-overview__header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.dashboard-overview__header h1 { margin: 0; color: var(--color-text-heading); font-size: 1.5rem; font-weight: 800; }
.dashboard-overview__header p { margin: 0.35rem 0 0; color: var(--color-text-muted); }
.dashboard-overview__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: 1rem; }
.overview-card { display: grid; gap: 0.45rem; padding: 1.25rem; color: inherit; text-decoration: none; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); transition: transform 160ms ease, border-color 160ms ease; }
.overview-card:hover { transform: translateY(-2px); border-color: var(--blue-dark); }
.overview-card__icon { font-size: 1.5rem; }
.overview-card__title { color: var(--color-text-muted); font-size: 0.9rem; }
.overview-card strong { color: var(--color-text-heading); font-size: 1.35rem; }
.overview-card__link { color: var(--blue-dark); font-size: 0.8rem; }
.dashboard-empty-state {
  min-height: 24rem;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.dashboard-empty-state__icon {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 999px;
  background: var(--color-bg-light);
  color: var(--blue-dark);
  font-size: 1.75rem;
}
.dashboard-empty-state h1 { margin: 0; color: var(--color-text-heading); font-size: 1.5rem; font-weight: 800; }
.dashboard-empty-state p { margin: 0 0 0.5rem; color: var(--color-text-muted); }
</style>
