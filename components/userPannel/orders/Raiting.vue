<template>
  <div class="rating">
    <span
      v-for="star in 5"
      :key="star"
      @click="setRating(star)"
      @mouseover="setHoverRating(star)"
      @mouseleave="setHoverRating(0)"
      :class="{ active: star <= rating || star <= hoverRating }"
      :style="{ fontSize: size }">
      ★
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "20px",
  },
});

const emit = defineEmits<{
  rate: [value: number];
}>();

const rating = ref(0);
const hoverRating = ref(0);

const setRating = (value: number) => {
  rating.value = value;
  emit("rate", value);
};

const setHoverRating = (value: number) => {
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
