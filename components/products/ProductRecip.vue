<template>
  <div class="container-recip">
    <ul>
      <li><span class="title">قیمت</span> <span class="val">1234</span></li>
      <li><span class="title">قیمت</span> <span class="val">123asd4</span></li>
      <li>
        <span class="title">قیمت</span> <span class="val">1asdasda234</span>
      </li>
      <li><span class="title">قیمت</span> <span class="val">1asda234</span></li>
      <li>
        <span class="title">قیمت</span> <span class="val">12sdasdasd34</span>
      </li>
    </ul>
    <button class="sub">افزودن به سبد خرید</button>
  </div>
</template>
<style scoped>
.container-recip {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 340px;
  height: 380px;
  position: relative;
  padding: 15px;
}
ul {
  width: 90%;
  margin: auto;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
li {
  margin: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 10px;
}
li:last-child {
  border: none;
}
.title {
  font-size: 16px;
  color: #666666;
  font-family: "iran-yekan-DemiBold";
}
.val {
  font-size: 16px;
  color: var(--blue-dark);
  font-family: "iran-yekan-num-DemiBold";
}
button.sub {
  font-family: "iran-yekan-DemiBold";
  width: 338px;
  padding: 0;
  margin: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 45px;
  color: var(--blue-dark);
  background-color: var(--yellow-warning);
  border-radius: 0 0 7px 7px;
  cursor: pointer;
}
button.sub:hover {
  opacity: 0.8;
  transition: 0.3s;
}
@media (max-width: 767px) {
  .container-recip {
    width: 90%;
    height: 270px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px;
  }
  ul {
    height: 70%;
  }
  li {
    height: 20px;
  }
  .title,
  .val {
    font-size: 10px;
  }
  button.sub {
    width: 100%;
    height: 30px;
    font-size: 10px;
  }
}
</style>
