import { ref, onMounted } from "vue";
import type { Product } from "~/types/product";
import { getProductById } from "~/services/productService";
import { set } from "@nuxt/ui/runtime/utils/index.js";

export function useProductById(id: string) {
  const data = ref<Product | null>(null); // داده محصول
  const loading = ref(true); // وضعیت بارگذاری
  const error = ref<string | null>(null); // پیام خطا

  const fetchProduct = async () => {
    loading.value = true; // شروع بارگذاری
    error.value = null; // پاک کردن خطاهای قبلی
    try {
      const response = await getProductById(id); // فراخوانی سرویس
      data.value = response.data; // ذخیره داده محصول
    } catch (err: any) {
      error.value = err.message || "خطایی رخ داده است."; // مدیریت خطا
    } finally {
      loading.value = false; // پایان بارگذاری
    }
  };

  // فراخوانی خودکار هنگام بارگذاری کامپوننت
  onMounted(() => {
    setTimeout(() => {
      fetchProduct();
    }, 3000);
  });

  return { data, loading, error, fetchProduct };
}
