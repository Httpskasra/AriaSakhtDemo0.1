<template>
  <div class="modal-overlay no-scroll" @click.self="$emit('close')">
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>
<script setup>
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
  background-color: #fff;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
