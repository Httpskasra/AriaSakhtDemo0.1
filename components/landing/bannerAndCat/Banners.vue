<template>
  <section class="all">
    <div class="category">
      <CategorySec />
    </div>
    <div class="col-banners">
      <div class="v-banner">
        <SingleBanner imgSrc="/banner/v-banner.webp" />
      </div>

      <div class="v-banner">
        <SingleBanner imgSrc="/banner/v-banner.webp" />
      </div>
    </div>
    <div class="h-banner">
      <SingleBanner imgSrc="/banner/hBanner.webp" />
    </div>
  </section>
</template>
<script setup></script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.all {
  width: 90%;
  height: 450px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.all div {
  margin-right: 10px;
}
.col-banners {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex-basis: 50%;
}
.h-banner {
  flex-basis: 20%;
  height: 100%;
}
.v-banner {
  width: 100%;
  height: 30%;
}
.v-banner:first-child {
  height: 65%;
}
.category {
  position: relative;
  flex-basis: 22%;
  height: 100%;
  width: 100%;
  padding: 0;
}

/* --- Mobile Styles --- */
@media (max-width: 600px) {
  .all {
    flex-direction: column;
    height: auto;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    padding: 0;
  }
  .category {
    order: -1;
    width: 90%;
    flex-basis: unset;
    height: auto;
    margin-bottom: 16px;
    box-shadow: none;

    padding: 0;
  }
  .col-banners,
  .h-banner {
    width: 90%;
    flex-basis: unset;
    height: auto;
    margin: 0 auto;
    padding: 0;
  }
  .col-banners {
    flex-direction: row;
    gap: 8px;
    margin-bottom: 8px;
    height: auto;
    justify-content: space-around;
    align-items: center;
    padding-left: 10px;
  }
  .v-banner {
    width: 50%;
    height: auto;
  }

  .h-banner {
    margin-top: 0;
    width: 87%;
    margin: 0 auto;
    padding-right: 10px;
  }
}
</style>
