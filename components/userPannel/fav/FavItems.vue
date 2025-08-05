<template>
  <div class="fav-container">
    <div class="fav-items">
      <!-- Placeholder for favorite items -->

      <div class="fav-grid">
        <div v-for="item in favorites" :key="item.id" class="fav-item">
          <SingleProduct :productID="item.id" />
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
  margin: auto;
  display: flex; /* Add flexbox */
  justify-content: center; /* Center horizontally */
  align-items: center;
  min-height: 100vh;
}

.fav-items {
  width: 100%;
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.fav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 10px;
  position: relative;
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
@media (max-width: 767px) {
  .fav-container {
    padding: 0;
    margin-right: -4px;
    width: 99vw;
    margin-top: 10px;
  }
  .fav-items {
    padding: 5px;
    margin: auto;
  }
  .fav-item {
    padding: 0;
  }

  .fav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 2fr));
    gap: 0;
  }
}
</style>
