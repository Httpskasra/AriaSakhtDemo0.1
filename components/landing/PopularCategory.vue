<template>
  <section class="some-cat">
    <div class="cats">
      <div class="header">
        <!-- <img
          src="/categoriesIcons/Building-Materials-solid.jpg"
          class="rounded-lg"
          alt="" /> -->
        <h3 class="py-5">مصالح جامد</h3>
      </div>
      <div class="sub-cats">
        <div class="sub-cat">
          <img src="/categoriesIcons/ahan.jpg" alt="" />
          <p class="name">فلز</p>
        </div>
        <div class="sub-cat">
          <img src="/categoriesIcons/ajor.jpg" alt="" />
          <p class="name">آجر</p>
        </div>
        <div class="sub-cat">
          <img src="/categoriesIcons/beton.jpg" alt="" />
          <p class="name">بتن</p>
        </div>
        <div class="sub-cat">
          <img src="/categoriesIcons/chob.jpg" alt="" />
          <p class="name">چوب</p>
        </div>
      </div>
    </div>
    <div class="cats">
      <div class="header">
        <!-- <img
          src="/categoriesIcons/Building-Materials-solid.jpg"
          class="rounded-lg"
          alt="" /> -->
        <h3 class="py-5">مصالح پودری</h3>
      </div>
      <div class="sub-cats">
        <div class="sub-cat">
          <img src="/categoriesIcons/siman.jpg" alt="" />
          <p class="name">سیمان</p>
        </div>
        <div class="sub-cat">
          <img src="/categoriesIcons/gach.webp" alt="" />
          <p class="name">گچ</p>
        </div>
        <div class="sub-cat">
          <img src="/categoriesIcons/sang.jpg" alt="" />
          <p class="name">پودر سنگ</p>
        </div>
        <!-- <div class="sub-cat">
          <img src="/categoriesIcons/chob.jpg" alt="" />
          <p class="name">چوب</p>
        </div> -->
      </div>
    </div>
    <div class="cats">
      <div class="header">
        <!-- <img
          src="/categoriesIcons/Building-Materials-solid.jpg"
          class="rounded-lg"
          alt="" /> -->
        <h3 class="py-5">مصالح مایع</h3>
      </div>
      <div class="sub-cats">
        <div class="sub-cat">
          <img src="/categoriesIcons/color.jpg" alt="" />
          <p class="name">رنگ</p>
        </div>
        <div class="sub-cat">
          <img src="/categoriesIcons/chasb.png" alt="" />
          <p class="name">چسب</p>
        </div>
      </div>
    </div>
    <div class="cats">
      <div class="header">
        <!-- <img
          src="/categoriesIcons/Building-Materials-solid.jpg"
          class="rounded-lg"
          alt="" /> -->
        <h3 class="py-5">مصالح نوین</h3>
      </div>
      <div class="sub-cats" style="width: 100%">
        <div class="sub-cat">
          <img src="/categoriesIcons/window.jpg" alt="" />
          <p
            class="name"
            style="font-size: 8px; font-family: 'iran-yekan-Bold'">
            شیشه‌های هوشمند
          </p>
        </div>
        <div class="sub-cat">
          <img src="/categoriesIcons/nano.jpg" alt="" />
          <p class="name">مواد نانویی</p>
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
