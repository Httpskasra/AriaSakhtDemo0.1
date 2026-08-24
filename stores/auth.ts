import { defineStore } from "pinia";
import { useState } from "#app";
import { useCartStore } from '~/stores/cart';
import { useWalletStore } from '~/stores/wallet';
import { useNotificationsStore } from '~/stores/notifications';
import { useFavoritesStore } from '~/stores/favorites';
import { useAuthStep } from '~/composables/useAuthStep';

export const useAuthStore = defineStore("auth", () => {
  // Access and CSRF tokens are request/session state, not persistent cookies.
  // The refresh token is intentionally never exposed to this store: the backend
  // owns it in an HttpOnly cookie.
  const accessToken = useState<string | null>("auth:access-token", () => null);
  const csrfToken = useState<string | null>("auth:csrf-token", () => null);
  const sessionCleared = useState<boolean>("auth:session-cleared", () => false);

  // F2: Cross-tab synchronization using BroadcastChannel
  let syncChannel: BroadcastChannel | null = null;
  if (process.client) {
    syncChannel = new BroadcastChannel("auth_sync");
    syncChannel.onmessage = (event) => {
      if (event.data === "logout") {
        // Sync logout across tabs
        accessToken.value = null;
        csrfToken.value = null;
        window.location.reload();
      }
    };
  }

  const setTokens = (
    newAccessToken: string | null,
    newCsrfToken: string | null = null
  ) => {
    accessToken.value = newAccessToken;
    csrfToken.value = newCsrfToken;
    sessionCleared.value = false;
  };

  const getAccessToken = () => accessToken.value;
  const getCsrfToken = () => csrfToken.value;
  const setCsrfToken = (token: string | null) => {
    csrfToken.value = token;
  };

  const clearTokens = () => {
    // Auth-flow state can contain the national ID and OTP phone number even
    // when token state was already cleared by another tab/interceptor.
    useAuthStep().setStep(null);
    if (sessionCleared.value && !accessToken.value && !csrfToken.value) return;
    accessToken.value = null;
    csrfToken.value = null;
    sessionCleared.value = true;
    useCartStore().clear();
    useWalletStore().clear();
    useNotificationsStore().clear();
    useFavoritesStore().clear();
    // Notify other tabs
    if (process.client && syncChannel) {
      syncChannel.postMessage("logout");
    }
  };

  return {
    setTokens,
    getAccessToken,
    getCsrfToken,
    setCsrfToken,
    clearTokens,
  };
});
