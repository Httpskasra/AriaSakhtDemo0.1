<template>
  <div class="container">
    <div class="header">
      <ul>
        <li>جدیدترین ها</li>
        <li>گران ترین ها</li>
        <li>ارزان ترین ها</li>
        <li><div class="add-item">اضافه کردن +</div></li>
      </ul>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  background-color: #fff;
  margin: 0 auto;
  padding: 10px;
  border-radius: 10px;
  padding: 25px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
}
.header ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.header ul:hover {
  cursor: pointer;
}
.add-item {
  background-color: var(--blue-light);
  color: #fff;
  padding: 10px;
  border-radius: 10px;
}
.add-item:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .container {
    flex-direction: column;
    padding: 10px;
    margin: auto;
  }
  .header {
    width: 100%;
    margin: auto;
  }
  .header ul {
    flex-direction: row;
    gap: 10px;
    width: 100%;
  }
  .header ul li {
    width: 100%;
    text-align: center;
    font-size: 10px;
  }
  .add-item {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
