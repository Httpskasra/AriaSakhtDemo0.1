// services/categories.ts
export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | { _id?: string; id?: string } | null;
  status?: string;
  companyId?: string;
}

export const getCategoryId = (category: Category): string =>
  String(category._id || category.id || category.slug || category.name);

export const getParentCategoryId = (category: Category): string | null => {
  if (!category.parentId) return null;
  if (typeof category.parentId === "string") return category.parentId;
  return category.parentId._id || category.parentId.id || null;
};

export const getCategoryFilterIds = (category: Category, all: Category[]): string[] => {
  const selected = new Set<string>([getCategoryId(category)]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const candidate of all) {
      const parentId = getParentCategoryId(candidate);
      if (parentId && selected.has(parentId)) {
        const id = getCategoryId(candidate);
        if (!selected.has(id)) {
          selected.add(id);
          changed = true;
        }
      }
    }
  }

  return [...selected];
};

export async function fetchCategories(): Promise<Category[]> {
  const { $axios } = useNuxtApp();
  const res = await $axios.get("/categories");
  const categories = Array.isArray(res.data) ? res.data : res.data?.items;
  if (!Array.isArray(categories)) {
    throw new Error("ساختار پاسخ دسته‌بندی‌ها نامعتبر است.");
  }
  return categories;
}

export async function createCategory(payload: Partial<Category>): Promise<Category> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post("/categories", payload);
  return data;
}

export async function updateCategory(id: string, payload: Partial<Category>): Promise<Category> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/categories/${id}`);
}
