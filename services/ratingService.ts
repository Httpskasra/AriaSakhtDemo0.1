// services/ratingService.ts

export type RatingStatus = "pending" | "approved" | "rejected";

export interface CreateRatingDto {
  productId: string;
  rating: number; // 1-5
  comment: string;
}

export interface UpdateRatingDto {
  rating?: number;
  comment?: string;
}

export interface Rating {
  _id?: string;
  id?: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  status?: RatingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface RatingsPage {
  items: Rating[];
  total: number;
  page: number;
  limit: number;
}

/**
 * API calls for Ratings
 * F4: Local 401 handling removed as it is handled by the global Axios interceptor.
 */

export async function createRating(body: CreateRatingDto): Promise<Rating> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post("/ratings", body);
  return data;
}

export async function getRatingsByProduct(
  productId: string,
  params?: { page?: number; limit?: number }
): Promise<RatingsPage> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(`/ratings/product/${productId}`, {
    params,
  });
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: params?.page || 1, limit: params?.limit || data.length || 1 };
  }
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: Number(data?.total || 0),
    page: Number(data?.page || params?.page || 1),
    limit: Number(data?.limit || params?.limit || 5),
  };
}

export async function getUserProductRating(
  productId: string,
  userId: string
): Promise<Rating | null> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(
    `/ratings/product/${productId}/user/${userId}`
  );
  return data || null;
}

export async function updateRating(
  productId: string,
  body: UpdateRatingDto
): Promise<Rating> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/ratings/product/${productId}`, body);
  return data;
}

export async function deleteRating(productId: string): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/ratings/product/${productId}`);
}

export async function getAverageRating(productId: string): Promise<number> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.get(`/ratings/product/${productId}/average`);
    return data.average || 0;
  } catch {
    return 0;
  }
}

export async function getRatingCount(productId: string): Promise<number> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.get(`/ratings/product/${productId}/count`);
    return data.count || 0;
  } catch {
    return 0;
  }
}
