// src/utils/storage.ts

interface StorageData {
  value: string;
  expires?: number;
}

export const StorageUtil = {
  get: (key: string): string | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      if (typeof item === "string") return item;
      const data: StorageData = JSON.parse(item);
      if (data.expires && Date.now() > data.expires) {
        StorageUtil.remove(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  set: (key: string, value: string, expiresInSeconds?: number) => {
    try {
      const data: StorageData = {
        value,
        expires: expiresInSeconds
          ? Date.now() + expiresInSeconds * 1000
          : undefined,
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  },
  isExpired: (key: string): boolean => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return true;

      const data: StorageData = JSON.parse(item);
      return !!(data.expires && Date.now() > data.expires);
    } catch (error) {
      console.error("Storage expiry check error:", error);
      return true;
    }
  },
  getExpiry: (key: string): Date | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const data: StorageData = JSON.parse(item);
      return data.expires ? new Date(data.expires) : null;
    } catch (error) {
      console.error("Get storage expiry error:", error);
      return null;
    }
  },
};
