import { wealthService } from "@/services/wealthService";
import { clsx, type ClassValue } from "clsx";
import { endOfDay, format, isWithinInterval, parse, parseISO, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { StorageUtil } from "./storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateRange = (range: DateRange) => {
  if (!range.from || !range.to) return "";
  return `${format(range.from, "yyyy-MMM-dd")} to ${format(
    range.to,
    "yyyy-MMM-dd"
  )}`;
};

const MONTH_MAP = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
} as const;

export const isDateInSelectedMonths = (
  dateString: string,
  selectedMonths: string[]
) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 1-12
  const monthYear = `${date.toLocaleString("en", {
    month: "short",
  })}.${date.getFullYear()}`;

  return selectedMonths.some((selected) => {
    const [selectedMonth] = selected.split(".");
    return (
      selected === monthYear &&
      MONTH_MAP[selectedMonth as keyof typeof MONTH_MAP] === month
    );
  });
};

export const generatePwd = (dateStr: string) => {
  const date = new Date(dateStr);
  const monthStr = String(date.getMonth() + 1).padStart(2, "0");
  const yearStr = String(date.getFullYear()).slice(-2);
  const result = `${monthStr}${yearStr}`;
  return result;
};

export const lowerUsername = (name: string) => {
  return name.toLocaleLowerCase()?.replace(/\s+/g, "");
};

export const formatMoney = (amount: string | number | undefined): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (num === undefined || isNaN(num)) {
    return `0.00`;
  }

  return `${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const generatePercentage = (num: number, total: number) => {
  return ((num / total) * 100).toFixed(2);
};

export const isWithinDateRange = (
  lastModified: string,
  dateRange: DateRange
): boolean => {
  if (!dateRange.from || !dateRange.to) {
    return false;
  }

  try {
    const date = parseISO(lastModified);
    const modifiedDate = format(date, "dd MMM yyyy HH:mm");
    console.log("modifiedDate", modifiedDate);
    return isWithinInterval(modifiedDate, {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to),
    });
  } catch (error) {
    console.error("Date parsing error:", error);
    return false;
  }
};

export const isCurrentDate = (dateRange: DateRange): boolean => {
  if (!dateRange) return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!dateRange.from || !dateRange.to) return false;

  const from = new Date(
    dateRange.from.getFullYear(),
    dateRange.from.getMonth(),
    dateRange.from.getDate()
  );
  const to = new Date(
    dateRange.to.getFullYear(),
    dateRange.to.getMonth(),
    dateRange.to.getDate()
  );

  return from.getTime() === today.getTime() && to.getTime() === today.getTime();
};

export const convertToISOString = (dateString: string) => {
  const parsedDate = parse(dateString, "dd MMM yyyy", new Date());
  const utcDate = new Date(parsedDate.toUTCString());
  const utcIsoString = utcDate.toISOString();
  return utcIsoString;
};

export function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

export const createLogs = async (id, user: any, actionType = "Create") => {
  const logs = await wealthService.getAllLogs();
  const disclosures = await wealthService.getAllDisclosures();

  const logBody = {
    id: logs.length === 0 ? 0 : logs.length + 1,
    disclosureId:
      disclosures.length === 0
        ? "0"
        : `${disclosures[disclosures.length - 1]?.id}`,
    user: user?.name,
    userId: user?.id,
    activityType: "Discalimer&Notices",
    actionType,
    timeStamp: new Date().toISOString(),
  };

  await wealthService.createLogs(logBody);
};

export const createLogsForParameter = async (
  user: any,
  actionType = "Create"
) => {
  const logs = await wealthService.getAllLogs();

  const logBody = {
    id: logs.length === 0 ? 0 : logs.length + 1,
    disclosureId: null,
    user: user?.name,
    userId: user?.id,
    activityType: "Parameter Maintenance",
    actionType,
    timeStamp: new Date().toISOString(),
  };

  return await wealthService.createLogs(logBody);
};

export const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: format(date, "dd MMM yyyy"),
    time: format(date, "HH:mm"),
  };
};

export function formatDateForAuditLog(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateRange(effectDate, ranges, validUntil) {
  return ranges.every((range) => {
    return (
      new Date(range) >= new Date(effectDate) &&
      new Date(range) <= new Date(validUntil)
    );
  });
}

export const clearAllSiteData = async () => {
  try {
    localStorage.clear();

    sessionStorage.clear();

    const cookies = document.cookie.split(";");
    const domain = window.location.hostname;

    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`;
    });

    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }

    const databases = await window.indexedDB.databases();
    databases.forEach((db) => {
      if (db.name) {
        window.indexedDB.deleteDatabase(db.name);
      }
    });

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister())
      );
    }
  } catch (error) {
    console.error("Error clearing site data:", error);
    throw error;
  }
};

export const getRole = () => {
  if (StorageUtil.get("user") !== null) {
    const token = JSON.parse(StorageUtil.get("user")!)
    return token.roles[0]
  }
  return null;
}

export const toastSuccess = (message: string) => {
  return toast.success(message, {
    position: "top-right",
    style: { background: "#4CAF50", color: "#fff" }
  });
}

export const toastError = (message: string) => {
  return toast.error(message, {
    position: "top-right",
    style: { background: "#f44336", color: "#fff" }
  });
}