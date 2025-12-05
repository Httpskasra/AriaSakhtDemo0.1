<template>
  <div class="container-recip">
    <div class="recip-header">
      <h3>مشخصات کلیدی</h3>
    </div>
    <ul>
      <li v-if="data.sku">
        <span class="title">کد محصول</span>
        <span class="val">{{ data.sku }}</span>
      </li>
      <li v-if="data.basePrice">
        <span class="title">قیمت پایه</span>
        <span class="val">{{ formatPrice(data.basePrice) }}</span>
      </li>
      <li v-if="data.discount">
        <span class="title">تخفیف</span>
        <span class="val discount">{{ data.discount }}%</span>
      </li>
      <li v-if="data.stock?.quantity !== undefined">
        <span class="title">موجودی</span>
        <span
          class="val"
          :class="data.stock.quantity > 0 ? 'available' : 'unavailable'">
          {{ data.stock.quantity }} عدد
        </span>
      </li>
      <li v-if="getCategoryNames.length > 0">
        <span class="title">دسته‌بندی</span>
        <span class="val">{{ getCategoryNames.join(", ") }}</span>
      </li>
      <li v-if="data.status">
        <span class="title">وضعیت</span>
        <span class="val status" :class="data.status">{{ statusLabel }}</span>
      </li>
    </ul>
    <button class="sub" @click="copyProductLink">کپی لینک محصول</button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";
import { computed, ref, onMounted } from "vue";

const props = defineProps<{
  data: Product;
}>();

interface Category {
  _id?: string;
  name: string;
  slug?: string;
}

const categories = ref<Category[]>([]);

onMounted(async () => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get("/categories");

    if (Array.isArray(response.data)) {
      categories.value = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      categories.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

const getCategoryNames = computed(() => {
  if (!props.data.categories || props.data.categories.length === 0) {
    return [];
  }

  return props.data.categories.map((catId: string) => {
    const category = categories.value.find((cat) => cat._id === catId);
    return category?.name || catId;
  });
});

const statusLabel = computed(() => {
  const statuses: Record<string, string> = {
    active: "فعال",
    inactive: "غیرفعال",
    draft: "پیش‌نویس",
    archived: "بایگانی‌شده",
  };
  return statuses[props.data.status || "inactive"] || props.data.status || "-";
});

const formatPrice = (price: number) => {
  return price.toLocaleString("fa-IR") + " ت";
};

const copyProductLink = () => {
  const productLink = `${window.location.origin}/products/${props.data.id}`;
  navigator.clipboard.writeText(productLink).then(() => {
    alert("لینک محصول کپی شد!");
  });
};
</script>
<style scoped>
.container-recip {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 340px;
  height: 380px;
  position: relative;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.recip-header {
  margin-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.recip-header h3 {
  margin: 0;
  color: #333;
  font-family: "iran-yekan-DemiBold";
  font-size: 18px;
}

ul {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 0;
}

li:last-child {
  border: none;
}

.title {
  font-size: 14px;
  color: #666;
  font-family: "iran-yekan-DemiBold";
  font-weight: bold;
}

.val {
  font-size: 14px;
  color: #0066cc;
  font-family: "iran-yekan-num-DemiBold";
  text-align: left;
}

.val.discount {
  color: #ff4444;
  font-weight: bold;
}

.val.available {
  color: #22aa22;
}

.val.unavailable {
  color: #cc2222;
}

.val.status {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.val.status.active {
  background-color: #e3f2fd;
  color: #0066cc;
}

.val.status.inactive {
  background-color: #f3f3f3;
  color: #666;
}

.val.status.draft {
  background-color: #fff3e0;
  color: #ff9800;
}

.val.status.archived {
  background-color: #fce4ec;
  color: #c2185b;
}

button.sub {
  font-family: "iran-yekan-DemiBold";
  width: 100%;
  padding: 12px;
  height: 45px;
  color: var(--blue-dark);
  background-color: var(--yellow-warning);
  border: none;
  border-radius: 0 0 7px 7px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

button.sub:hover {
  opacity: 0.9;
  background-color: #ffc107;
}

@media (max-width: 767px) {
  .container-recip {
    width: 90%;
    height: auto;
    display: flex;
    flex-direction: column;
  }

  .title,
  .val {
    font-size: 12px;
  }

  button.sub {
    border-radius: 0;
    width: calc(100% + 30px);
    margin: 15px -15px -15px -15px;
    padding: 10px;
    height: 40px;
  }
}

@media (max-width: 767px) {
  .container-recip {
    width: 90%;
    height: 270px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px;
  }
  ul {
    height: 70%;
  }
  li {
    height: 20px;
  }
  .title,
  .val {
    font-size: 10px;
  }
  button.sub {
    width: 100%;
    height: 30px;
    font-size: 10px;
  }
}
</style>
