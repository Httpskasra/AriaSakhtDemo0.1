// services/categories.ts
export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  status?: string;
  companyId?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const { $axios } = useNuxtApp();
  const res = await $axios.get("/categories");
  return Array.isArray(res.data) ? res.data : (res.data?.items || []);
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
