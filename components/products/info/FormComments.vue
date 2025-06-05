<template>
  <div class="container">
    <img class="mainPic" src="\productpage\communicaiton.png" alt="" />
    <div class="first">
      <h3>تجریه و نظرتان را با ما به اشتراک بگذارید</h3>
      <input type="text" placeholder="عنوان نقد و بررسی شما" />
      <div class="inner">
        <Raiting :size="raitingSize" /><span>میزان رضایت شما از 1تا5</span>
      </div>
    </div>
    <div class="sec">
      <textarea
        rows="10"
        cols="20"
        placeholder=" نقد و بررسی شما"
        resize
      ></textarea>
      <button>ثبت</button>
    </div>
  </div>
</template>
<script setup lang="ts">
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 767;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
const raitingSize = computed(() => (isMobile.value ? "18px" : "30px"));
</script>
<style scoped>
.container {
  margin: 120px 0;
  width: 100%;
  height: 280px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.mainPic {
  width: 160px;
}
img {
  flex-basis: 20%;
}
.first {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.first input {
  padding: 15px;
  background-color: rgba(173, 173, 173, 0.1);
  border: rgba(0, 0, 0, 0.4);
  outline: none;
  width: 100%;
  border-radius: 10px;
}
.inner {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
.inner span {
  font-size: 20px;
}
h3 {
  font-size: 24px;
}

textarea {
  resize: none;
  padding: 15px;
  background-color: rgba(173, 173, 173, 0.1);
  border: rgba(0, 0, 0, 0.4);
  width: 480px;
  height: 200px;
  border-radius: 10px;
  outline: none;
}
.sec {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
button {
  align-self: flex-end;
  padding: 10px 20px;
  background-color: var(--yellow-warning);
  font-family: "iran-yekan-DemiBold";
  color: var(--blue-dark);
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
}
@media (max-width: 767px) {
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
  
  }
  .mainPic {
    position: absolute;
    width: 80px;
    right: 0;
    top: 110px;
  }
  .first {
    width: 80%;
  }
  .first h3 {
    font-size: 6px;
  }
  .inner span {
    font-size: 10px;
    width: 100%;
  }
  input {
    width: 80%;
    height: 30px;
    font-size: 8px;
  }
  .sec {
    width: 100%;
  }
  textarea {
    width: 80%;
    height: 160px;
    font-size: 8px;
  }
  button {
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 8px;
    margin-top: 10px !important;
  }
}
</style>
