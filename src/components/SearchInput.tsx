import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Loader2, SearchIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wealthService } from "@/services/wealthService";
import { SearchBarState } from "./SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "use-debounce";
import { useSearchAccount } from "@/hooks/useSearchAccounts";

type SearchItem = {
  unitTrustsValue: string;
  structuredProductsValue: string;
  equitiesValue: string;
  fixedIncomeValue: string;
  moneyMarketValue: string;
  rmAssigned: any;
  middleName: any;
  customerName: string | undefined;
  id: string;
  name: string;
  cif: string;
  dateCovered?: string;
};

type SearchInputProps = {
  value: string;
  onChange: (newParams: Partial<SearchBarState>) => void;
  onFocus?: () => void;
};

type SearchType = "cif" | "fullname";

const SearchInput = ({ value, onChange, onFocus }: SearchInputProps) => {
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>("cif");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticatedMSAL, msalTokenReady } = useAuth();
  const [debouncedValue] = useDebounce(value, 500);
  const shouldSearch = useRef(true);
  const [displayLimit, setDisplayLimit] = useState(10);
  const { errorInput, setErrorInput } = useSearchAccount();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!dropdownRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;

    const scrolledToBottom = scrollHeight - scrollTop <= clientHeight + 1;

    if (scrolledToBottom && displayLimit < filteredItems.length) {
      setDisplayLimit((prev) => prev + 10);
    }
  };

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.addEventListener("scroll", handleScroll);
      return () => dropdown.removeEventListener("scroll", handleScroll);
    }
  }, [filteredItems.length]); //

  // Reset display limit when search changes
  useEffect(() => {
    setDisplayLimit(10);
  }, [debouncedValue, searchType]);

  const fetchSearchResults = async (searchValue: string) => {
    if (!searchValue.trim() || searchValue.length < 3 || !shouldSearch.current)
      return;

    setIsLoading(true);
    try {
      let data;
      if (searchType === "cif") {
        data = await wealthService.getWealthCustomerByCif(searchValue);
      } else {
        data = await wealthService.getWealthCustomerByName(searchValue);
      }
      const allCustomers = await wealthService.getWealthAllCustoms();
      const customers = Array.isArray(data) ? data : [data];
      console.log("customers", customers);
      const formattedCustomers = customers.map((item: any) => {
        const matchingCustomer = allCustomers.find(
          (customer: any) => customer.cifNumber === item.cifNumber
        );
        console.log("matchingCustomer", matchingCustomer);
        return {
          id: item.id,
          name: item.customerName,
          cif: item.cifNumber,
          dateCovered: item.dateCovered,
          customerName: item.customerName,
          middleName: matchingCustomer?.middleName || "",
          rmAssigned: item?.rmAssigned || "",
          moneyMarketValue: item?.moneyMarketValue || "",
          fixedIncomeValue: item?.fixedIncomeValue || "",
          equitiesValue: item?.equitiesValue || "",
          structuredProductsValue: item?.structuredProductsValue || "",
          unitTrustsValue: item?.unitTrustsValue || "",
        };
      });

      setFilteredItems([...formattedCustomers]);
      setShowDropdown(true);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldSearch.current && debouncedValue.length > 2) {
      fetchSearchResults(debouncedValue);
    } else if (debouncedValue.length < 2) {
      setFilteredItems([]);
      setShowDropdown(false);
    }
  }, [debouncedValue, searchType, isAuthenticatedMSAL, msalTokenReady]);

  const handleSearch = (searchValue: string) => {
    shouldSearch.current = true;
    if (searchType === "cif") {
      const firstChar = searchValue.charAt(0).replace(/[^a-zA-Z]/g, "");
      const restChars = searchValue.slice(1).replace(/\D/g, "");
      const sanitizedValue = (firstChar + restChars).slice(0, 9);
      onChange({ clientName: sanitizedValue });
    } else {
      console.log("searchValue", searchValue);
      if (!/^[a-zA-Z\s]*$/.test(searchValue)) {
        return;
      }
      onChange({ clientName: searchValue });
    }

    if (searchValue.trim() === "") {
      setFilteredItems([]);
      setShowDropdown(false);
    }
  };

  const validateCifInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (searchType === "cif") {
      // if (!/^\d*$/.test(input)) {
      //   return;
      // }

      if (input.length > 9) {
        return;
      }
    }

    handleSearch(input);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPlaceholder = () => {
    return searchType === "cif" ? "Enter CIF" : "Enter client fullname";
  };

  return (
    <div
      className={`relative search-container flex-1 ${
        errorInput && errorInput.length > 0 ? "mb-8" : ""
      }`}
    >
      <div className="relative flex gap-2">
        <Select
          value={searchType}
          onValueChange={(value: SearchType) => {
            setErrorInput("");
            setSearchType(value);
            onChange({ clientName: "" });
            setShowDropdown(false);
            setFilteredItems([]);
            shouldSearch.current = true;
          }}
        >
          <SelectTrigger className="w-[180px] focus-visible:ring-red-500 h-10 bg-[#F3F4F6]">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="cif"
              className="data-[state=checked]:text-red-500"
            >
              Search by CIF
            </SelectItem>
            <SelectItem
              value="fullname"
              className="data-[state=checked]:text-red-500"
            >
              Search by Fullname
            </SelectItem>
          </SelectContent>
        </Select>
        {errorInput && errorInput?.length > 0 && (
          <div className="absolute mt-12   text-red-500 text-sm flex items-center whitespace-nowrap ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorInput}
          </div>
        )}

        <div className="flex-1 relative">
          <Input
            type="text"
            value={value}
            onChange={validateCifInput}
            onFocus={onFocus}
            placeholder={getPlaceholder()}
            inputMode={searchType === "cif" ? "numeric" : "text"}
            pattern={searchType === "cif" ? "[0-9]*" : undefined}
            className={`pl-10 pr-10 focus-visible:ring-red-500 w-full ${
              searchType === "cif" && value.length > 0 && value.length < 9
                ? "border-yellow-500"
                : ""
            }`}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4">
            {isLoading ? (
              <Loader2 className="w-full h-full text-gray-500 animate-spin" />
            ) : (
              <SearchIcon className="w-full h-full text-gray-500" />
            )}
          </div>
          {value && (
            <button
              onClick={() => {
                onChange({
                  clientName: "",
                  cif: "",
                  customerName: "",
                  dateCovered: "",
                  middleName: "",
                  unitTrustsValue: "",
                  structuredProductsValue: "",
                  equitiesValue: "",
                  fixedIncomeValue: "",
                  moneyMarketValue: "",
                });
                setErrorInput("");
                setShowDropdown(false);
                setFilteredItems([]);
                shouldSearch.current = true;
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {showDropdown && value.trim() !== "" && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Search Results
            </div>
            <div ref={dropdownRef} className="max-h-[500px] overflow-y-auto">
              {filteredItems.slice(0, displayLimit).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => {
                    shouldSearch.current = false;
                    onChange({
                      id: item.id,
                      clientName: searchType === "cif" ? item.cif : item.name,
                      selectedMonths: [
                        `${
                          item.dateCovered
                            ? `${new Date(item.dateCovered).toLocaleString(
                                "en",
                                {
                                  month: "short",
                                }
                              )}.${new Date(item.dateCovered).getFullYear()}`
                            : ""
                        }`,
                      ],
                      cif: item.cif,
                      dateCovered: item.dateCovered,
                      customerName: item.customerName,
                      middleName: item.middleName,
                      rmAssigned: item.rmAssigned,
                      moneyMarketValue: item?.moneyMarketValue || "",
                      fixedIncomeValue: item?.fixedIncomeValue || "",
                      equitiesValue: item?.equitiesValue || "",
                      structuredProductsValue:
                        item?.structuredProductsValue || "",
                      unitTrustsValue: item?.unitTrustsValue || "",
                    });
                    setShowDropdown(false);
                    setFilteredItems([]);
                  }}
                >
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-900">
                      <HighlightText
                        text={item.name}
                        highlight={searchType === "fullname" ? value : ""}
                      />
                    </div>
                    <div className="text-xs text-gray-900">
                      <HighlightText
                        text={item.cif}
                        highlight={searchType === "cif" ? value : ""}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-sm text-gray-500 p-2">
                  No results found
                </div>
              )}
              {displayLimit < filteredItems.length && (
                <div className="text-center p-2 text-sm text-gray-500 flex items-center justify-center">
                  Loading
                  <span className="ml-1 inline-flex">
                    <span className="animate-[bounce_1s_infinite] delay-0">
                      .
                    </span>
                    <span className="animate-[bounce_1s_infinite] delay-150">
                      .
                    </span>
                    <span className="animate-[bounce_1s_infinite] delay-300">
                      .
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="text-red-600">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default SearchInput;
