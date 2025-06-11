import { useMemo } from "react";
import { Button } from "./ui/button";
import SearchInput from "./SearchInput";
import { MonthSelector } from "./MonthSelector";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchAccount } from "@/hooks/useSearchAccounts";
export type SearchBarState = {
  rmAssigned: string | undefined;
  dateRange?: any;
  clientName: string;
  // dateRange: DateRange | undefined;
  selectedMonths: string[];
  id?: string;
  cif?: string;
  dateCovered: string;
  customerName?: string;
  middleName?: string;
  unitTrustsValue?: string;
  structuredProductsValue?: string;
  equitiesValue?: string;
  fixedIncomeValue?: string;
  moneyMarketValue?: string;
};
const SearchBar = () => {
  const { searchParams, updateSearchParams, handleSearch } = useSearchAccount();

  const isButtonActive = useMemo(() => {
    return searchParams.clientName && searchParams.selectedMonths.length > 0;
  }, [searchParams]);
  // const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  return (
    <div>
      <div className="text-xl font-semibold">
        Portfolio Performance Statement Generator
      </div>
      <div className="mt-6 flex gap-4">
        <SearchInput
          value={searchParams.clientName}
          onChange={updateSearchParams}
        />
        <MonthSelector
          selectedMonths={searchParams.selectedMonths}
          onSelect={updateSearchParams}
        />
        <Button
          onClick={handleSearch}
          variant="secondary"
          className={cn(
            "whitespace-nowrap rounded-[50px]",
            isButtonActive && "bg-[#FF4647] hover:bg-[#FF4647]/90 text-white"
          )}
          disabled={!isButtonActive}
        >
          <Search />
          Display Accounts
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
