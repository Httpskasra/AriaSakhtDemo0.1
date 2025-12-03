<template>
  <div class="container-future-demo">
    <ul v-if="attributes && Object.keys(attributes).length > 0">
      <li v-for="(value, key) in limitedAttributes" :key="key">
        <span class="title">{{ key }}</span>
        <span class="val">{{ value }}</span>
      </li>
    </ul>
    <div v-else class="no-attributes">
      <p>ویژگی‌ای برای این محصول تعریف نشده است</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  attributes?: Record<string, string | number>;
}>();

const limitedAttributes = computed(() => {
  if (!props.attributes) return {};
  const entries = Object.entries(props.attributes).slice(0, 6);
  return Object.fromEntries(entries);
});
</script>
<style scoped>
.container-future-demo {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  padding: 20px;
  margin: auto;
}

.no-attributes {
  text-align: center;
  padding: 30px;
  color: #999;
}

.no-attributes p {
  font-family: "iran-yekan-Light";
  font-size: 14px;
}

ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

li {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

li:hover {
  border-color: #0066cc;
  background-color: #f0f5ff;
  transform: translateY(-2px);
}

.title {
  color: #666;
  font-family: "iran-yekan-DemiBold";
  font-size: 13px;
  font-weight: bold;
  text-align: center;
}

.val {
  color: #0066cc;
  font-family: "iran-yekan-num-DemiBold";
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

@media (max-width: 767px) {
  .container-future-demo {
    width: 90%;
    padding: 15px;
  }

  ul {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }

  li {
    padding: 10px;
  }

  .title {
    font-size: 11px;
  }

  .val {
    font-size: 12px;
  }
}
</style>
