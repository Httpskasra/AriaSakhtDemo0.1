# Advanced Search Implementation - راهنمای پیاده‌سازی

## خلاصه تغییرات

تمام کامپوننت‌ها و صفحات برای پیاده‌سازی Advanced Search دقیق با Swagger تغییر
یافته‌اند:

### ✅ فایل‌های تغییر یافته:

#### 1. **`pages/products/index.vue`**

- استفاده از composable `useProductSearch` برای کاهش کد تکراری
- مدیریت صحیح query string برای تمام فیلترها
- تکامل صحیح advanced-search API

#### 2. **`components/products/main/FilterSidebar.vue`**

- دریافت دسته‌بندی‌ها از `/api/categories`
- دریافت برندها (companies) از `/api/companies`
- استفاده از checkboxes برای چند انتخاب دسته‌بندی
- emit کردن فیلترهای صحیح: `maxPrice`, `companyName`, `categoryIds`

#### 3. **`components/products/main/SortFilter.vue`**

- مقادیر sort طبق Swagger:
  - `basePrice:asc` (قیمت صعودی)
  - `basePrice:desc` (قیمت نزولی)
  - `createdAt:desc` (جدیدترین)
  - `rating:desc` (پرتشویق)

#### 4. **`components/SearchBarProduct.vue`**

- جستجو با query string صحیح
- اضافه کردن `limit: 12` به query برای consistency

#### 5. **`services/productService.ts`**

- تابع `advancedSearchProducts` برای فراخوانی `/api/products/advanced-search`
- serialization صحیح برای آرایه categoryIds

#### 6. **`composables/useProductSearch.ts` (جدید)**

- composable برای استفاده مجدد در تمام جاهای نیاز
- مدیریت centralized query string
- توابع: `buildParams()`, `updateQueryString()`, `onFiltersFromSidebar()`,
  `onSortChange()`, `changePage()`

---

## نحوه استفاده

### صفحه products

```vue
<script setup>
import { useProductSearch } from "~/composables/useProductSearch";

const { page, sortOption, onFiltersFromSidebar, onSortChange, changePage } =
  useProductSearch();
</script>
```

### FilterSidebar

```vue
<FilterSidebar
  @apply-filters="
    (filters) => {
      onFiltersFromSidebar(filters);
    }
  " />
```

FilterSidebar emit می‌کند:

```typescript
{
  maxPrice?: number,
  companyName?: string,
  categoryIds?: string[]
}
```

---

## Query String Format

```
/products?query=text&maxPrice=500000&companyName=برند&categoryIds=id1&categoryIds=id2&sort=basePrice:desc&page=1&limit=12
```

---

## API Endpoints (Swagger)

- **GET** `/api/products/advanced-search` - جستجوی پیشرفته
  - Parameters: `query`, `maxPrice`, `companyName`, `categoryIds[]`, `sort`,
    `page`, `limit`
- **GET** `/api/categories` - دریافت دسته‌بندی‌ها
- **GET** `/api/companies` - دریافت برندها

---

## خطاهای معمول و حل‌ها

### ❌ categoryIds به عنوان آرایه ارسال نمی‌شود

✅ حل: استفاده از `paramsSerializer: { indexes: false }` در axios

### ❌ فیلترها reset نمی‌شوند

✅ حل: اطمینان از اینکه تمام فیلترها در `updateQueryString` مدیریت شده‌اند

### ❌ دسته‌بندی‌ها یا برندها بارگذاری نمی‌شوند

✅ حل: بررسی اینکه API endpoints صحیح هستند و response format درست است

---

## Next Steps

1. ✅ تست تمام فیلترها
2. ✅ تست جستجو
3. ✅ تست مرتب‌سازی
4. ✅ تست صفحه‌بندی
5. ✅ بررسی error handling
