<template>
  <NuxtLayout name="dashboard">
    <div class="title">
      <h1>سبد خرید</h1>
      <img src="/icons/cart.png" alt="" />
    </div>

    <div class="container" dir="rtl">
      <!-- Loading State -->
      <div v-if="loading" class="col-products">
        <div class="loading-message">درحال بارگذاری...</div>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartItems.length === 0" class="col-products">
        <div class="empty-message">سبد خرید خالی است</div>
      </div>

      <!-- Cart Items -->
      <div v-else class="col-products">
        <div class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.productId"
            class="cart-item">
            <div class="item-info">
              <h3>{{ item.productName }}</h3>
              <p class="sku">SKU: {{ item.sku }}</p>
              <p class="quantity">تعداد: {{ item.quantity }}</p>
            </div>
            <div class="item-price">
              <p class="price">{{ numberFormat(item.price) }} تومان</p>
              <p class="total">
                جمع: {{ numberFormat((item.price || 0) * item.quantity) }} تومان
              </p>
            </div>
            <div class="item-actions">
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                @change="updateQuantity(item)"
                class="quantity-input" />
              <button
                @click="removeFromCart(item.productId)"
                class="btn-remove">
                حذف
              </button>
            </div>
          </div>
        </div>

        <button @click="clearCart" class="btn-clear-all">خالی کردن سبد</button>
      </div>

      <!-- Cart Summary (Factor) -->
      <div class="col-summary" v-if="cartItems.length > 0">
        <div class="summary-box">
          <h2>خلاصه سبد</h2>

          <div class="summary-row">
            <span>تعداد اقلام:</span>
            <span>{{ totalItems }}</span>
          </div>

          <div class="summary-row">
            <span>قیمت کل:</span>
            <span>{{ numberFormat(totalPrice) }} تومان</span>
          </div>

          <div class="summary-row">
            <span>هزینه ارسال:</span>
            <span>{{ numberFormat(shippingCost) }} تومان</span>
          </div>

          <div class="summary-row total">
            <span>جمع نهایی:</span>
            <span>{{ numberFormat(totalPrice + shippingCost) }} تومان</span>
          </div>

          <button
            @click="checkout"
            :disabled="isCheckingOut"
            class="btn-checkout">
            {{ isCheckingOut ? "درحال پردازش..." : "تسویه حساب" }}
          </button>

          <button @click="continueShopping" class="btn-continue">
            ادامه خرید
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="notification success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="notification error">
      {{ errorMessage }}
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import dashboardAuth from "~/middleware/dashboard-auth";

definePageMeta({
  middleware: dashboardAuth,
});

useHead({
  title: " آریاساخت | داشبورد | سبد خرید",
});

// Types
interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  variantId?: string;
  selectedVariant?: Record<string, string>;
  companyId?: string;
  priceAtAdd?: number;
}

// State
const { $axios } = useNuxtApp();
const cartItems = ref<CartItem[]>([]);
const loading = ref(false);
const isCheckingOut = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const shippingCost = ref(0);

// Computed
const totalItems = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

const totalPrice = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  )
);

// Helper functions
function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}

function showNotification(message: string, type: "success" | "error") {
  if (type === "success") {
    successMessage.value = message;
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } else {
    errorMessage.value = message;
    setTimeout(() => {
      errorMessage.value = null;
    }, 3000);
  }
}

// API calls
async function fetchCart() {
  loading.value = true;
  try {
    const { data } = await $axios.get("/carts/populated");
    // Map API response to CartItem format
    if (data.items && Array.isArray(data.items)) {
      cartItems.value = data.items.map((item: any) => ({
        productId: item.productId || item.product?._id,
        productName: item.productName || item.product?.name,
        sku: item.sku || item.product?.sku,
        price: item.price || item.product?.basePrice,
        quantity: item.quantity,
        variantId: item.variantId,
        selectedVariant: item.selectedVariant,
        companyId: item.companyId || item.product?.companyId,
        priceAtAdd: item.priceAtAdd || item.price || item.product?.basePrice,
      }));
    } else {
      cartItems.value = [];
    }
  } catch (err) {
    console.error("خطا در دریافت سبد:", err);
    cartItems.value = [];
    showNotification("خطا در بارگذاری سبد خرید", "error");
  } finally {
    loading.value = false;
  }
}

async function addToCart(
  productId: string,
  quantity: number,
  variantId?: string,
  selectedVariant?: Record<string, string>,
  companyId?: string,
  priceAtAdd?: number
) {
  try {
    await $axios.post(`/carts/items/${productId}`, {
      productId,
      quantity,
      variantId,
      selectedVariant,
      companyId,
      priceAtAdd,
    });
    await fetchCart();
    showNotification("محصول به سبد افزوده شد", "success");
  } catch (err: any) {
    console.error("خطا در افزودن به سبد:", err);
    showNotification(
      err?.response?.data?.message || "خطا در افزودن به سبد",
      "error"
    );
  }
}

