<template>
  <div class="container-form">
    <div class="product-info">
      <div class="price-section">
        <span class="price-label">قیمت:</span>
        <span class="price-value">{{ formattedPrice }}</span>
        <span class="original-price" v-if="data.discount">
          {{ originalPrice }}
        </span>
      </div>
      <div class="discount-badge" v-if="data.discount">
        {{ data.discount }}% تخفیف
      </div>
    </div>

    <form @submit.prevent="submitForm">
      <!-- نمایش variants اگر موجود باشد -->
      <div
        v-if="data.variants && data.variants.length > 0"
        class="variants-section">
        <label>
          <span>انتخاب نوع</span>
          <select v-model="selectedVariant" name="variant">
            <option value="">انتخاب کنید...</option>
            <option
              v-for="(variant, index) in data.variants"
              :key="index"
              :value="index">
              {{ variant.name }}
            </option>
          </select>
        </label>
      </div>

      <!-- نمایش attributes -->
      <div
        v-for="(value, key) in data.attributes"
        :key="key"
        class="attribute-field">
        <label>
          <span>{{ key }}</span>
          <input type="text" :value="value" disabled class="attribute-input" />
        </label>
      </div>

      <!-- تعداد -->
      <label>
        <span>تعداد</span>
        <input
          v-model.number="quantity"
          type="number"
          min="1"
          :max="data.stock?.quantity || 1"
          class="quantity-input" />
      </label>

      <!-- وضعیت موجودی -->
      <div class="stock-info">
        <span class="stock-label">موجودی:</span>
        <span class="stock-value" :class="stockStatus">
          {{ data.stock?.quantity || 0 }} عدد
        </span>
      </div>

      <!-- دکمه‌ها -->
      <div class="buttons">
        <button
          type="submit"
          class="add-to-cart-btn"
          :disabled="data.stock?.quantity === 0 || addingToCart"
          @click="submitForm">
          {{ addingToCart ? "در حال افزودن..." : "اضافه کردن به سبد خریدی" }}
        </button>
        <button type="button" class="wishlist-btn" @click="addToWishlist">
          ❤️ علاقه‌مندی
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAddToCart } from "~/composables/useAddToCart";
import type { Product } from "~/types/product";

const props = defineProps<{
  data: Product;
}>();

const emit = defineEmits<{
  "add-to-cart": [
    item: { productId: string; quantity: number; variantId?: string }
  ];
}>();

// استفاده از composable برای افزودن به سبد خریدی
const { loading, error, success, addProductToCart } = useAddToCart();

// State
const quantity = ref(1);
const selectedVariant = ref<number | string>("");
const addingToCart = ref(false);

// Computed
const formattedPrice = computed(() => {
  if (!props.data.basePrice) return "0 ت";
  const finalPrice = props.data.discount
    ? Math.round(props.data.basePrice * (1 - props.data.discount / 100))
    : props.data.basePrice;
  return finalPrice.toLocaleString("fa-IR") + " ت";
});

const originalPrice = computed(() => {
  if (!props.data.basePrice) return "";
  return props.data.basePrice.toLocaleString("fa-IR") + " ت";
});

const stockStatus = computed(() => {
  if (!props.data.stock?.available) return "out-of-stock";
  if (props.data.stock.available < 5) return "low-stock";
  return "in-stock";
});

// Methods
const submitForm = async () => {
  if (!props.data.id) {
    alert("خطا: شناسه محصول یافت نشد");
    return;
  }

  if (quantity.value <= 0) {
    alert("تعداد باید بیشتر از صفر باشد");
    return;
  }

  const cartItem = {
    productId: props.data.id,
    quantity: quantity.value,
    variantId: selectedVariant.value
      ? String(selectedVariant.value)
      : undefined,
  };

  addingToCart.value = true;
  try {
    await addProductToCart(cartItem);

    if (success.value) {
      emit("add-to-cart", cartItem);
      // ری‌ست فرم
      quantity.value = 1;
      selectedVariant.value = "";
      // پیام موفقیت
      alert("محصول با موفقیت به سبد خریدی افزوده شد!");
    } else if (error.value) {
      alert(`خطا: ${error.value}`);
    }
  } catch (err) {
    console.error("خطا در افزودن به سبد خریدی:", err);
    alert("خطای نامشخص رخ داد");
  } finally {
    addingToCart.value = false;
  }
};

const addToWishlist = () => {
  // این قسمت بعدا پیاده‌سازی خواهد شد
  alert("افزودن به علاقه‌مندی ها در حال آماده‌سازی است");
};
</script>
<style scoped>
.container-form {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
  width: 480px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

.price-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.price-label {
  font-family: "iran-yekan-DemiBold";
  color: #666;
  font-weight: bold;
}

.price-value {
  font-family: "iran-yekan-num-Bold";
  font-size: 24px;
  color: #0066cc;
  font-weight: bold;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
}

.discount-badge {
  background-color: #ff4444;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-family: "iran-yekan-num-DemiBold";
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

label span {
  color: #333;
  font-family: "iran-yekan-DemiBold";
  min-width: 100px;
  text-align: right;
}

input,
select {
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 8px 10px;
  font-family: "iran-yekan-num-Light";
  font-size: 14px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.variants-section {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.attribute-field {
  padding: 5px 0;
}

.attribute-input {
  background-color: #f9f9f9;
}

.quantity-input {
  width: 150px;
}

.stock-info {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.stock-label {
  font-family: "iran-yekan-DemiBold";
  color: #666;
}

.stock-value {
  font-family: "iran-yekan-num-DemiBold";
  font-size: 16px;
}

.stock-value.in-stock {
  color: #22aa22;
}

.stock-value.low-stock {
  color: #ff9900;
}

.stock-value.out-of-stock {
  color: #cc2222;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-to-cart-btn,
.wishlist-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-family: "iran-yekan-DemiBold";
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn {
  background-color: #0066cc;
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #0052a3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.3);
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.wishlist-btn {
  background-color: #f0f0f0;
  color: #333;
}

.wishlist-btn:hover {
  background-color: #ffecec;
}

@media (max-width: 767px) {
  .container-form {
    width: 90%;
    height: auto;
    margin: auto;
    padding: 15px;
  }

  label {
    flex-direction: column;
    align-items: flex-start;
  }

  label span {
    min-width: auto;
  }

  input,
  select {
    width: 100%;
  }

  .quantity-input {
    width: 100%;
  }

  .buttons {
    flex-direction: column;
  }

  .add-to-cart-btn,
  .wishlist-btn {
    width: 100%;
  }
}
</style>
