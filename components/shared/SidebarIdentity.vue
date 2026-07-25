<script setup lang="ts">
withDefaults(defineProps<{
  name?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
}>(), {
  name: "نام شخص",
  subtitle: "09164532683",
  imageSrc: "/profile/blank-profile.png",
  imageAlt: "",
});
</script>

<template>
  <div class="sidebar-identity">
    <img class="sidebar-identity__image" :src="imageSrc" :alt="imageAlt" />
    <div class="sidebar-identity__text">
      <h3>{{ name }}</h3>
      <p>{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.sidebar-identity {
  min-height: 10rem;
  padding: 2.75rem 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  background-color: var(--blue-sky);
  flex: none;
}

.sidebar-identity__image {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  flex: none;
}

.sidebar-identity__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-identity__text h3 {
  font-family: var(--font-yekan);
  font-weight: 600;
  color: var(--color-text-heading);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.sidebar-identity__text p {
  font-family: var(--font-num);
  font-weight: 400;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@media (max-width: 767px) {
  .sidebar-identity {
    min-height: 8rem;
    padding: 1rem;
    justify-content: space-evenly;
  }

  .sidebar-identity__image {
    width: 3.125rem;
    height: 3.125rem;
  }
}
</style>
