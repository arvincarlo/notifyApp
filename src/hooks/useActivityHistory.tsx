import { useState, useMemo, useEffect } from "react";
import { useSearchAccount } from "@/hooks/useSearchAccounts";
import { format, subDays, isWithinInterval, startOfMonth, set } from "date-fns";
import { wealthService } from "@/services/wealthService";
import { isDateInSelectedMonths, lowerUsername } from "@/lib/utils";
import { useAuth } from "./useAuth";
import { checkAccessMapAuthorization } from "@/context/SearchContext";

type ApiActivityItem = {
  monthsSelected: string | undefined;
  id: number;
  userId: string;
  cifNumber: string;
  customerName: string;
  dateCovered: string;
  accountsSelected: string;
};

export type ActivityHistoryItem = {
  dateCovered: string | undefined;
  name: string;
  cif: string;
  selectedMonth: string;
  selectedAccounts?: string;
  monthsSelected?: string;
};

export interface ActivityItem extends ActivityHistoryItem {
  onClick: (item: ActivityHistoryItem) => void;
}

const ITEMS_PER_PAGE = 10;

const categorizeActivities = (activities: ApiActivityItem[]) => {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);
  const currentMonth = format(now, "MMMM").toUpperCase();

  const result: { [key: string]: ActivityHistoryItem[] } = {
    "PREVIOUS 7 DAYS": [],
    "PREVIOUS 30 DAYS": [],
    [currentMonth]: [],
  };

  [...activities].reverse().forEach((activity) => {
    console.log("activity", activity);
    const activityDate = new Date(activity.dateCovered);
    const formattedMonth = format(activityDate, "MMMM yyyy");
    const historyItem: ActivityHistoryItem = {
      name: activity.customerName,
      cif: `${activity.cifNumber}`,
      selectedMonth: formattedMonth,
      selectedAccounts: activity.accountsSelected,
      monthsSelected: activity.monthsSelected,
      dateCovered: activity.dateCovered,
    };

    // Check if activity is within last 7 days
    if (isWithinInterval(activityDate, { start: sevenDaysAgo, end: now })) {
      result["PREVIOUS 7 DAYS"].push(historyItem);
    }
    // Check if activity is within last 30 days
    else if (
      isWithinInterval(activityDate, { start: thirtyDaysAgo, end: now })
    ) {
      result["PREVIOUS 30 DAYS"].push(historyItem);
    }
    // Check if activity is in current month
    else if (
      isWithinInterval(activityDate, {
        start: startOfMonth(now),
        end: now,
      })
    ) {
      result[currentMonth].push(historyItem);
    }
  });

  // Remove empty categories
  Object.keys(result).forEach((key) => {
    if (result[key].length === 0) {
      delete result[key];
    }
  });

  return result;
};

