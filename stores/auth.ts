import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", () => {
  // Use reactive cookies shared across the app
  // Fixed: access_token maxAge reduced to 3600s (1 hour) to match backend JWT expiry
  const accessToken = useCookie<string | null>("access_token", {
    path: "/",
    sameSite: "lax",
    maxAge: 3600, 
  });
  
  const refreshToken = useCookie<string | null>("refresh_token", {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days matches refresh session intent
  });

  // F2: Cross-tab synchronization using BroadcastChannel
  let syncChannel: BroadcastChannel | null = null;
  if (process.client) {
    syncChannel = new BroadcastChannel("auth_sync");
    syncChannel.onmessage = (event) => {
      if (event.data === "logout") {
        // Sync logout across tabs
        accessToken.value = null;
        refreshToken.value = null;
        window.location.reload();
      }
    };
  }

  const setTokens = (
    newAccessToken: string | null,
    newRefreshToken: string | null
  ) => {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
  };

  const getAccessToken = () => accessToken.value;
  const getRefreshToken = () => refreshToken.value;

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
    // Notify other tabs
    if (process.client && syncChannel) {
      syncChannel.postMessage("logout");
    }
  };

  return {
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
  };
});
