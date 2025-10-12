// src/api/categories.ts
const { $axios } = useNuxtApp(); // اگر مسیر شما متفاوت است، آن را تغییر دهید

export interface Category {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  status?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await $axios.get("/categories");
  const payload = res.data;

  // ممکن است API مستقیم آرایه بدهد یا { data: [...] }
  if (Array.isArray(payload)) return payload as Category[];
  if (payload && Array.isArray(payload.data)) return payload.data as Category[];
  // دیفالت: خالی
  return [];
}
