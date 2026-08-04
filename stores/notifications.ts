import { defineStore } from 'pinia';

export interface AppNotification { id: string; title: string; message?: string; read: boolean; createdAt: string; }

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<AppNotification[]>([]);
  const unreadCount = computed(() => notifications.value.filter(item => !item.read).length);
  function setNotifications(next: AppNotification[]): void { notifications.value = next; }
  function clear(): void { notifications.value = []; }
  return { notifications, unreadCount, setNotifications, clear };
});
