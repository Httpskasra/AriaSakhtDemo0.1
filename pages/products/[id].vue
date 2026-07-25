<template>
  <NuxtLayout name="default">
    <div class="loading" v-if="loading">
      <SkeletonLoaderProduct />
    </div>

    <div class="error-container" v-if="error && !loading">
      <div class="error-box">
        <h1>❌ خطا در بارگذاری محصول</h1>
        <p>{{ error }}</p>
        <button @click="retryFetch" class="retry-btn">تلاش دوباره</button>
      </div>
    </div>

    <div class="container" v-if="!loading && !error && data">
      <div class="title mb-6">
        <h1 class="text-2xl font-bold text-[var(--color-text-heading)]">{{ data.name }}</h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">شناسه کالا: {{ data.sku }}</p>
      </div>
      <div class="fields">
        <ProductImage :data="data" class="img" />
        <InputProduct :data="data" @add-to-cart="handleAddToCart" class="form" />
        <ProductRecip :data="data" class="recip" />
      </div>

      <div class="feature-demo" v-if="data.attributes && Object.keys(data.attributes).length > 0">
        <span>ویژگی ها</span>
        <ProductFutureDemo :attributes="data.attributes" />
      </div>

      <div class="info" v-if="data.description">
        <InfoContainer :data="data" />
      </div>

      <div class="more-products">
        <h2>محصولات مشابه</h2>
        <RelatedProducts />
      </div>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useProductById } from "~/composables/useGetProductByID";
import { useAddToCart } from "~/composables/useAddToCart";
import RelatedProducts from "~/components/products/info/RelatedProducts.vue";

const route = useRoute();
const toast = useToast();
const { addProductToCart } = useAddToCart();

const { data, loading, error, fetchProduct } = await useProductById(
  computed(() => route.params.id as string)
);

const runtimeConfig = useRuntimeConfig();
const siteUrl = String(runtimeConfig.public.siteUrl || "https://tejaris.ir").replace(/\/$/, "");
const productUrl = computed(() => `${siteUrl}/products/${encodeURIComponent(String(route.params.id))}`);
const productImage = computed(() => {
  const image = data.value?.images?.[0]?.url;
  if (!image) return `${siteUrl}/logo/logo.png`;
  return image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
});
const productPrice = computed(() => Number(data.value?.finalPrice ?? data.value?.basePrice ?? 0));
const productAvailability = computed(() =>
  data.value?.status === "active" && Number(data.value?.stock?.quantity ?? 0) > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock",
);
const companyName = computed(() =>
  typeof data.value?.companyId === "object" ? data.value.companyId.name : "تجاریس",
);

useSeoMeta({
  title: () => data.value?.name || 'جزئیات محصول',
  description: () => data.value?.description?.slice(0, 160) || 'مشاهده جزئیات محصول',
  ogTitle: () => data.value?.name || 'جزئیات محصول',
  ogDescription: () => data.value?.description?.slice(0, 160) || 'مشاهده جزئیات محصول',
  ogImage: () => productImage.value,
  ogUrl: () => productUrl.value,
  ogType: "product",
});

useHead(() => ({
  link: [{ rel: "canonical", href: productUrl.value }],
  meta: [
    { property: "product:price:amount", content: String(productPrice.value) },
    { property: "product:price:currency", content: data.value?.currency || "IRR" },
    { property: "product:availability", content: productAvailability.value },
  ],
  script: [{
    key: "product-structured-data",
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: data.value?.name || "محصول",
          description: data.value?.description || "",
          image: [productImage.value],
          sku: data.value?.sku,
          brand: { "@type": "Brand", name: companyName.value },
          offers: {
            "@type": "Offer",
            url: productUrl.value,
            priceCurrency: data.value?.currency || "IRR",
            price: productPrice.value,
            availability: productAvailability.value,
            itemCondition: "https://schema.org/NewCondition",
          },
        },
        {
          "@type": "Organization",
          name: "تجاریس",
          url: siteUrl,
          logo: `${siteUrl}/logo/logo.png`,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "خانه", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "محصولات", item: `${siteUrl}/products` },
            { "@type": "ListItem", position: 3, name: data.value?.name || "محصول", item: productUrl.value },
          ],
        },
      ],
    }),
  }],
}));

const retryFetch = () => fetchProduct();

const handleAddToCart = async (item: any) => {
  try {
    const companyId = typeof data.value?.companyId === 'string'
      ? data.value.companyId
      : data.value?.companyId?._id;

    await addProductToCart({
      productId: String(route.params.id),
      quantity: item.quantity || 1,
      priceAtAdd: item.priceAtAdd || data.value?.basePrice || 0,
      companyId: String(item.companyId || companyId),
      variant: item.variant,
    });
    toast.add({ title: "محصول به سبد خرید اضافه شد", color: "success" });
  } catch (err) {
    console.error("خطا در افزودن به سبد خریدی:", err);
  }
};
</script>
