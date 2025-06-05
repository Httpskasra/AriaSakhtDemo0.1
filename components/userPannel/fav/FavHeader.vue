<template>
  <div class="container">
    <div class="header">
      <ul>
        <li>جدیدترین ها</li>
        <li>گران ترین ها</li>
        <li>ارزان ترین ها</li>
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
  margin: auto;
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
@media (max-width: 767px) {
  .container {
    width: 100%;
    margin-right: 30px;
  }
  .header {
    width: 80vw;
    padding: 0 20px;
  }
  .header ul {
    width: 100%;
    font-size: 10px;
  }
}
</style>
