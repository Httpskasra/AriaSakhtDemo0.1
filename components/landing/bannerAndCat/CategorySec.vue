<template>
  <div class="container">
    <div v-for="cat in categories" :key="cat" class="item">
      <div class="title">
        <img src="/banner/images2.png" alt="" />
        <span class="name">{{ cat }}</span>
      </div>
    </div>
    <button class="show-more">مشاهده کامل</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
const categories = ref<string[]>([]);
const { $axios } = useNuxtApp();

onMounted(async () => {
  try {
    const res = await $axios.get("/categories");
    // Expecting array of objects with 'name' property
    if (Array.isArray(res.data)) {
      // First keep only top-level categories (no parentId) and active ones,
      // then limit to 8 and map to names.
      const topLevel = (res.data as any[])
        .filter((cat: any) =>  !cat.parentId)
        .slice(0, 8)
        .map((cat: any) => cat.name ?? "");
      categories.value = topLevel;
    }
  } catch (e) {
    categories.value = [];
  }
});
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "iran-yekan-num-Regular", sans-serif;
}
.container {
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  position: absolute;
  left: 0;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: #fff;

  /* Main */

  box-shadow: 5px 5px 32.4px rgba(176, 176, 176, 0.38);
  border-radius: 15px;
}

.item {
  border: 1px solid;
  flex-basis: 7%;

  width: 90%;

  /* List → Item */

  box-sizing: border-box;

  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  cursor: pointer;
}
.item:hover {
  background: rgba(255, 193, 7, 0.48);
  transition: 0.6s;
}
.item .title {
  display: flex;
  align-items: center;
}
.item img {
  height: 50px;
}

.name {
  color: black;
  font-size: 15px;
  font-weight: 600;
}
.item .counter {
  position: relative;

  margin: 0;
  /* span.count */

  width: 24px;
  height: 24px;

  background: rgba(255, 193, 7, 0.47);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item .counter .num {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -40%);
}
.show-more {
  flex-basis: 7%;
  border: none;
  width: 90%;
  font-size: 15px;
  font-weight: 500;

  /* List → Item */

  background: #fdc040;
  border-radius: 5px;
  cursor: pointer;
}
.show-more:hover {
  background-color: #ffa500;
  transition: 0.5s;
}

/* --- Mobile Styles --- */
@media (max-width: 768px) {
  .container {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: 12px 5px;
    padding: 10px 0;
    width: 100%;
  }
  .item {
    min-width: 120px;
    max-width: 130px;
    margin: auto;
    flex-basis: unset;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 6px 8px;
    border-radius: 8px;
    box-shadow: 0 1px 4px #0001;
    border: 1px solid #eee;
  }
  .item .title {
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  .item img {
    height: 28px;
    width: 28px;
    margin-left: 4px;
  }
  .name {
    font-size: 13px;
    font-weight: 500;
  }
  .item .counter {
    width: 20px;
    height: 20px;
    font-size: 12px;
    margin-right: 6px;
  }
  .item .counter .num {
    position: static;
    transform: none;
    font-size: 12px;
    font-weight: 600;
  }
  .show-more {
    min-width: 120px;
    max-width: 130px;
    margin: auto;
    font-size: 13px;
    padding: 6px 0;
    border-radius: 8px;
    background: #fdc040;
    color: #222;
    font-weight: 600;
    transition: background 0.3s;
  }
}
</style>
