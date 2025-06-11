import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import ActivityHistoryItem from "./ActivityHistoryItem";
import { useActivityHistory } from "@/hooks/useActivityHistory";
import LoadingSpinner from "./LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ActivityHistory = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    filterClientName,
    loading,
    filteredActivities,
    handleScroll,
    handleHistoryBack,
    customerNames,
    handleFilterChange,
  } = useActivityHistory(open);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 rounded-l-2xl">
        <SheetHeader className="p-6 bg-red-500 text-white rounded-tl-2xl relative">
          <SheetTitle className="text-white text-xl font-normal">
            Activity History
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-2 text-white h-8 w-8 hover:bg-transparent hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="px-6 pt-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Customer</span>
            <Select
              value={filterClientName || "All"}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="border-none px-0 h-auto hover:bg-transparent focus:ring-0">
                <SelectValue>
                  <span className="text-red-500">
                    {filterClientName || "All Recently viewed customer"}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="All Recently viewed customer"
                  className="data-[state=checked]:text-red-500"
                >
                  <span>All Recently viewed customer</span>
                </SelectItem>
                {customerNames.map((name) => (
                  <SelectItem
                    key={name}
                    value={name}
                    className="data-[state=checked]:text-red-500"
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 140px)" }}
          onScroll={handleScroll}
        >
          {Object.entries(filteredActivities).map(([section, items]) => (
            <div key={section} className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                {section}
              </h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <ActivityHistoryItem
                    key={`${section}-${index}`}
                    {...item}
                    onClick={() => {
                      handleHistoryBack(item);
                      onClose();
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {loading && <LoadingSpinner />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActivityHistory;
