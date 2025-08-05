<template>
  <div class="fav-container">
    <!-- Placeholder for favorite items -->

    <div class="fav-grid">
      <div v-for="item in favorites" :key="item.id">
        <SingleProduct :productId="item.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Placeholder data - replace with actual data from your store/API
const favorites = ref([
  {
    id: 1,
    image: "/products/ajor.jpg",
    title: "یک عدد آجر",
    description: "Description 1",
  },
  {
    id: 1,
    image: "/products/ajor.jpg",
    title: "یک عدد آجر",
    description: "Description 1",
  },
  {
    id: 1,
    image: "/products/ajor.jpg",
    title: "یک عدد آجر",
    description: "Description 1",
  },
  {
    id: 1,
    image: "/products/ajor.jpg",
    title: "یک عدد آجر",
    description: "Description 1",
  },
  {
    id: 1,
    image: "/products/ajor.jpg",
    title: "یک عدد آجر",
    description: "Description 1",
  },
  {
    id: 1,
    image: "/products/ajor.jpg",
    title: "یک عدد آجر",
    description: "Description 1",
  },
  {
    id: 1,
    image: "/products/ajor.jpg",
    title: "یک عدد آجر",
    description: "Description 1",
  },
]);

const removeFavorite = (id) => {
  // Implement remove functionality
  favorites.value = favorites.value.filter((item) => item.id !== id);
};
</script>

<style scoped>
.fav-container {
  width: 100%;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background-color: #ffff;
}

.no-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.no-items img {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.no-items p {
  color: #666;
  font-size: 1.1rem;
}

.fav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 600px) {
  .fav-container {
    width: 100vw;
    padding: 20px 10px;
    padding-top: 0;
  }
  .fav-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
