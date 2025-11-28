<template>
  <NuxtLayout>
    <div class="landing-container">
      <br />
      <Banners />
      <br />
      <!-- <PriceList /> -->
      <br />
      <MostPopular :products="topSales" :loading="loadingTopSales" />
      <br />
      <PopularCategory />
      <br />
      <FullRecommend :products="offers" :loading="loadingOffers" />
      <br />
      <FullRecommend :products="products" :loading="loadingProducts" />
      <br />
      <Usefuls :products="products" :loading="loadingProducts" />
      <br />
      <FullRecommend :products="offers" :loading="loadingOffers" />
      <br />
      <!-- <Blog /> -->
      <br />
      <br />

      <ConnectUs />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

useHead({
  title: " صفحه اصلی | آریاساخت",
});

const offers = ref<Array<any>>([]);
const topSales = ref<Array<any>>([]);
const products = ref<Array<any>>([]);

const loadingOffers = ref(true);
const loadingTopSales = ref(true);
const loadingProducts = ref(true);

const nuxtApp = useNuxtApp() as any;
const { $axios } = useNuxtApp();

async function loadLists() {
  try {
    // const offset = 0;
    let page = 1;
    let limit = 10;
    const [pRes, oRes, tRes] = await Promise.all([
      $axios
        .get("/products", { params: { page, limit } })
        .catch((e: any) => ({ data: [] })),
      $axios
        // .get("/products", { params: { page, limit } })
        .get("/products/offers", { params: { page, limit } })
        .catch((e: any) => ({ data: [] })),
      $axios
        .get("/products/top-sales", { params: { page, limit } })
        // .get("/products", { params: { page, limit } })
        .catch((e: any) => ({ data: [] })),
    ]);

    products.value = pRes.data || [];
    offers.value = oRes.data || [];
    topSales.value = tRes.data || [];
  } catch (e) {
    // keep arrays empty on failure
    console.error("Failed to load landing lists", e);
  } finally {
    loadingOffers.value = false;
    loadingTopSales.value = false;
    loadingProducts.value = false;
  }
}

onMounted(() => {
  loadLists();
});
</script>

<style scoped>
@media (max-width: 767px) {
  .landing-container {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
