<template>
  <NuxtLayout>
    <!-- حالت بارگذاری -->
    <div class="loading" v-if="loading">
      <SkeletonLoaderProduct />
    </div>

    <!-- نمایش خطا -->
    <div class="error-container" v-if="error && !loading">
      <div class="error-box">
        <h1>❌ خطا در بارگذاری محصول</h1>
        <p>{{ error }}</p>
        <button @click="retryFetch" class="retry-btn">تلاش دوباره</button>
      </div>
    </div>

    <!-- نمایش محصول -->
    <div class="container" v-if="!loading && !error && data">
      <!-- عنوان و توضیح محصول -->
      <Product :data="data" class="title" />

      <!-- اطلاعات و تصاویر و فرم -->
      <div class="fields">
        <ProductImage :data="data" class="img" />
        <InputProduct
          :data="data"
          @add-to-cart="handleAddToCart"
          class="form" />
        <ProductRecip :data="data" class="recip" />
      </div>

      <!-- ویژگی‌های محصول -->
      <div
        class="feature-demo"
        v-if="data.attributes && Object.keys(data.attributes).length > 0">
        <span>ویژگی ها</span>
        <ProductFutureDemo :attributes="data.attributes" />
      </div>

      <!-- محصولات پیشنهادی -->
      <div class="recomend">
        <FullRecommend />
      </div>

      <!-- اطلاعات تفصیلی -->
      <div class="info" v-if="data.description">
        <InfoContainer :data="data" />
      </div>

      <!-- محصولات مشابه -->
      <div class="more-products">
        <h2>محصولات مشابه</h2>
        <FullRecommend />
      </div>
    </div>

    <!-- پیام اطلاع‌رسانی -->
    <div v-if="successMessage" class="success-notification">
      {{ successMessage }}
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import type { Product } from "~/types/product";
import { useProductById } from "~/composables/useGetProductByID";

const route = useRoute();
const successMessage = ref<string | null>(null);

// دریافت اطلاعات محصول
const { data, loading, error, fetchProduct } = useProductById(
  computed(() => route.params.id as string)
);

// تابع تلاش دوباره
const retryFetch = () => {
  fetchProduct();
};

// مدیریت اضافه کردن به سبد خریدیت
const handleAddToCart = async (item: any) => {
  try {
    const { $axios } = useNuxtApp();

    // ارسال درخواست اضافه کردن به سبد
    await $axios.post("/carts/items", {
      productId: route.params.id,
      quantity: item.quantity || 1,
      variantId: item.selectedVariant?.variantId,
      selectedVariant: item.selectedVariant,
    });

    successMessage.value = "✓ محصول به سبد خریدی افزوده شد";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (err: any) {
    console.error("خطا در افزودن به سبد خریدی:", err);
    successMessage.value =
      "❌ خطا: " + (err?.response?.data?.message || "نتوانست محصول اضافه شود");
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  }
};
</script>

<style scoped>
.loading {
  width: 90%;
  margin: 30px auto;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  margin: 30px 20px;
}

.error-box {
  background-color: #ffebee;
  border: 2px solid #f44336;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  max-width: 500px;
}

.error-box h1 {
  color: #c62828;
  font-family: "iran-yekan-DemiBold";
  margin: 0 0 15px 0;
  font-size: 22px;
}

.error-box p {
  color: #d32f2f;
  font-family: "iran-yekan-Light";
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.retry-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-family: "iran-yekan-DemiBold";
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #d32f2f;
}

.container {
  margin: auto;
  margin-top: 10px;
  width: 100%;
  padding: 0 20px;
}

.title {
  margin-bottom: 30px;
}

.fields {
  display: flex;
  width: 100%;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 40px;
}

.fields .img {
  flex: 1;
  min-width: 300px;
}

.fields .form {
  flex: 1;
  min-width: 300px;
}

.fields .recip {
  flex: 0 1 340px;
}

.feature-demo {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 40px auto;
  padding: 20px;
}

.feature-demo span {
  width: 100%;
  text-align: right;
  font-family: "iran-yekan-DemiBold";
  font-size: 20px;
  color: var(--blue-dark);
  margin-bottom: 20px;
}

.recomend {
  margin: 40px auto;
  width: 100%;
}

.info {
  margin: 40px auto;
  width: 100%;
}

.more-products {
  margin: 40px auto;
  width: 100%;
}

.more-products h2 {
  font-family: "iran-yekan-DemiBold";
  color: var(--blue-dark);
  font-size: 20px;
  text-align: right;
  margin-bottom: 20px;
}

.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 16px 24px;
  border-radius: 4px;
  font-family: "iran-yekan-DemiBold";
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
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

@media (max-width: 1024px) {
  .fields {
    flex-wrap: wrap;
    justify-content: center;
  }

  .fields .img,
  .fields .form,
  .fields .recip {
    flex: 1;
    min-width: 280px;
    max-width: 100%;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 0 10px;
  }

  .fields {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .fields * {
    margin-top: 15px;
    width: 100%;
  }

  .container * {
    margin: auto;
  }

  .feature-demo {
    width: 95%;
    margin: 20px auto;
  }

  .feature-demo span {
    font-size: 16px;
    margin-bottom: 15px;
  }

  .recomend {
    margin-top: 30px;
  }

  .info {
    height: auto;
    width: 100%;
  }

  .more-products {
    display: block;
    margin-top: 30px;
  }

  .error-box {
    padding: 20px;
  }

  .error-box h1 {
    font-size: 18px;
  }

  .error-box p {
    font-size: 13px;
  }
}
</style>
