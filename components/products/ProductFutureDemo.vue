<template>
  <div class="container-future-demo">
    <ul v-if="attributes && Object.keys(attributes).length > 0">
      <li v-for="(value, key) in limitedAttributes" :key="key">
        <span class="product-future__label">{{ key }}</span>
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
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
  width: 100%;
  max-width: 900px;
  padding: 1.25rem;
  margin: auto;
}

.no-attributes {
  text-align: center;
  padding: 2rem 1.25rem;
  color: var(--color-text-muted);
}

.no-attributes p {
  font-family: var(--font-yekan);
  font-size: .85rem;
}

ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

li {
  border: 1px solid var(--color-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: var(--radius-field);
  background-color: var(--color-bg-light);
  transition: transform .16s ease, border-color .16s ease, background-color .16s ease;
}

li:hover {
  border-color: var(--color-brand-blue);
  background-color: var(--color-info-bg);
  transform: translateY(-2px);
}

.product-future__label {
  color: var(--color-text-muted);
  font-family: var(--font-yekan);
  font-size: .78rem;
  font-weight: bold;
  text-align: center;
}

.val {
  color: var(--color-brand-blue);
  font-family: var(--font-num);
  font-size: .85rem;
  font-weight: bold;
  text-align: center;
}

@media (max-width: 767px) {
  .container-future-demo {
    width: 90%;
    padding: 1rem;
  }

  ul {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: .65rem;
  }

  li {
    padding: .75rem;
  }

  .product-future__label {
    font-size: .7rem;
  }

  .val {
    font-size: .75rem;
  }
}
</style>
