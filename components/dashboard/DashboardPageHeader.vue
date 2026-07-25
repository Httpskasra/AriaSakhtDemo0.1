<template>
  <div class="dashboard-page-header">
    <h1>{{ title }}</h1>
    <img v-if="icon" :src="icon" :alt="alt || title" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
  alt?: string;
}>();
</script>

<style scoped>
.dashboard-page-header {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 15px;
}

.dashboard-page-header h1 {
  font-size: 36px;
  font-weight: 700;
}

.dashboard-page-header img {
  width: 66px;
  height: 66px;
}

@media (max-width: 767px) {
  .dashboard-page-header {
    width: 40%;
  }

  .dashboard-page-header h1 {
    font-size: 20px;
  }

  .dashboard-page-header img {
    width: 40px;
    height: 40px;
  }
}
</style>
