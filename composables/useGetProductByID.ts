import { ref, onMounted, watch } from "vue";
import type { Product } from "~/types/product";
import { getProductById } from "~/services/productService";

export function useProductById(id: string) {
  const data = ref<Product | null>(null); // داده محصول
  const loading = ref(true); // وضعیت بارگذاری
  const error = ref<string | null>(null); // پیام خطا

  const fetchProduct = async () => {
    if (!id) {
      error.value = "شناسه محصول یافت نشد";
      loading.value = false;
      return;
    }

    loading.value = true; // شروع بارگذاری
    error.value = null; // پاک کردن خطاهای قبلی
    try {
      const response = await getProductById(id); // فراخوانی سرویس
      data.value = response.data; // ذخیره داده محصول
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || "خطایی رخ داده است."; // مدیریت خطا
      data.value = null;
    } finally {
      loading.value = false; // پایان بارگذاری
    }
  };

  // فراخوانی خودکار هنگام بارگذاری کامپوننت
  onMounted(() => {
    fetchProduct();
  });

  // به‌روزرسانی خودکار هنگام تغییر id
  watch(
    () => id,
    () => {
      fetchProduct();
    }
  );

  return { data, loading, error, fetchProduct };
}
