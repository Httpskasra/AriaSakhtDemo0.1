<template>
  <div class="container">
    <h3>پرکاربردترین ها</h3>
    <div class="products">
      <template v-if="products && products.length">
        <SingleProduct
          v-for="p in products"
          :key="getId(p)"
          :productId="String(getId(p))" />
      </template>
      <template v-else>
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
        <SingleProduct productId="1" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ products?: Array<{ id?: string | number } | string | number> }>();

function getId(p: any) {
  if (p == null) return "";
  if (typeof p === "string" || typeof p === "number") return String(p);
  if (typeof p === "object") return String((p as any).id ?? "");
  return String(p);
}
</script>

<style scoped>
.container {
  width: 90%;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.59);
  border-radius: 10px;
  padding: 15px;
}
h3 {
  margin: 10px;
}
.products {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: auto;
}

/* --- Mobile Styles --- */
@media (max-width: 600px) {
  .container {
    width: 90%;
    padding: 10px 2px;
    border-radius: 14px;
  }
  h3 {
    font-size: 18px;
    margin: 8px 0 12px 0;
    text-align: right;
    font-weight: 800;
  }
  .products {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 0 14px;
    width: 100%;
    margin: 0 auto;
    padding: 20px 2px;

    scrollbar-width: none;
  }
  .products::-webkit-scrollbar {
    display: none;
  }
}
</style>
