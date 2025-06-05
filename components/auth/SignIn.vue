<template>
  <BaseModal @close="closeModal">
    <div class="container">
      <img src="/logo/logo.webp" alt="" />
      <form @submit.prevent="handleSubmit">
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
          <span class="error" :class="{ show: phoneError }"
            >شماره تماس وارد شده صحیح نمی باشد</span
          >
        </div>

        <button class="submit" type="submit">ورود</button>
      </form>
      <span class="register-description"
        >اگر تا حالا عضو سایت نشدید، با کلیک روی دکمه
        <button class="register" @click="emit('goToSignup')">عضویت</button> به
        جمع ما بپیوندید.
      </span>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
const phoneError = ref<boolean>(true);

const emit = defineEmits(["onSuccess", "goToSignup"]);

const handleSubmit = () => {
  // فرض کنیم که اطلاعات درست باشد
  if (phoneError.value) {
    // وقتی اطلاعات درست است، به OTP می‌رویم
    emit("onSuccess"); // ایونت onSuccess که باید از parent گرفته شود
  } else {
    // در غیر این صورت، پیغام خطا یا هر چیزی که بخواهی می‌تونی مدیریت کنی.
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
  height: 50vh;
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
.register-description {
  font-size: 14px;
  color: var(--blue-dark);
  margin-top: 10px;
}
.register-description .register {
  color: var(--blue-dark);
  font-family: "iran-yekan-DemiBold";
  padding: 2px 5px;
  border-bottom: 1px solid var(--blue-dark);
  cursor: pointer;
}
.submit {
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
