<template>
  <div class="register" v-if="!user">
    <button @click="setStep('signin')" class="btn">
      <span>ورود </span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.1599 11.62C12.1299 11.62 12.1099 11.62 12.0799 11.62C12.0299 11.61 11.9599 11.61 11.8999 11.62C8.99994 11.53 6.80994 9.25 6.80994 6.44C6.80994 3.58 9.13994 1.25 11.9999 1.25C14.8599 1.25 17.1899 3.58 17.1899 6.44C17.1799 9.25 14.9799 11.53 12.1899 11.62C12.1799 11.62 12.1699 11.62 12.1599 11.62ZM11.9999 2.75C9.96994 2.75 8.30994 4.41 8.30994 6.44C8.30994 8.44 9.86994 10.05 11.8599 10.12C11.9099 10.11 12.0499 10.11 12.1799 10.12C14.1399 10.03 15.6799 8.42 15.6899 6.44C15.6899 4.41 14.0299 2.75 11.9999 2.75Z"
          fill="#fff" />
        <path
          d="M12.17 22.55C10.21 22.55 8.23998 22.05 6.74998 21.05C5.35998 20.13 4.59998 18.87 4.59998 17.5C4.59998 16.13 5.35998 14.86 6.74998 13.93C9.74998 11.94 14.61 11.94 17.59 13.93C18.97 14.85 19.74 16.11 19.74 17.48C19.74 18.85 18.98 20.12 17.59 21.05C16.09 22.05 14.13 22.55 12.17 22.55ZM7.57998 15.19C6.61998 15.83 6.09998 16.65 6.09998 17.51C6.09998 18.36 6.62998 19.18 7.57998 19.81C10.07 21.48 14.27 21.48 16.76 19.81C17.72 19.17 18.24 18.35 18.24 17.49C18.24 16.64 17.71 15.82 16.76 15.19C14.27 13.53 10.07 13.53 7.57998 15.19Z"
          fill="#fff" />
      </svg>
    </button>
    <ModalWrapper />
  </div>

  <div v-else class="profile-cart">
    <div class="profile">
      <img src="/profile/blank-profile.png" alt="" />
    </div>
    <span class="line"></span>
    <div class="cart">
      <NuxtLink to="/userPannel/cart">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M7.377 18.904q-.604 0-.99-.419T6 17.464V9.297L4.329 5.423H2.962q-.213 0-.357-.144t-.144-.356t.144-.357t.356-.143h1.505q.243 0 .447.138q.203.137.304.353L6.541 8h13.101q.463 0 .704.389t.023.792l-2.407 4.729q.967.084 1.618.802q.65.717.65 1.692q0 1.036-.72 1.768q-.722.732-1.755.732q-1.051 0-1.775-.732t-.724-1.768q0-.486.163-.899q.164-.413.466-.736l-4.68-.415l-2.5 3.73q-.228.347-.58.583q-.353.237-.748.237m9.473-5.029L19.325 9H6.962l1.288 3q.21.5.672.838t1.151.406zm-9.467 4.004q.204 0 .494-.356l2.214-3.273q-1.014-.125-1.656-.54q-.643-.414-.974-1.106L7 11.527v5.942q0 .187.1.298q.1.112.283.112m10.348.044q.65 0 1.075-.437t.425-1.063q0-.65-.425-1.075t-1.075-.425q-.625 0-1.063.425t-.437 1.075q0 .625.437 1.063t1.063.437m-.881-4.048l-6.777-.63z" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup>
// const { user, logout } = useAuth();
const user = ref(false); // Simulating user state, replace with actual auth logic
import { useAuthStep } from "@/composables/useAuthStep";

const { setStep } = useAuthStep();
</script>
<style scoped>
.btn {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid white;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px 12px;
  color: white;
}
.btn svg {
  margin-right: 5px;
  transition: fill 0.5s;
}

.btn:hover {
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: 0.5s; /* Minimal shadow effect */
}

.btn:hover span {
  color: var(--blue-dark);
  transition: 0.5s;
}

.btn:hover svg path {
  fill: var(--blue-dark);
  transition: 0.5s; /* Change this color to your desired hover color */
}

.profile-cart {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.profile-cart .line {
  width: 1px; /* Line thickness */
  height: 34px; /* Line height */
  background-color: rgba(255, 255, 255, 0.2); /* Line color */
}
.cart svg {
  color: white;
  width: 53px;
  height: 53px;
  cursor: pointer;
}
</style>
