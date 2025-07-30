<template>
  <div class="container">
    <div class="title"><p>موجودی کیف پول</p></div>
    <div class="price">
      <p>185,555,115</p>
      <span>ریال</span>
    </div>
    <div class="btns">
      <button class="charge">
        شارژ کیف پول<img src="/icons/plus.png" alt="" />
      </button>
      <button class="drawal">
        برداشت از کیف پول<img src="/icons/minus.png" alt="" />
      </button>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 80%;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  font-size: 24px;
}
.price {
  display: flex;
  align-items: center;
}
.price p {
  font-family: "iran-yekan-num-Bold";
  font-size: 32px;
  color: var(--green-number);
}
.price span {
  font-family: "iran-yekan-num-Medium";
  font-size: 14px;
  color: var(--blue-dark);
  margin: 0 10px;
}
.btns {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
}
.btns button {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: var(--blue-light) 1px solid;
  border-radius: 12px;
  color: var(--blue-light);
  padding: 10px 8px;
  font-family: "iran-yekan-num-Medium";
  font-size: 13px;
  margin: 0 10px;
}
.btns button:hover {
  background-color: var(--blue-light);
  color: #fff;
  cursor: pointer;
  transition-duration: 0.5s;
}
.btns img {
  width: 23px;
  height: 23px;
  margin: 0 10px 0 0;
}
@media (max-width: 767px) {
  .container {
    width: 90%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-size: 14px;
    margin: 0 8px;
  }
  .price p {
    font-size: 20px;
  }
  .btns button {
    font-size: 10px;
  }
  .btns img {
    width: 18px;
    height: 18px;
    margin: 0 5px 0 0;
  }
}
</style>
