<template>
  <div>
    <h2>ارتباط با ما</h2>
    <div class="container">
      <div class="container-main">
        <div class="blur"></div>
        <img src="/products/connect.png" alt="" />
        <div class="connect-us">
          <h4>برای ارتباط و مشاوره رایگان شماره تلفن خود را وارد کنید</h4>
          <form>
            <button>ارسال</button>
            <input type="tel" placeholder="0912.." />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
h2 {
  text-align: center;
}
.container {
  width: 100%;
  margin: auto;
  background-image: url("/products/bg.png");
  background-position: center;

  background-attachment: fixed;

  background-size: cover;

  height: 280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.blur {
  background-color: rgba(77, 128, 167, 0.7);
  width: 100%;
  height: 100%;
  position: absolute;
}
.container-main {
  position: absolute;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.container-main img {
  position: relative;
  bottom: 35px;
  margin-right: 120px;
}
.connect-us {
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  left: 120px;
}

.connect-us h4 {
  font-size: 40px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  width: 520px;
  text-align: center;
}
.connect-us form {
  margin-top: 15px;
  display: flex;
  align-items: center;
  position: relative;
  left: 74px;
}
.connect-us form * {
  border-radius: 50px;
}
.connect-us input {
  box-sizing: border-box;
  padding: 15px;
  border: none;
  background-color: rgba(255, 255, 255, 0.85);
  width: 386px;
  height: 64px;
}
.connect-us button {
  border: none;
  color: #253d4e;
  background-color: #fdc040;
  font-size: 16px;
  font-weight: 700;
  width: 159px;
  height: 64px;
  position: relative;
  right: 150px;
}

/* --- Tablet Styles (768px - 1024px) --- */
@media (min-width: 601px) and (max-width: 1024px) {
  h2 {
    margin-top: 15px;
    font-size: 24px;
  }
  .container {
    width: 100%;
    margin: auto;
    height: 240px;
    min-height: 220px;
    padding: 0;
    border-radius: 0;
  }
  .container-main {
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    gap: 20px;
  }
  .container-main img {
    /* width: 110px;
    height: 140px;
    margin: 0;
    bottom: 0;
    right: 0;
    position: static;
    object-fit: contain;
    z-index: 2; */
    display: none;
  }
  .connect-us {
    left: 0;
    align-items: center;
    justify-content: center;
    width: auto;
    margin: 0 auto;
    z-index: 2;
  }
  .connect-us h4 {
    font-size: 18px;
    width: 100%;
    max-width: 380px;
    text-align: center;
    margin-bottom: 12px;
    font-weight: 700;
    color: #fff;
  }
  .connect-us form {
    margin-top: 0;
    left: 0;
    align-items: center;
    width: auto;
    gap: 0 8px;
    position: relative;
    flex-direction: row;
  }
  .connect-us input {
    width: 220px;
    height: 48px;
    padding: 10px;
    font-size: 14px;
  }
  .connect-us button {
    width: 90px;
    height: 48px;
    font-size: 14px;
    right: 0;
    margin-right: 0;
    margin-left: 0;
    position: relative;
  }
}

/* --- Mobile Styles (600px and below) --- */
@media (max-width: 600px) {
  h2 {
    margin-top: 20px;
  }
  .container {
    width: 100%;
    margin: auto;
    height: 200px;
    min-height: 180px;
    padding: 0;
    border-radius: 0;
  }
  .container-main {
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
  }
  .container-main img {
    width: 90px;
    height: 120px;
    margin: 0 8px 0 0;
    bottom: 0;
    right: 0;
    position: static;
    object-fit: contain;
    z-index: 2;
    display: none;
  }
  .connect-us {
    left: 0;
    align-items: flex-start;
    justify-content: center;
    width: 60vw;
    min-width: 180px;
    max-width: 320px;
    margin: 0 auto;
    z-index: 2;
  }
  .connect-us h4 {
    font-size: 15px;
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    font-weight: 700;
    color: #fff;
  }
  .connect-us form {
    margin-top: 0;
    left: 0;
    align-items: center;
    width: 100%;
    gap: 0 6px;
  }
  .connect-us input {
    width: 110px;
    height: 38px;
    padding: 8px;
    font-size: 13px;
  }
  .connect-us button {
    width: 70px;
    height: 38px;
    font-size: 14px;
    right: 0;
    margin-right: 0;
    margin-left: 8px;
  }
}
</style>
