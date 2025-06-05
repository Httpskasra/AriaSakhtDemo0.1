<template>
  <div class="fav-container">
    <div class="fav-items">
      <!-- Placeholder for favorite items -->

      <div class="fav-grid">
        <div v-for="item in favorites" :key="item.id" class="fav-item">
          <SingleProduct />
        </div>
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
}

.fav-items {
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.fav-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  position: relative;
}

.fav-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 15px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 5px 0;
  color: var(--blue-dark);
  font-family: "iran-yekan-Medium";
}

.item-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  position: absolute;
  top: 10px;
  left: 10px;
}

.remove-btn img {
  width: 20px;
  height: 20px;
  margin: 0;
}

.remove-btn:hover {
  opacity: 0.8;
}
</style>
