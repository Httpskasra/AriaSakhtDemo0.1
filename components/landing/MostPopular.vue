<template>
  <section class="most-popular">
    <h3>پر فروش ترین ها</h3>
    <div class="products">
      <template v-if="loading">
        <div class="product" v-for="n in 6" :key="'skeleton-' + n">
            <p>...</p>
        </div>
      </template>

      <template v-else>
        <div
          class="product"
          v-for="product in products"
          :key="product.id || product.name">
          <img
            :src="product.image"
            :alt="product.name" />
          <p>{{ product.name }}</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

type TopSale = { id: string; name?: string; sales?: number };
type ProductDetail = {
  id?: string;
  name: string;
  images?: Array<{ url?: string }>;
  slug?: string;
};

const products = ref<Array<{ id?: string; name: string; image?: string }>>([]);
const loading = ref(true);

const nuxtApp = useNuxtApp() as any;
const axios = nuxtApp.$axios as any;

async function loadTopSales() {
  try {
    const { data } = await axios.get("/top-sales");
    const topSales: TopSale[] = data || [];

    // Fetch product details in parallel
    const requests = topSales.map((t) =>
      axios
        .get(`/product/${t.id}`)
        .then((r: any) => ({ id: t.id, data: r.data }))
        .catch(() => ({ id: t.id, data: null }))
    );

    const results = await Promise.all(requests);

    products.value = results
      .map((r) => {
        const d: ProductDetail | null = r.data;
        if (!d) return null;
        const image = (d.images && d.images.length && d.images[0].url) || "";
        return { id: r.id, name: d.name || "بدون نام", image };
      })
      .filter(Boolean) as Array<{ id?: string; name: string; image?: string }>;
  } catch (e) {
    // silent fail: keep static fallback UI
    console.error("Failed to load top sales", e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTopSales();
});
</script>

<style scoped>
.most-popular {
  width: 90%;
  height: 230px;
  margin: 20px auto;
  background-color: #ffff;
  padding: 15px;
  border-radius: 15px;
  position: relative;
}
.products {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 40px;
}
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.product img {
  width: 114px;
  height: 110px;
}

/* --- Mobile Styles --- */
@media (max-width: 600px) {
  .most-popular {
    width: 96%;
    min-height: 200px;
    height: auto;
    padding: 12px 0 18px 0;
    border-radius: 18px;
  }
  .products {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0 18px;
    margin-top: 32px;
    padding: 0 12px;
    scrollbar-width: none;
  }
  .products::-webkit-scrollbar {
    display: none;
  }
  .product {
    min-width: 120px;
    max-width: 130px;
    margin: 0 6px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
  }
  .product img {
    width: 90px;
    height: 88px;
    margin-bottom: 8px;
  }
  .product p {
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    margin: 0;
  }
  h3 {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 0;
    margin-right: 18px;
    margin-top: 0;
    text-align: right;
  }
}
</style>
