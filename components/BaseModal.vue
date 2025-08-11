<template>
  <div class="modal-overlay no-scroll" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- دکمه بستن -->
      <button
        @click="$emit('close')"
        aria-label="Close modal"
        class="close-btn">
        ×
      </button>

      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.body.classList.add("no-scroll");
});

onUnmounted(() => {
  document.body.classList.remove("no-scroll");
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  position: relative; /* برای قرارگیری دکمه بسته شدن */
  background-color: #fff;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* استایل دکمه بستن */
.close-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  background: transparent;
  border: none;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  color: #ff0000;
  transition: color 0.2s;
  padding: 10px;
  user-select: none;
}

.close-btn:hover {
  color: #000;
}
</style>
