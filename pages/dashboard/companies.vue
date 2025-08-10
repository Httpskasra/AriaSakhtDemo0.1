<!-- pages/dashboard/carts.vue -->
<script setup lang="ts">
import { Resource } from "~/types/permissions";
import { useAccess } from "~/composables/useAccess";
const { canCreate, canRead, canUpdate, canDelete } = useAccess(Resource.COMPANIES);
definePageMeta({
  middleware: 'dashboard-auth'
});
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Cart Management</h1>
      <div class="space-x-2 mb-6">
        <button v-if="canCreate" class="btn-create">Create</button>
        <button v-if="canRead" class="btn-read">Read</button>
        <button v-if="canUpdate" class="btn-update">Update</button>
        <button v-if="canDelete" class="btn-delete">Delete</button>
      </div>
      <p v-if="!canRead" class="text-red-500 font-semibold">
        You don't have permission to read carts.
      </p>
      <div v-else class="bg-white shadow p-4 rounded">
        Cart list goes here...
      </div>
    </div>
  </NuxtLayout>
</template>
