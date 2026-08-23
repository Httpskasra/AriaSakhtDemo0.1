import { useApiClient } from '~/services/apiClient';
import type { Product } from '~/types/product';

export interface Favorite { id?: string; productId: string; product?: Product; createdAt?: string; }

export async function listFavorites(): Promise<Favorite[]> {
  const { data } = await useApiClient().get<Favorite[] | { items?: Favorite[] }>('/favorites');
  return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
}

export async function addFavorite(productId: string): Promise<Favorite> {
  const { data } = await useApiClient().post<Favorite>('/favorites', { productId });
  return data;
}

export async function removeFavorite(productId: string): Promise<void> {
  await useApiClient().delete(`/favorites/${encodeURIComponent(productId)}`);
}
