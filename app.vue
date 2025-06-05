<template>
  <div id="app">
    <div class="main-content">
      <!-- <NuxtLoadingIndicator /> -->
      <NuxtPage />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-top: 190px; /* Adjust this value based on the combined height of the banner and navigation */
}
</style>
