<template>
  <div class="container">
    <h3>پرکاربردترین ها</h3>
    <div class="products">
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
    </div>
  </div>
</template>

<script setup></script>

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
    padding: 0 2px;
    scrollbar-width: none;
  }
  .products::-webkit-scrollbar {
    display: none;
  }
}
</style>
