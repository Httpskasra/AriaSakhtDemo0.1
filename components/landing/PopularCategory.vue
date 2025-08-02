<template>
  <section class="some-cat">
    <div class="cats">
      <div class="header">
        <img src="/products/building-material.jpg" alt="" />
      </div>
      <div class="sub-cats">
        <div class="sub-cat">
          <img src="/products/1.webp" alt="" />
          <p class="name">تیر آهن</p>
          <span class="strock">90 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/2.webp" alt="" />
          <p class="name">میلگرد</p>
          <span class="strock">9 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/3.webp" alt="" />
          <p class="name">قوطی</p>
          <span class="strock">12 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/4.jpg" alt="" />
          <p class="name">نبشی</p>
          <span class="strock">6 مورد</span>
        </div>
      </div>
    </div>
    <div class="cats">
      <div class="header">
        <img src="/products/building-material.jpg" alt="" />
      </div>
      <div class="sub-cats">
        <div class="sub-cat">
          <img src="/products/1.webp" alt="" />
          <p class="name">تیر آهن</p>
          <span class="strock">90 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/2.webp" alt="" />
          <p class="name">میلگرد</p>
          <span class="strock">9 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/3.webp" alt="" />
          <p class="name">قوطی</p>
          <span class="strock">12 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/4.jpg" alt="" />
          <p class="name">نبشی</p>
          <span class="strock">6 مورد</span>
        </div>
      </div>
    </div>
    <div class="cats">
      <div class="header">
        <img src="/products/building-material.jpg" alt="" />
      </div>
      <div class="sub-cats">
        <div class="sub-cat">
          <img src="/products/1.webp" alt="" />
          <p class="name">تیر آهن</p>
          <span class="strock">90 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/2.webp" alt="" />
          <p class="name">میلگرد</p>
          <span class="strock">9 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/3.webp" alt="" />
          <p class="name">قوطی</p>
          <span class="strock">12 مورد</span>
        </div>
        <div class="sub-cat">
          <img src="/products/4.jpg" alt="" />
          <p class="name">نبشی</p>
          <span class="strock">6 مورد</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.some-cat {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 90%;
  margin: auto;
}
.cats {
  background-color: #fff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.cats .header {
  flex-basis: 45%;
}
.cats .header img {
  width: 290px;
  height: 190px;
  margin: 20px 20px 0 20px;
}
.cats .sub-cats {
  flex-basis: 45%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.cats .sub-cats .sub-cat {
  box-sizing: border-box;
  flex-basis: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 12px;
}
.cats .sub-cats img {
  border-radius: 400%;
  width: 66px;
  height: 66px;
}

/* --- Mobile Styles --- */
@media (max-width: 600px) {
  .some-cat {
    flex-direction: column;
    width: 100%;
    gap: 18px 0;
    align-items: center;
    justify-content: flex-start;
    margin: 0 auto;
    padding: 0;
  }
  .cats {
    flex-direction: row;
    width: 96%;
    margin: 0 auto 0 auto;
    border-radius: 18px;
    box-shadow: 0 2px 8px #0001;
    padding-bottom: 10px;
  }
  .cats .header {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0;
  }
  .cats .header img {
    width: 100%;

    height: 100%;
    object-fit: cover;

    margin: 0;
  }
  .cats .sub-cats {
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 0 0 0;
    gap: 0 0;
  }
  .cats .sub-cats .sub-cat {
    flex-basis: 48%;
    margin: 10px 0 0 0;
    align-items: center;
    padding: 0;
  }
  .cats .sub-cats img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin-bottom: 4px;
  }
  .cats .sub-cats .name {
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 2px 0;
    text-align: center;
  }
  .cats .sub-cats .strock {
    font-size: 12px;
    color: #888;
    font-weight: 500;
    margin: 0;
    text-align: center;
  }
}
</style>
