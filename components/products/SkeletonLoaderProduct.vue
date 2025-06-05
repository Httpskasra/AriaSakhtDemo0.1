<template>
  <div class="flex flex-col gap-8 animate-pulse rtl">
    <!-- Header Section -->
    <div class="h-10 w-2/3 bg-gray-300 rounded-lg mx-auto"></div>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row justify-between gap-8">
      <!-- Right Section (Image) -->
      <div class="flex flex-col gap-4 w-full lg:w-1/4">
        <div class="h-64 w-full bg-gray-300 rounded-lg"></div>
        <div class="flex gap-2 justify-center">
          <div class="h-16 w-16 bg-gray-300 rounded-lg"></div>
          <div class="h-16 w-16 bg-gray-300 rounded-lg"></div>
          <div class="h-16 w-16 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
      <!-- Left Section (Product Details) -->
      <div class="flex flex-col gap-4 w-full lg:w-1/4">
        <div class="h-8 w-3/4 bg-gray-300 rounded-lg self-end"></div>
        <div class="h-8 w-3/4 bg-gray-300 rounded-lg self-end"></div>
        <div class="h-8 w-3/4 bg-gray-300 rounded-lg self-end"></div>
        <div class="h-8 w-3/4 bg-gray-300 rounded-lg self-end"></div>
        <div class="h-8 w-3/4 bg-gray-300 rounded-lg self-end"></div>
        <div class="h-12 w-full bg-gray-300 rounded-lg"></div>
      </div>

      <!-- Middle Section (Form) -->
      <div class="flex flex-col gap-4 w-full lg:w-1/4">
        <div class="h-10 w-full bg-gray-300 rounded-lg"></div>
        <div class="h-10 w-full bg-gray-300 rounded-lg"></div>
        <div class="h-10 w-full bg-gray-300 rounded-lg"></div>
        <div class="h-10 w-full bg-gray-300 rounded-lg"></div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="flex flex-col items-center gap-4">
      <div class="h-6 w-1/4 bg-gray-300 rounded-lg"></div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        <div class="h-20 bg-gray-300 rounded-lg"></div>
        <div class="h-20 bg-gray-300 rounded-lg"></div>
        <div class="h-20 bg-gray-300 rounded-lg"></div>
        <div class="h-20 bg-gray-300 rounded-lg"></div>
        <div class="h-20 bg-gray-300 rounded-lg"></div>
        <div class="h-20 bg-gray-300 rounded-lg"></div>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div class="h-40 bg-gray-300 rounded-lg"></div>
      <div class="h-40 bg-gray-300 rounded-lg"></div>
      <div class="h-40 bg-gray-300 rounded-lg"></div>
      <div class="h-40 bg-gray-300 rounded-lg"></div>
      <div class="h-40 bg-gray-300 rounded-lg"></div>
    </div>

    <!-- Tabs Section -->
    <div class="flex gap-4 justify-center">
      <div class="h-8 w-24 bg-gray-300 rounded-lg"></div>
      <div class="h-8 w-24 bg-gray-300 rounded-lg"></div>
      <div class="h-8 w-24 bg-gray-300 rounded-lg"></div>
    </div>

    <!-- Comments Section -->
    <div class="flex flex-col gap-4">
      <div class="h-20 bg-gray-300 rounded-lg"></div>
      <div class="h-20 bg-gray-300 rounded-lg"></div>
      <div class="h-20 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
</template>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
