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
  layout: "panel",
  middleware: ["auth"],
});

const { hasPermission } = usePermissions();
const { navItems } = usePanelNavigation();

const firstAvailableRoute = computed(() => navItems.value.find((item) => item.route)?.route || "/");

type OverviewCard = {
  resource: Resource;
  title: string;
  route: string;
  icon: string;
};

const overviewCards = computed<OverviewCard[]>(() => [
  { resource: Resource.ORDERS, title: "سفارش‌های من", route: "/dashboard/account/orders", icon: "i-lucide-receipt-text" },
  { resource: Resource.TICKETING, title: "تیکت‌های پشتیبانی", route: "/dashboard/account/tickets", icon: "i-lucide-life-buoy" },
  { resource: Resource.WALLETS, title: "موجودی کیف پول", route: "/dashboard/account/wallet", icon: "i-lucide-wallet" },
  { resource: Resource.PRODUCTS, title: "محصولات قابل مشاهده", route: "/dashboard/seller/products", icon: "i-lucide-boxes" },
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
    <section class="dashboard-overview" dir="rtl">
      <PanelPageHeader title="داشبورد شما" subtitle="خلاصه‌ای از بخش‌هایی که به آن‌ها دسترسی دارید." icon="i-lucide-layout-dashboard">
        <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی داشبورد" @click="loadOverview">به‌روزرسانی</UButton></template>
      </PanelPageHeader>

      <UAlert
        v-if="loadError"
        color="warning"
        variant="soft"
        title="بخشی از اطلاعات در دسترس نیست"
        description="دسترسی به داده‌ها حفظ شده است؛ برای تلاش دوباره، به‌روزرسانی را بزنید."
      />

      <div v-if="overviewCards.length" class="dashboard-overview__grid">
        <PanelStatCard
          v-for="card in overviewCards"
          :key="card.resource"
          :to="card.route"
          :label="card.title"
          :icon="card.icon"
          :value="values[card.resource] || '—'"
          :loading="loading && values[card.resource] === undefined" />
      </div>

      <div v-else class="dashboard-empty-state">
        <div class="dashboard-empty-state__icon" aria-hidden="true"><UIcon name="i-lucide-layout-dashboard" /></div>
        <h2>بخش مجاز برای نمایش وجود ندارد</h2>
        <p>در حال حاضر دسترسی لازم برای نمایش اطلاعات داشبورد را ندارید.</p>
        <UButton v-if="firstAvailableRoute !== '/'" :to="firstAvailableRoute">
          ورود به اولین بخش مجاز
        </UButton>
      </div>
    </section>
</template>

<style scoped>
.dashboard-overview { display: grid; gap: 1rem; }
.dashboard-overview__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: 1rem; }
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
  border-radius: var(--radius-pill);
  background: var(--color-bg-light);
  color: var(--color-text-heading);
  font-size: 1.75rem;
}
.dashboard-empty-state h1 { margin: 0; color: var(--color-text-heading); font-size: 1.5rem; font-weight: 800; }
.dashboard-empty-state p { margin: 0 0 0.5rem; color: var(--color-text-muted); }
</style>
