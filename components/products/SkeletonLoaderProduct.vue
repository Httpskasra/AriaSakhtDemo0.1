<template>
  <div class="bg-white border border-gray-100 rounded-2xl p-4 h-full flex flex-col shadow-sm">
    <!-- Image Skeleton with reserved Badge space -->
    <div class="relative w-full aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden">
      <USkeleton class="size-full" />
      <!-- Ghost Badge -->
      <div class="absolute top-2 right-2">
        <USkeleton class="h-6 w-16 rounded-full opacity-50" />
      </div>
    </div>

    <!-- Content Skeletons -->
    <div class="flex-1 space-y-4">
      <div class="space-y-2">
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-3 w-1/2" />
      </div>

      <div class="flex items-center justify-between pt-2">
        <div class="space-y-1">
          <USkeleton class="h-5 w-24" />
          <USkeleton class="h-3 w-16 opacity-50" />
        </div>
        <USkeleton class="h-10 w-10 rounded-lg" />
      </div>
    </div>
    
    <!-- Action Bar Mirroring Product.vue -->
    <div class="mt-4 pt-4 border-t border-gray-50 flex gap-2">
      <USkeleton class="h-10 flex-1 rounded-lg" />
      <USkeleton class="h-10 w-10 rounded-lg" />
    </div>
  </div>
</template>
