<template>
  <section class="most-popular">
    <h3>پر فروش ترین ها</h3>
    <div class="products">
      <div class="product">
        <img src="/products/siman.jpeg" alt="" />
        <p>سیمان پرتلند</p>
      </div>
      <div class="product">
        <img src="/products/siman.jpeg" alt="" />
        <p>سیمان پرتلند</p>
      </div>
      <div class="product">
        <img src="/products/siman.jpeg" alt="" />
        <p>سیمان پرتلند</p>
      </div>
      <div class="product">
        <img src="/products/siman.jpeg" alt="" />
        <p>سیمان پرتلند</p>
      </div>
      <div class="product">
        <img src="/products/siman.jpeg" alt="" />
        <p>سیمان پرتلند</p>
      </div>
      <div class="product">
        <img src="/products/siman.jpeg" alt="" />
        <p>سیمان پرتلند</p>
      </div>
      <div class="product">
        <img src="/products/siman.jpeg" alt="" />
        <p>سیمان پرتلند</p>
      </div>
    </div>
  </section>
</template>

<script setup></script>

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
