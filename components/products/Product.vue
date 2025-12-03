<template>
  <div class="container-title">
    <div class="name">
      <h1>{{ data.name || "محصول بدون نام" }}</h1>
    </div>
    <div class="description">
      <!-- اگر شرکتی موجود باشد -->
      <span class="sub" v-if="data.companiesId && data.companiesId.length > 0">
        <span class="title">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.1998 22.75H9.79977C4.85977 22.75 2.75977 20.64 2.75977 15.71V11.22C2.75977 10.81 3.09977 10.47 3.50977 10.47C3.91977 10.47 4.25977 10.81 4.25977 11.22V15.71C4.25977 19.8 5.70977 21.25 9.79977 21.25H15.1898C19.2798 21.25 20.7298 19.8 20.7298 15.71V11.22C20.7298 10.81 21.0698 10.47 21.4798 10.47C21.8898 10.47 22.2298 10.81 22.2298 11.22V15.71C22.2398 20.64 20.1298 22.75 15.1998 22.75Z"
              fill="#253D4E" />
          </svg>
        </span>
        شرکت تأمین کننده
      </span>

      <!-- وضعیت موجودی -->
      <span class="sub">
        <span class="title">وضعیت:</span>
        <span class="stock-status" :class="stockStatusClass">
          {{ stockStatusLabel }}
        </span>
      </span>

      <!-- رتبه‌بندی اگر موجود باشد -->
      <span class="sub" v-if="data.rating">
        <span class="title">رتبه:</span>
        <span class="rating">⭐ {{ data.rating }}/5</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/types/product";

const props = defineProps<{
  data: Product;
}>();

const stockStatusClass = computed(() => {
  if (!props.data.stock?.available) return "out-of-stock";
  if (props.data.stock.available < 5) return "low-stock";
  return "in-stock";
});

const stockStatusLabel = computed(() => {
  if (!props.data.stock?.available) return "⛔ ناموجود";
  if (props.data.stock.available < 5) return "⚠️ تنها چند عدد باقی‌مانده";
  return "✅ موجود";
});
</script>
<style scoped>
.container-title {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.container-title h1 {
  font-family: "iran-yekan-DemiBold";
  color: var(--blue-dark);
  font-size: 32px;
  text-align: end;
  margin: 15px 50px;
  font-weight: bold;
}

.container-title .description {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 30px;
  flex-wrap: wrap;
}

.container-title .description span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.container-title .description .title {
  font-size: 16px;
  font-family: "iran-yekan-DemiBold";
  color: #666;
}

.sub {
  margin: 5px 50px;
  font-size: 14px;
  font-family: "iran-yekan-Light";
}

.stock-status {
  font-family: "iran-yekan-DemiBold";
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.stock-status.in-stock {
  background-color: #e8f5e9;
  color: #2e7d32;
  font-weight: bold;
}

.stock-status.low-stock {
  background-color: #fff3e0;
  color: #e65100;
  font-weight: bold;
}

.stock-status.out-of-stock {
  background-color: #ffebee;
  color: #c62828;
  font-weight: bold;
}

.rating {
  font-family: "iran-yekan-DemiBold";
  color: #ffc107;
  font-size: 14px;
}

@media only screen and (max-width: 768px) {
  .name {
    width: 100%;
    margin: auto;
    position: relative;
    bottom: 40px;
  }

  .name h1 {
    font-size: 24px;
    font-family: "iran-yekan-DemiBold";
    z-index: 999;
  }

  .container-title h1 {
    font-size: 18px;
    margin: 10px 20px;
  }

  .sub {
    margin: 5px 20px;
    font-size: 12px;
  }

  .container-title .description {
    flex-direction: column;
    gap: 10px;
  }

  .container-title .description .title {
    font-size: 12px;
  }

  .container-title .description span {
    font-size: 10px;
  }
}
</style>
