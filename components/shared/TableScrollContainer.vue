<template>
  <div class="table-scroll-container">
    <div class="table-scroll-container__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.table-scroll-container {
  position: relative;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.table-scroll-container::after {
  content: "";
  position: sticky;
  right: 0;
  display: block;
  width: 1.25rem;
  height: 100%;
  margin-top: -100%;
  pointer-events: none;
  background: linear-gradient(to left, var(--color-overlay), transparent);
  opacity: 0.45;
}

.table-scroll-container__content {
  min-width: max-content;
}
</style>
