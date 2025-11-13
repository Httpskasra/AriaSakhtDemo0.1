<template>
  <NuxtLayout>
    <div class="loading" v-if="loading"><SkeletonLoaderProduct /></div>
    <div class="error" v-if="error">
      <h1>محصول یافت نشد</h1>
    </div>
    <div class="container" v-if="!loading && !error && data">
      <Product :data="data" class="title" />
      <div class="fields">
        <ProductImage :data="data" class="img" />
        <InputProduct class="form" />
        <ProductRecip class="recip" />
      </div>
      <div class="feature-demo">
        <span>ویژگی ها</span>
        <ProductFutureDemo />
      </div>
      <div class="recomend">
        <FullRecommend />
      </div>
      <div class="info">
        <InfoContainer :data="data" />
      </div>
      <div class="more-products">
        <FullRecommend />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();

const { data, loading, error } = useProductById(
  computed(() => route.params.id as string)
);
</script>

<style scoped>
.loading {
  width: 90%;
  margin: auto;
}
.container {
  margin: auto;
  margin-top: 10px;
  width: 100%;
  /* height: 1000px; */
}
.fields {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.feature-demo {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin-right: auto;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: 120px;
}
.feature-demo span {
  width: 30%;
  margin: auto;
  text-align: right;
  font-family: "iran-yekan-DemiBold";
  font-size: 20px;
  color: var(--blue-dark);
}

.recomend {
  position: relative;
  bottom: 100px;
}
@media (max-width: 767px) {
  .fields {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .fields * {
    margin-top: 15px;
  }
  .container * {
    margin: auto;
  }
  .recomend {
    margin-top: 120px;
  }
  .info {
    height: 500px;
    width: 100%;
  }
  .more-products {
    display: none;
  }
}
</style>
