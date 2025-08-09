<!-- pages/dashboard/carts.vue -->
<script setup lang="ts">
import { useUser } from '~/composables/useUser';
const { fetchUser } = useUser();
const router=useRouter()
onMounted(() => {
  fetchUser();
  router.push("/dashboard/profile")
});
</script>

<template>
  <NuxtLayout name="dashboard">
    kasra
  </NuxtLayout>
</template>
