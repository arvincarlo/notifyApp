import { createContext, useState, ReactNode, useEffect } from "react";
import { AccountSection } from "../services/searchAccountsApi";
import { SearchBarState } from "@/components/SearchBar";
import { wealthService } from "@/services/wealthService";
import { isDateInSelectedMonths, lowerUsername } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SearchContextType {
  searchParams: SearchBarState;
  updateSearchParams: (newParams: Partial<SearchBarState>) => void;
  searchResults: AccountSection[];
  loading: boolean;
  error: string | null;
  handleSearch: () => Promise<void>;
  resetSearch: () => void;
  setSearchResults: (results: AccountSection[]) => void;
  initialAccountSections: AccountSection[];
  errorInput: string | null;
  setErrorInput: (error: string | null) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

const accessMap: { [key: string]: string[] } = {
  clusterheada: ["testuser", "testuserb"],
  clusterheadb: ["testuserc", "testuserd"],
};
export const checkAccessMapAuthorization = (
  username: string,
  rmAssigned: string
) => {
  console.log("username", username);
  console.log("rmAssigned", rmAssigned);
  return accessMap[username]?.includes(rmAssigned);
};

export function SearchAccountProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<SearchBarState>;
}) {
  const [searchResults, setSearchResults] = useState<AccountSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorInput, setErrorInput] = useState<string | null>(null);
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useState<SearchBarState>({
    clientName: initialState?.clientName || "",
    selectedMonths: initialState?.selectedMonths || [],
    cif: initialState?.cif || "",
    dateCovered: initialState?.dateCovered || "",
    customerName: initialState?.customerName || "",
    rmAssigned: initialState?.rmAssigned || "",
  });

  const handleSearch = async () => {
    console.log("searchParams", searchParams);
    console.log("user", user);
    const initialAccountSections: AccountSection[] = [
      {
        id: "branch",
        title: "Branch Linked Accounts",
        accounts: [
          {
            id: "1",
            accountNumber: "SA 119091412",
            accountName: "Bessie Cooper PH",
            isChecked: undefined,
          },
          {
            id: "2",
            accountNumber: "SA 119091412",
            accountName: "Bessie Cooper PH",
            isChecked: undefined,
          },
          {
            id: "3",
            accountNumber: "PSA 119091412",
            accountName: "Bessie Cooper PH",
            isChecked: undefined,
          },
          {
            id: "4",
            accountNumber: "PSA 119091412",
            accountName: "Bessie Cooper PH",
            isChecked: undefined,
          },
        ],
      },
      {
        id: "treasury",
        title: "Treasury Linked Accounts",
        accounts: [],
      },
      {
        id: "trust",
        title: "Trust Linked Accounts",
        accounts: [],
      },
      {
        id: "securities",
        title: "Chinabank Securities",
        accounts: [],
      },
    ];
    try {
      setLoading(true);
      setError(null);

      const isAuthorized =
        user &&
        (lowerUsername(user?.name) === searchParams?.rmAssigned ||
          checkAccessMapAuthorization(
            lowerUsername(user?.name),
            searchParams?.rmAssigned
          ));

      setErrorInput(
        isAuthorized
          ? null
          : "You are not authorized to view the customer records"
      );
      if (isAuthorized) {
        const [fcbAccounts, trustPortfolioAccounts] = await Promise.all([
          wealthService.getFcbAccounts(),
          wealthService.getTrustPortfolioAccounts(),
        ]);
        console.log("fcbAccounts", fcbAccounts);
        console.log("trustPortfolioAccounts", trustPortfolioAccounts);

        const fcbAccountsFiltered = fcbAccounts.filter((account) => {
          const currentUsername = user?.name
            .toLocaleLowerCase()
            ?.replace(/\s+/g, "");
          const accountRm = account.rmAssigned
            .toLocaleLowerCase()
            ?.replace(/\s+/g, "");
          return (
            account.cifNumber === searchParams.cif &&
            isDateInSelectedMonths(
              account.dateCovered,
              searchParams.selectedMonths
            ) &&
            (accountRm === currentUsername ||
              checkAccessMapAuthorization(currentUsername, accountRm))
          );
        });

        console.log("fcbAccountsFiltered", fcbAccountsFiltered);

        const nonWealth = fcbAccountsFiltered.every((account) => {
          return account.isWealth === false;
        });
        console.log("nonWealth", nonWealth);
        if (fcbAccountsFiltered.length === 0) {
          setErrorInput("No records found.");
        } else {
          if (!nonWealth) {
            setSearchResults(
              initialAccountSections.map((section) => {
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
              })
            );
          } else {
            setErrorInput(
              "The selected CIF/Customer has no associated Wealth products"
            );
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchParams = (newParams: Partial<SearchBarState>) => {
    setSearchParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  useEffect(() => {
    if (
      (searchParams.cif === "" && searchParams.clientName === "") ||
      searchParams.selectedMonths.length === 0
    ) {
      setSearchResults([]);
    }
  }, [searchParams]);

  const resetSearch = () => {
    setSearchParams({
      clientName: "",
      selectedMonths: [],
      dateCovered: "",
      rmAssigned: "",
    });
    setSearchResults([]);
    setError(null);
  };

  return (
    <SearchContext.Provider
      value={{
        setErrorInput,
        errorInput,
        searchParams,
        updateSearchParams,
        searchResults,
        setSearchResults,
        loading,
        error,
        handleSearch,
        resetSearch,
        initialAccountSections: [
          {
            id: "branch",
            title: "Branch Linked Accounts",
            accounts: [],
          },
          {
            id: "treasury",
            title: "Treasury Linked Accounts",
            accounts: [],
          },
          {
            id: "trust",
            title: "Trust Linked Accounts",
            accounts: [],
          },
          {
            id: "securities",
            title: "Chinabank Securities",
            accounts: [],
          },
        ],
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
