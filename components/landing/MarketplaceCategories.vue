<template>
  <section aria-labelledby="marketplace-categories-heading" class="marketplace-categories">
    <LandingSectionHeader
      id="marketplace-categories-heading"
      title="دسته‌بندی‌های صنعتی"
      subtitle="دسترسی سریع به کالاهای ساختمانی و تجهیزات فنی"
    >
      <template #action>
        <UButton to="/products" variant="outline" color="primary" trailing-icon="i-lucide-arrow-left" label="مشاهده همه دسته‌ها" />
      </template>
    </LandingSectionHeader>

    <div v-if="loading" class="marketplace-categories__grid">
      <div v-for="index in 6" :key="index" class="category-skeleton">
        <USkeleton class="mx-auto h-4 w-3/4" />
      </div>
    </div>
    <div v-else-if="error" class="category-feedback panel-surface">
      <UIcon name="i-lucide-circle-alert" class="size-icon-inline text-red-600" aria-hidden="true" />
      <p>دریافت دسته‌بندی‌ها ناموفق بود.</p>
      <UButton type="button" size="sm" variant="outline" color="neutral" @click="retryCategories">تلاش مجدد</UButton>
    </div>
    <div v-else-if="!categories.length" class="category-feedback panel-surface">
      <UIcon name="i-lucide-folders" class="size-icon-inline text-slate-500" aria-hidden="true" />
      <p>هنوز دسته‌بندی‌ای تعریف نشده است.</p>
    </div>
    <div v-else class="marketplace-categories__grid">
      <NuxtLink
        v-for="card in categories"
        :key="categoryId(card.category)"
        :to="categoryPath(card.category)"
        class="category-card group"
      >
        <NuxtImg
          v-if="!failedImages.has(card.key)"
          :src="card.image"
          alt=""
          aria-hidden="true"
          class="category-card__image"
          loading="lazy"
          decoding="async"
          sizes="sm:50vw md:33vw lg:25vw xl:17vw"
          format="webp"
          quality="75"
          @error="markImageFailed(card.key)"
        />
        <span class="category-card__scrim" aria-hidden="true"></span>
        <div class="category-card__content">
          <h3>{{ card.category.name }}</h3>
          <span v-if="categoryCount(card.category)" class="font-num">{{ categoryCount(card.category) }} کالا</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useCategories } from "~/composables/useCategories";
import { getCategoryFilterIds, getCategoryId, getParentCategoryId, type Category } from "~/services/categories";

type CategoryImageKey = "solid" | "powder" | "liquid" | "composite" | "prefabricated" | "innovative";

type CategoryImageDefinition = {
  key: CategoryImageKey;
  image: string;
  slugAliases: string[];
  nameAliases: string[];
};

type CategoryCard = {
  category: Category;
  key: CategoryImageKey;
  image: string;
};

