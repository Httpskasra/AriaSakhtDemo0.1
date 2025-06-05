<template>
  <BaseModal @close="closeModal">
    <div class="container">
      <img src="/logo/logo.webp" alt="" />
      <form @submit.prevent="handleSubmit">
        <div class="meli-code">
          <Label class="input">
            <input
              type="text"
              pattern="[0-9]{10}"
              required
              placeholder="2665554789:مثال"
            />
            <div class="title">
              <span>کد ملی</span>
            </div>
          </Label>
          <span class="error" :class="{ show: phoneError }"
            >شماره تماس وارد شده صحیح نمی باشد</span
          >
        </div>
        <div class="phone-number">
          <Label class="input">
            <input
              type="text"
              pattern="[0]{1}[9]{1}[0-9]{9}"
              required
              placeholder="0912345678:مثال"
            />
            <div class="title">
              <span>شماره تلفن</span>
            </div>
          </Label>
          <span class="error" :class="{ show: meliError }">
            >کد ملی وارد شده صحیح نمی باشد</span
          >
        </div>
        <Label class="red-rule">
          <span>شرایط و قوانین را مطالعه کردم و قبول دارم</span>
          <input type="checkbox" value="promise" required />
        </Label>
        <button type="submit">عضویت</button>
        <span class="error" :class="{ show: matchingError }"
          >کد ملی وارد با شماره تماس مطابقت ندارد</span
        >
      </form>
    </div>
    <button @close="closeModal">close</button>
  </BaseModal>
</template>

<script setup lang="ts">
const phoneError = ref<boolean>(true);
const meliError = ref<boolean>(false);
const matchingError = ref<boolean>(false);
const emit = defineEmits(["onSuccess"]);
const handleSubmit = () => {
  if (true) {
    emit("onSuccess");
  }
};
import { useAuthStep } from "@/composables/useAuthStep";

const { authStep, setStep } = useAuthStep();

const closeModal = () => {
  setStep(null); // Reset the authStep to null to close the modal
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 60vh;
}
.container img {
  width: 180px;
  height: 160px;
}
form {
  height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

label,
button:hover {
  cursor: pointer;
}

label.input {
  font-family: "iran-yekan-num-Regular";
  background-color: rgba(173, 173, 173, 0.2);
  width: 100%;
  direction: ltr;
  height: 50px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding-left: 20px;
  border-radius: 15px;
}
input:focus {
  outline: none;
}

label.input .title {
  box-sizing: border-box;
  background-color: var(--blue-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  padding: 0 18px;
  width: 100px;
  border-radius: 0 15px 15px 0;
}
.red-rule {
  display: flex;
  align-items: center;
}
.red-rule span {
  font-size: 12px;
  margin: 0 5px;
}
button {
  background-color: var(--blue-dark);
  padding: 10px 18px;
  color: #fff;
  border-radius: 15px;
  position: relative;
  top: 12px;
}
.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: none;
}
.error.show {
  display: inline;
}

@media (max-width: 767px) {
  .container img {
    width: 70px;
    height: 50px;
  }
}
</style>
