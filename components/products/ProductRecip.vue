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
        <span class="val status" :style="useStatusStyle(data.status)">{{ statusLabel }}</span>
      </li>
    </ul>
    <ActionButton class="sub" tone="secondary" @click="copyProductLink">کپی لینک محصول</ActionButton>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";
import { computed, ref, onMounted } from "vue";

const props = defineProps<{
  data: Product;
}>();

const toast = useToast();

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
  toast.add({ title: "کپی شد", description: "لینک محصول در کلیپ‌بورد ذخیره شد.", color: "success" });
  });
};
</script>
<style scoped>
.container-recip {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
  width: 340px;
  height: 380px;
  position: relative;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.recip-header {
  margin-bottom: 15px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}

.recip-header h3 {
  margin: 0;
  color: var(--color-text-heading);
  font-family: var(--font-yekan);
  font-size: 1.05rem;
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
  border-bottom: 1px solid var(--color-border);
  padding: .75rem 0;
}

li:last-child {
  border: none;
}

.title {
  font-size: .82rem;
  color: var(--color-text-muted);
  font-family: var(--font-yekan);
  font-weight: bold;
}

.val {
  font-size: .82rem;
  color: var(--color-brand-blue);
  font-family: var(--font-num);
  text-align: left;
}

.val.discount {
  color: var(--color-danger-fg);
  font-weight: bold;
}

.val.available {
  color: var(--color-success-fg);
}

.val.unavailable {
  color: var(--color-danger-fg);
}

.val.status {
  padding: .2rem .5rem;
  border-radius: var(--radius-pill);
  font-size: .72rem;
}

@media (max-width: 767px) {
  .container-recip {
    width: 100%;
    height: auto;
    padding: 1rem;
  }

  .recip-header {
    margin-bottom: 12px;
    padding-bottom: 8px;
  }

  .recip-header h3 {
    font-size: .95rem;
  }

  ul {
    height: auto;
  }

  li {
    height: auto;
    padding: .6rem 0;
  }

  .title {
    font-size: .75rem;
  }

  .val {
    font-size: .75rem;
  }

}

@media (max-width: 480px) {
  .container-recip {
    padding: .75rem;
  }

  .recip-header h3 {
    font-size: .9rem;
  }

  li {
    padding: .5rem 0;
  }

  .title,
  .val {
    font-size: .7rem;
  }

}
</style>
