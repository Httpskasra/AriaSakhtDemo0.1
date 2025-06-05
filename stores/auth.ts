import { defineStore } from "pinia";
import { useCookie } from "#app";
export const useAuthStore = defineStore("auth", () => {
  const accessToken = useCookie<string | null>("access_token");
  const refreshToken = useCookie<string | null>("refresh_token");

  // Set tokens
  const setTokens = (
    newAccessToken: string | null,
    newRefreshToken: string | null
  ) => {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
  };

  // Get access token
  const getAccessToken = () => accessToken.value;

  // Get refresh token
  const getRefreshToken = () => refreshToken.value;

  // Clear tokens
  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
  };

  return {
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
  };
});