export const useActivityHistory = (open: boolean) => {
  const { updateSearchParams, setSearchResults, initialAccountSections } =
    useSearchAccount();
  const [filterClientName, setFilterClientName] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<{
    [key: string]: ActivityHistoryItem[];
  }>({});

  useEffect(() => {
    const fetchActivityHistory = async () => {
      try {
        setLoading(true);

        const data: ApiActivityItem[] =
          await wealthService.getActivityHistory();

        const categorizedActivities = categorizeActivities(data);
        setActivities(categorizedActivities);
      } catch (error) {
        console.error("Failed to fetch activity history:", error);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchActivityHistory();
    }
  }, [open]);

  // Get unique customer names
  const customerNames = useMemo(() => {
    const names = new Set<string>();
    Object.values(activities).forEach((items) => {
      items.forEach((item) => names.add(item.name));
    });
    return Array.from(names);
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const result: typeof activities = {};

    Object.entries(activities).forEach(([section, items]) => {
      let filtered = items;
      if (
        filterClientName &&
        filterClientName !== "All Recently viewed customer"
      ) {
        filtered = items.filter((item) => item.name === filterClientName);
      }
      if (filtered.length > 0) {
        result[section] = filtered.slice(0, page * ITEMS_PER_PAGE);
      }
    });

    return result;
  }, [activities, filterClientName, page]);

  const hasMore = useMemo(() => {
    return Object.entries(activities).some(([, items]) => {
      const filtered =
        filterClientName && filterClientName !== "All Recently viewed customer"
          ? items.filter((item) => item.name === filterClientName)
          : items;
      return filtered.length > page * ITEMS_PER_PAGE;
    });
  }, [activities, filterClientName, page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50 && !loading && hasMore) {
      setLoading(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoading(false);
      }, 500);
    }
  };

  const handleHistoryBack = async (item: ActivityHistoryItem) => {
    console.log("item", item);
    console.log("initialAccountSections", initialAccountSections);
    console.log("user", user);
    const [fcbAccounts, trustPortfolioAccounts] = await Promise.all([
      wealthService.getFcbAccounts(),
      wealthService.getTrustPortfolioAccounts(),
    ]);
    const allCustomers = await wealthService.getWealthAllCustoms();

    const fcbAccountsFiltered = fcbAccounts.filter((account) => {
      const currentUsername = user!.name
        .toLocaleLowerCase()
        ?.replace(/\s+/g, "");
      const accountRm = account.rmAssigned
        .toLocaleLowerCase()
        ?.replace(/\s+/g, "");
      return (
        account.cifNumber === item.cif &&
        item.monthsSelected &&
        isDateInSelectedMonths(
          account.dateCovered,
          item.monthsSelected.split(",")
        ) &&
        (accountRm === currentUsername ||
          checkAccessMapAuthorization(currentUsername, accountRm))
      );
    });
    console.log("fcbAccountsFiltered", fcbAccountsFiltered);
    const filteredSections = initialAccountSections.map((section) => {
      const portfolioMap = {
        branch: "FCBS",
        trust: "Trust",
        treasury: "Treasury",
        securities: "Securities",
      };

      const portfolio = portfolioMap[section.id];

      if (portfolio) {
        return {
          ...section,
          accounts: fcbAccountsFiltered
            .filter((account) => account.portfolio === portfolio)
            .map((account: any) => ({
              ...account,
              accountNumber: account.referenceNumber,
              relationship: account.relationship,
              isChecked: undefined,
            })),
        };
      }

      return section;
    });

    const accountStrings = item.selectedAccounts?.split(",") || [];
    console.log("accountStrings", accountStrings);
    const filteredSections1 = JSON.parse(JSON.stringify(filteredSections));
    accountStrings.forEach((accountString) => {
      const [accountNumber, accountName] = accountString.trim().split(".");

      filteredSections1.forEach((group) => {
        group.accounts = group.accounts.map((account) => {
          if (
            account.referenceNumber === accountNumber &&
            account.accountName === accountName
          ) {
            return {
              ...account,
              accountNumber: account.referenceNumber,
              referenceNumber: account.referenceNumber,
              isChecked: true,
            };
          }
          return account;
        });
      });
    });
    console.log("filteredSections1", filteredSections1);
    setSearchResults(filteredSections1);
    const matchingCustomer = allCustomers.find(
      (customer: any) => customer.cifNumber === item.cif
    );
    console.log("matchingCustomer", matchingCustomer);
    updateSearchParams({
      cif: item.cif,
      clientName: item.cif,
      selectedMonths: item.monthsSelected?.split(",") || [],
      customerName: item.name,
      dateCovered: item.dateCovered,
      middleName: matchingCustomer?.middleName || "",
      unitTrustsValue: matchingCustomer?.unitTrustsValue || "",
      structuredProductsValue: matchingCustomer?.structuredProductsValue || "",
      equitiesValue: matchingCustomer?.equitiesValue || "",
      fixedIncomeValue: matchingCustomer?.fixedIncomeValue || "",
      moneyMarketValue: matchingCustomer?.moneyMarketValue || "",
    });
    return item;
  };

  const handleFilterChange = (value: string) => {
    setFilterClientName(value);
    setPage(1);
  };

  const clearFilter = () => setFilterClientName("");

  return {
    filterClientName,
    loading,
    hasMore,
    filteredActivities,
    handleScroll,
    handleHistoryBack,
    clearFilter,
    customerNames,
    handleFilterChange,
  };
};
