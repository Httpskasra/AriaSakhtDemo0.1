<template>
  <div class="container">
    <div class="header">
      <ul>
        <li @click="show = 'info'" :class="{ active: show == 'info' }">
          مشخصات
        </li>
        <li @click="show = 'rules'" :class="{ active: show == 'rules' }">
          قوانین و مقررات
        </li>
        <li @click="show = 'comments'" :class="{ active: show == 'comments' }">
          نظرات کاربران
        </li>
      </ul>
    </div>
    <div class="content">
      <InfoProduct class="info-content" v-if="show === 'info'" :data="data" />
      <RulsProduct v-else-if="show === 'rules'" :data="data" />
      <CommentProduct v-else-if="show === 'comments'" :data="data" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Product } from "~/types/product";

type content = "info" | "rules" | "comments";
const show = ref<content>("info");

const props = defineProps<{
  data: Product;
}>();
</script>
<style scoped>
.container {
  width: 90%;
  height: 500px;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  bottom: 10px;
}
.header {
  width: 30%;
  padding: 20px;
  border-bottom: 3px solid #186be7;
  margin-right: 20px;
}

ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "iran-yekan-DemiBold";
  color: #666666;
}
li:hover {
  cursor: pointer;
}
li.active {
  font-weight: bold;
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
}
.content {
  /* background-color: red; */
  width: 100%;
  height: 70%;
  margin: auto;
  margin-top: 50px;
  /* height: 90%; */
  overflow-y: scroll;
  position: relative;
  /* background-color: #fff; */
  /* background-color: red; */
}
@media (max-width: 767px) {
  .container {
    width: 100%;
    height: 60px;
    /* margin-bottom: 500px; */
    bottom: -20px;
  }
  .header {
    width: 80%;
    height: 100%;
  }
  ul {
    width: 100%;
    padding: 0;
  }
  li {
    font-size: 10px;
  }
  .content {
    padding-top: 70px;
    height: 320px;
    background-color: #fff;
  }
}
</style>