async function updateQuantity(item: CartItem) {
  try {
    await $axios.post(`/carts/items/${item.productId}`, {
      productId: item.productId,
      quantity: item.quantity,
      variantId: item.variantId,
      selectedVariant: item.selectedVariant,
      companyId: item.companyId,
      priceAtAdd: item.priceAtAdd,
    });
    await fetchCart();
    showNotification("سبد به‌روزرسانی شد", "success");
  } catch (err: any) {
    console.error("خطا در به‌روزرسانی:", err);
    showNotification("خطا در به‌روزرسانی سبد", "error");
    await fetchCart();
  }
}

async function removeFromCart(productId: string) {
  try {
    await $axios.delete(`/carts/items/${productId}`);
    await fetchCart();
    showNotification("محصول از سبد حذف شد", "success");
  } catch (err: any) {
    console.error("خطا در حذف:", err);
    showNotification("خطا در حذف محصول", "error");
  }
}

async function clearCart() {
  if (!confirm("آیا از خالی کردن تمام سبد اطمینان دارید؟")) return;

  try {
    await $axios.delete("/carts/clear");
    cartItems.value = [];
    showNotification("سبد خالی شد", "success");
  } catch (err: any) {
    console.error("خطا در خالی کردن سبد:", err);
    showNotification("خطا در خالی کردن سبد", "error");
  }
}

async function checkout() {
  if (cartItems.value.length === 0) {
    showNotification("سبد خرید خالی است", "error");
    return;
  }

  isCheckingOut.value = true;
  try {
    const response = await $axios.post("/carts/checkout");
    showNotification("سفارش با موفقیت ثبت شد", "success");
    cartItems.value = [];
    // Redirect to order confirmation or payment page
    setTimeout(() => {
      navigateTo(`/orders/${response.data._id}`);
    }, 1500);
  } catch (err: any) {
    console.error("خطا در تسویه حساب:", err);
    showNotification(
      err?.response?.data?.message || "خطا در ثبت سفارش",
      "error"
    );
  } finally {
    isCheckingOut.value = false;
  }
}

function continueShopping() {
  navigateTo("/products");
}

onMounted(() => {
  fetchCart();
});

// Export addToCart for external use
defineExpose({
  addToCart,
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  width: 90%;
  margin: 20px auto;
}

.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 15px;
}

.title h1 {
  font-size: 36px;
}

.title img {
  width: 66px;
  height: 66px;
}

.col-products {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.col-summary {
  flex: 0 0 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  top: 20px;
  position: sticky;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray-600);
  font-size: 16px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  background: var(--gray-50);
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--blue-dark);
}

.item-info .sku,
.item-info .quantity {
  margin: 4px 0;
  font-size: 13px;
  color: var(--gray-600);
}

.item-price {
  flex: 0 0 150px;
  text-align: center;
}

.item-price .price {
  margin: 0 0 8px 0;
  font-weight: bold;
  color: var(--blue-dark);
}

.item-price .total {
  margin: 0;
  font-size: 14px;
  color: var(--gray-600);
}

.item-actions {
  flex: 0 0 180px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.quantity-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.btn-remove {
  padding: 6px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.3s;
}

.btn-remove:hover {
  background-color: #d32f2f;
}

.btn-clear-all {
  width: 100%;
  padding: 10px;
  background-color: var(--gray-500);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-clear-all:hover {
  background-color: var(--gray-600);
}

/* Summary Box */
.summary-box h2 {
  color: var(--blue-dark);
  font-family: "iran-yekan-DemiBold";
  margin-bottom: 20px;
  font-size: 18px;
  border-bottom: 2px solid var(--gray-200);
  padding-bottom: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  padding: 10px 0;
  border-bottom: 1px solid var(--gray-200);
}

.summary-row.total {
  font-weight: bold;
  font-size: 16px;
  color: var(--blue-dark);
  border-bottom: 2px solid var(--blue-dark);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.btn-checkout,
.btn-continue {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-family: "iran-yekan-DemiBold";
  transition: background-color 0.3s;
  margin-bottom: 10px;
}

.btn-checkout {
  background-color: var(--blue-dark);
  color: white;
}

.btn-checkout:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-continue {
  background-color: var(--gray-300);
  color: var(--gray-800);
}

.btn-continue:hover {
  background-color: var(--gray-400);
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 4px;
  font-family: "iran-yekan-DemiBold";
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #4caf50;
  color: white;
}

.notification.error {
  background-color: #f44336;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .container {
    gap: 20px;
  }

  .col-summary {
    flex: 0 0 280px;
  }
}

@media (max-width: 767px) {
  .container {
    width: 95%;
    margin: 10px auto;
    flex-direction: column;
    gap: 20px;
  }

  .col-products,
  .col-summary {
    flex: 1;
  }

  .col-summary {
    position: static;
    flex: 0 1 auto;
  }

  .title {
    width: 100%;
    justify-content: flex-start;
    margin: 10px;
  }

  .title h1 {
    font-size: 20px;
  }

  .title img {
    width: 40px;
    height: 40px;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .item-price,
  .item-actions {
    width: 100%;
  }

  .item-actions {
    display: flex;
    gap: 10px;
  }

  .quantity-input {
    flex: 1;
  }

  .btn-remove {
    flex: 1;
  }

  .summary-row {
    font-size: 13px;
  }

  .notification {
    left: 10px;
    right: 10px;
    top: auto;
    bottom: 20px;
  }
}
</style>
