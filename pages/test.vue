<template>
  <NuxtLayout name="dashboard">
    <NuxtLink :to="`/products/${productIdComputed}`" class="single-product">
      <!-- عکس محصول -->
      <div class="image-wrapper">
        <img v-if="imageUrl" :src="imageUrl" :alt="productName" />
        <div v-else class="image-placeholder">بدون تصویر</div>
      </div>

      <!-- نام محصول -->
      <p class="product-name">
        {{ productName }}
      </p>

      <!-- شرکت / برند (اگر موجود بود) -->
      <p v-if="companyName" class="product-company">
        {{ companyName }}
      </p>

      <!-- قیمت -->
      <p class="product-price">{{ displayPrice }} تومان</p>

      <!-- موجودی (اختیاری) -->
      <p v-if="stockQuantity !== null" class="product-stock">
        موجودی: {{ stockQuantity }}
      </p>
    </NuxtLink>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";

type ProductImage = { url?: string };
type Company = { name?: string };
type Stock = { quantity?: number };

type Product = {
  id?: string;
  _id?: string;
  name?: string;
  slug?: string;
  sku?: string;
  basePrice?: number;
  finalPrice?: number;
  companyId?: Company;
  images?: ProductImage[];
  stock?: Stock;
  // بقیه‌ی فیلدها هم اگر خواستی بعداً اضافه کن
  [key: string]: any;
};

const props = defineProps<{
  productId?: string;
  product?: Product;
}>();

// اگر productId نیامد، از product.id یا product._id استفاده می‌کنیم
const productIdComputed = computed(() => {
  if (props.productId) return props.productId;
  if (props.product?.id) return String(props.product.id);
  if ((props.product as any)?._id) return String((props.product as any)._id);
  return "";
});

const productName = computed(() => {
  return props.product?.name || "بدون نام";
});

const imageUrl = computed(() => {
  const imgs = props.product?.images;
  if (imgs && imgs.length && imgs[0].url) {
    return imgs[0].url;
  }
  return "";
});

// قیمت: اگر finalPrice بود از آن، وگرنه fallback به basePrice
const displayPrice = computed(() => {
  const p = props.product;
  if (!p) return 0;
  if (typeof p.finalPrice === "number") return p.finalPrice;
  if (typeof p.basePrice === "number") return p.basePrice;
  return 0;
});

const companyName = computed(() => {
  return props.product?.companyId?.name || "";
});

const stockQuantity = computed<number | null>(() => {
  if (!props.product?.stock) return null;
  if (typeof props.product.stock.quantity === "number") {
    return props.product.stock.quantity;
  }
  return null;
});
</script>

<style scoped>
.single-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 140px;
  padding: 8px;
  background: #ffffff;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.image-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

.product-name {
  font-size: 14px;
  font-weight: 700;
  margin-top: 8px;
  text-align: center;
}

.product-company {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
  text-align: center;
}

.product-price {
  font-size: 14px;
  font-weight: 800;
  color: #e53935;
  margin-top: 6px;
}

.product-stock {
  font-size: 12px;
  color: #4caf50;
  margin-top: 2px;
}
</style>
