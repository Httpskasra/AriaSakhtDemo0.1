// services/ratingService.ts

export type RatingStatus = "pending" | "approved" | "rejected";

export interface CreateRatingDto {
  productId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
}

export interface UpdateRatingDto {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface Rating {
  _id?: string;
  id?: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  status?: RatingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface RatingResponse {
  average: number;
  count: number;
  ratings: Rating[];
}

// ==== API calls ====

/**
 * ایجاد نقد و بررسی جدید
 */
export async function createRating(body: CreateRatingDto): Promise<Rating> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.post("/ratings", body);
    return data;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      throw new Error("لطفا وارد سایت شوید");
    }
    throw err;
  }
}

/**
 * دریافت تمام نقد و بررسی‌های محصول
 */
export async function getRatingsByProduct(
  productId: string,
  params?: { page?: number; limit?: number }
): Promise<Rating[]> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(`/ratings/product/${productId}`, {
    params,
  });
  return data;
}

/**
 * دریافت نقد و بررسی کاربر برای محصول
 */
export async function getUserProductRating(
  productId: string,
  userId: string
): Promise<Rating | null> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.get(
      `/ratings/product/${productId}/user/${userId}`
    );
    return data || null;
  } catch (err) {
    return null;
  }
}

/**
 * به‌روزرسانی نقد و بررسی
 */
export async function updateRating(
  productId: string,
  body: UpdateRatingDto
): Promise<Rating> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.patch(`/ratings/product/${productId}`, body);
    return data;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      throw new Error("لطفا وارد سایت شوید");
    }
    throw err;
  }
}

/**
 * حذف نقد و بررسی
 */
export async function deleteRating(productId: string): Promise<void> {
  const { $axios } = useNuxtApp();
  try {
    await $axios.delete(`/ratings/product/${productId}`);
  } catch (err: any) {
    if (err?.response?.status === 401) {
      throw new Error("لطفا وارد سایت شوید");
    }
    throw err;
  }
}

/**
 * دریافت میانگین امتیاز محصول
 */
export async function getAverageRating(productId: string): Promise<number> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.get(`/ratings/product/${productId}/average`);
    return data.average || 0;
  } catch (err) {
    return 0;
  }
}

/**
 * دریافت تعداد نقد و بررسی‌های محصول
 */
export async function getRatingCount(productId: string): Promise<number> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.get(`/ratings/product/${productId}/count`);
    return data.count || 0;
  } catch (err) {
    return 0;
  }
}
