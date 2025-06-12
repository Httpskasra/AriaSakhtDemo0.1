<template>
  <NuxtLayout>
    <div class="landing-container">
      <br />
      <Banners />
      <br />
      <PriceList />
      <br />
      <MostPopular />
      <br />
      <PopularCategory />
      <br />
      <FullRecommend />
      <br />
      <FullRecommend />
      <br />
      <Usefuls />
      <br />
      <FullRecommend />
      <br />

      <Blog />
      <br />
      <br />

      <ConnectUs />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts"></script>

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
