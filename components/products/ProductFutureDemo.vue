<template>
  <div class="container-future-demo">
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
  </div>
</template>
<style scoped>
.container-future-demo {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 450px;
  height: 280px;
  position: relative;
  padding: 15px;
}
ul {
  display: flex;
  flex-wrap: wrap;
  height: 80%;
  justify-content: center;
}
li {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70px;
  border-radius: 8px;
}
span {
  font-size: 16px;
  font-family: "iran-yekan-num-DemiBold";
}
span.title {
  color: #666666;
}
.see-more {
  font-family: "iran-yekan-DemiBold";
  color: #666666;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 160px;
}
@media (max-width: 767px) {
  .container-future-demo {
    top: 120px;
    width: 80%;
    height: 210px;
    margin: auto;
  }
  ul {
    width: 100%;
    height: 80%;
  }
  li {
    padding: 0 12px;
    margin: 15px;
  }
  span {
    font-size: 8px;
  }
}
</style>
