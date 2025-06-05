<template>
  <section class="container">
    <div class="right">
      <Right />
    </div>
    <div class="products">
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />

      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
      <SingleProduct />
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.container {
  margin-top: 35px;
  margin: 15px auto;
  position: relative;
  display: flex;
  width: 90%;
  height: 400px;
  justify-content: space-evenly;
  align-items: center;
}
.right {
  position: relative;
  flex-basis: 22%;
  height: 100%;
  min-width: 260px;
  padding: 0;
  background: #ffff;

  /* Main */

  box-shadow: 5px 5px 32.4px rgba(176, 176, 176, 0.38);
  border-radius: 0 15px 15px 0;
}
.products {
  margin: auto;
  flex-basis: 60%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  bottom: 20px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 5px auto;
  }
  .right {
    flex-basis: 7%;
    width: 100%;
    height: 20px;
    padding: 0;
    border-radius: 8px 8px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .products {
    width: 100%;
    height: 500px;
    flex-basis: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding-right: 10px;
  }
}
</style>