const normalizePersian = (value: string | undefined): string => (value || "")
  .normalize("NFKC")
  .replace(/ي/g, "ی")
  .replace(/ك/g, "ک")
  .replace(/[\u200c\u200d]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const categoryImageDefinitions: CategoryImageDefinition[] = [
  {
    key: "solid",
    image: "/categories/solid.png",
    slugAliases: ["مصالح جامد (سخت)"],
    nameAliases: ["مصالح جامد (سخت)"],
  },
  {
    key: "powder",
    image: "/categories/powder.png",
    slugAliases: ["مصالح پودری"],
    nameAliases: ["مصالح پودری"],
  },
  {
    key: "liquid",
    image: "/categories/liquid.png",
    slugAliases: ["مصالح مایع"],
    nameAliases: ["مصالح مایع"],
  },
  {
    key: "composite",
    image: "/categories/composite.png",
    slugAliases: ["مصالح مرکب"],
    nameAliases: ["مصالح مرکب"],
  },
  {
    key: "prefabricated",
    image: "/categories/prefabricated.png",
    slugAliases: ["مصالح پیش ساخته", "مصالح پیش‌ساخته"],
    nameAliases: ["مصالح پیش ساخته", "مصالح پیش‌ساخته"],
  },
  {
    key: "innovative",
    image: "/categories/innovative.png",
    slugAliases: ["مصالح نوین"],
    nameAliases: ["مصالح نوین"],
  },
];

const categoryImageOrder: CategoryImageKey[] = categoryImageDefinitions.map(({ key }) => key);
const normalizedImageDefinitions = categoryImageDefinitions.map((definition) => ({
  ...definition,
  normalizedSlugAliases: definition.slugAliases.map(normalizePersian),
  normalizedNameAliases: definition.nameAliases.map(normalizePersian),
}));

const resolveCategoryImageDefinition = (category: Category) => {
  const normalizedSlug = normalizePersian(category.slug);
  const slugMatch = normalizedImageDefinitions.find((definition) => definition.normalizedSlugAliases.includes(normalizedSlug));
  if (slugMatch) return slugMatch;

  const normalizedName = normalizePersian(category.name);
  return normalizedImageDefinitions.find((definition) => definition.normalizedNameAliases.includes(normalizedName));
};

const isActiveCategory = (category: Category): boolean => {
  if (typeof category.status !== "string" || !category.status.trim()) return true;
  return category.status.trim().toLowerCase() === "active";
};

const { categories: loadedCategories, loading, error, load } = useCategories();
const retryCategories = () => { void load().catch(() => undefined); };
await retryCategories();

const categories = computed<CategoryCard[]>(() => {
  const matchedCategories = new Map<CategoryImageKey, Category>();

  loadedCategories.value
    .filter((category) => !getParentCategoryId(category) && isActiveCategory(category))
    .forEach((category) => {
      const definition = resolveCategoryImageDefinition(category);
      if (definition && !matchedCategories.has(definition.key)) {
        matchedCategories.set(definition.key, category);
      }
    });

  return categoryImageOrder.flatMap((key) => {
    const category = matchedCategories.get(key);
    const definition = normalizedImageDefinitions.find((candidate) => candidate.key === key);
    return category && definition ? [{ category, key, image: definition.image }] : [];
  });
});

const failedImages = ref(new Set<CategoryImageKey>());
const markImageFailed = (key: CategoryImageKey) => {
  failedImages.value = new Set(failedImages.value).add(key);
  if (import.meta.dev) {
    console.warn(`[MarketplaceCategories] Failed to load category image: ${key}`);
  }
};

watch([loadedCategories, loading], ([availableCategories, isLoading]) => {
  if (isLoading || !availableCategories.length || !import.meta.dev) return;
  const matchedKeys = new Set(categories.value.map(({ key }) => key));
  const missingKeys = categoryImageOrder.filter((key) => !matchedKeys.has(key));
  if (missingKeys.length) {
    console.warn(`[MarketplaceCategories] Missing intended active root categories: ${missingKeys.join(", ")}`);
  }
});

const categoryId = (category: Category) => getCategoryId(category);
const categoryPath = (category: Category) => ({
  path: "/products",
  query: { categoryIds: getCategoryFilterIds(category, loadedCategories.value) },
});
const categoryCount = (category: Category) => {
  const count = (category as Category & { productCount?: number; productsCount?: number }).productCount
    ?? (category as Category & { productCount?: number; productsCount?: number }).productsCount;
  return typeof count === "number" ? String(count) : "";
};
</script>

<style scoped>
.marketplace-categories__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:var(--landing-grid-gap); }
.category-card { position:relative; display:grid; min-height:6.75rem; place-items:center; overflow:hidden; isolation:isolate; padding:.8rem .7rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-text-heading); box-shadow:var(--shadow-raised); color:var(--color-bg-surface); text-align:center; transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.category-card:hover { border-color:var(--color-info-border); box-shadow:var(--shadow-raised); transform:translateY(-2px); }
.category-card:focus-visible { outline:3px solid color-mix(in srgb, var(--color-brand-blue) 25%, transparent); outline-offset:2px; }
.category-card__image, .category-card__scrim { position:absolute; inset:0; width:100%; height:100%; }
.category-card__image { z-index:0; object-fit:cover; object-position:center center; }
.category-card__scrim { z-index:1; background:color-mix(in srgb, var(--color-text-heading) 56%, transparent); pointer-events:none; }
.category-card__content { position:relative; z-index:2; display:grid; min-width:0; max-width:100%; gap:.2rem; place-items:center; }
.category-card h3 { margin:0; color:var(--color-bg-surface); font-size:.82rem; font-weight:var(--font-weight-extrabold); line-height:var(--line-height-section); }
.category-card span { color:color-mix(in srgb, var(--color-bg-surface) 82%, transparent); font-size:.67rem; }
.category-skeleton { display:grid; min-height:7.75rem; place-items:center; padding:.85rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); box-shadow:var(--shadow-raised); }
.category-feedback {
  display: flex;
  min-height: 9rem;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  padding: 1.5rem;
  color: var(--color-text-body);
  font-size: .875rem;
}

@media (min-width: 768px) {
  .marketplace-categories__grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
}

@media (min-width: 1024px) and (max-width: 1199px) {
  .marketplace-categories__grid { grid-template-columns:repeat(4,minmax(0,1fr)); }
}

@media (min-width: 1200px) {
  .marketplace-categories__grid { grid-template-columns:repeat(6,minmax(0,1fr)); }
}

@media (max-width: 639px) {
  .marketplace-categories__grid { gap:1rem; }
}
</style>
