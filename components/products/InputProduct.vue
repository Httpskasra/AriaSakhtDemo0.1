<template>
  <div class="container-form">
    <form @submit.prevent="">
      <label>
        <span>نوع</span>
        <select name="city">
          <option value="tehran">تهران</option>
          <option value="mashhad">مشهد</option>
          <option value="isfahan">اصفهان</option>
          <option value="shiraz">شیراز</option>
          <option value="tabriz">تبریز</option>
        </select>
      </label>
      <label>
        <span>تعداد</span>
        <input type="number" />
      </label>
      <label>
        <span>نوع</span>
        <select name="city">
          <option value="tehran">تهران</option>
          <option value="mashhad">مشهد</option>
          <option value="isfahan">اصفهان</option>
          <option value="shiraz">شیراز</option>
          <option value="tabriz">تبریز</option>
        </select>
      </label>
      <label>
        <span>نوع</span>
        <select name="city">
          <option value="tehran">تهران</option>
          <option value="mashhad">مشهد</option>
          <option value="isfahan">اصفهان</option>
          <option value="shiraz">شیراز</option>
          <option value="tabriz">تبریز</option>
        </select>
      </label>
    </form>
  </div>
</template>
<style scoped>
.container-form {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
  width: 480px;
  height: 285px;
}
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
label {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 10px;
}
label span {
  color: #666666;
  font-family: "iran-yekan-DemiBold";
}
input,
select {
  width: 200px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 6px;
  font-family: "iran-yekan-num-Light";
}
@media (max-width: 767px) {
  .container-form {
    width: 90%;
    height: 350px;
    margin: auto;
    /* padding: 10px; */
  }
  label {
    width: 90%;
    font-size: 10px;
  }
  input,
  select {
    width: 60%;
    height: 30px;
    padding: 10px;
    font-size: 10px;
    padding: 5px;
  }
}
</style>
