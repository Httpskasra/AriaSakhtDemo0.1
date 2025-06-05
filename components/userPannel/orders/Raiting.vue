<template>
  <div class="rating">
    <span
      v-for="star in 5"
      :key="star"
      @click="setRating(star)"
      @mouseover="setHoverRating(star)"
      @mouseleave="setHoverRating(0)"
      :class="{ active: star <= rating || star <= hoverRating }"
      :style="{ fontSize: size }"
    >
      ★
    </span>
  </div>
</template>
<script setup>
import { ref } from "vue";
const prop = defineProps({
  size: {
    type: String,
    default: "20px", // مقدار پیش‌فرض
  },
});

const rating = ref(0);
const hoverRating = ref(0);

const setRating = (value) => {
  rating.value = value;
};

const setHoverRating = (value) => {
  hoverRating.value = value;
};
</script>
<style scoped>
.rating span {
  font-size: 20px;
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
}

.rating span.active {
  color: #fdc040;
}
@media (max-width: 767px) {
  .rating span {
    font-size: 13px;
  }
  .rating {
    width: 100%;
  }
}
</style>
