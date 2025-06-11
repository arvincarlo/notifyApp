import { useMemo, useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthSelectorProps {
  className?: string;
  selectedMonths?: string[];
  onSelect: (newParams: { selectedMonths: string[] }) => void;
  placeholder?: string;
}

type MonthOption = {
  label: string;
  value: string;
  year: number;
};

export function MonthSelector({
  className,
  selectedMonths = [],
  onSelect,
  placeholder = "Select month",
}: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRef1 = useRef<HTMLDivElement>(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months: MonthOption[] = useMemo(() => {
    const result: MonthOption[] = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = currentMonth - i;
      const yearOffset = Math.floor(monthIndex / 12);
      const adjustedMonth = ((monthIndex % 12) + 12) % 12;
      const year = currentYear + yearOffset;

      result.push({
        label: format(new Date(year, adjustedMonth), "MMMM"),
        value: format(new Date(year, adjustedMonth), "MMM"),
        year: year,
      });
    }
    return result;
  }, [currentMonth, currentYear]);

  const calculateVisibleTags = () => {
    if (!containerRef.current || selectedMonths.length === 0) {
      setVisibleTags([]);
      setHiddenCount(0);
      return;
    }

    const containerWidth = containerRef.current.offsetWidth - 60;
    let availableWidth = containerWidth;
    const visible: string[] = [];

    for (const monthYear of selectedMonths) {
      const tagWidth = 70;
      const [month] = monthYear.split(".");

      if (availableWidth - tagWidth - (visible.length > 0 ? 8 : 0) >= 0) {
        visible.push(month);
        availableWidth -= tagWidth + (visible.length > 0 ? 8 : 0);
      } else {
        break;
      }
    }

    setVisibleTags(visible);
    setHiddenCount(selectedMonths.length - visible.length);
  };

  useEffect(() => {
    calculateVisibleTags();
    window.addEventListener("resize", calculateVisibleTags);
    return () => window.removeEventListener("resize", calculateVisibleTags);
  }, [selectedMonths]);

  const handleMonthToggle = (month: MonthOption) => {
    const monthYearString = `${month.value}.${month.year}`;
    const newSelection = selectedMonths.includes(monthYearString)
      ? selectedMonths.filter((m) => m !== monthYearString)
      : [...selectedMonths, monthYearString];
    onSelect({ selectedMonths: newSelection });
  };

  const handleRemoveMonth = (monthToRemove: string) => {
    onSelect({
      selectedMonths: selectedMonths.filter((monthYear) => {
        const [month] = monthYear.split(".");
        return month !== monthToRemove;
      }),
    });
  };

  const monthsByYear = useMemo(() => {
    const grouped = months.reduce((acc, month) => {
      if (!acc[month.year]) {
        acc[month.year] = [];
      }
      acc[month.year].push(month);
      return acc;
    }, {} as Record<number, MonthOption[]>);

    return Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a));
  }, [months]);

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect({ selectedMonths: [] });
  };
  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef1.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTriggerWidth((entry.target as HTMLElement).offsetWidth);
      }
    });

    resizeObserver.observe(containerRef1.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn("relative flex-1", className)} ref={containerRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <div
              ref={containerRef1}
              className="w-full min-h-[40px] px-3  border rounded-md flex items-center flex-wrap gap-1"
            >
              {selectedMonths.length === 0 ? (
                <>
                  <span className="text-gray-500 text-sm">{placeholder}</span>
                </>
              ) : (
                visibleTags.map((month) => (
                  <span
                    key={month}
                    className="inline-flex items-center bg-red-50 text-red-800 rounded-full px-3 py-1 text-sm border border-red-800"
                  >
                    {month}
                    <button
                      className="ml-1 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMonth(month);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
              {hiddenCount > 0 && (
                <span className="inline-flex items-center bg-red-50 text-red-500 rounded-md px-2 py-0.5 text-sm">
                  +{hiddenCount}
                </span>
              )}
            </div>
            {selectedMonths.length > 0 && (
              <button
                onClick={handleClearAll}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          style={{ width: `${triggerWidth}px` }}
          align="start"
        >
          <div>
            <div className="max-h-[300px] overflow-y-auto">
              {monthsByYear.map(([year, yearMonths]) => (
                <div key={year} className="p-2">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {year}
                  </div>
                  <div>
                    {yearMonths.map((month) => {
                      const monthYearString = `${month.value}.${month.year}`;
                      const isChecked =
                        selectedMonths.includes(monthYearString);

                      return (
                        <label
                          key={month.value}
                          className={cn(
                            "flex items-center space-x-2 cursor-pointer p-2 rounded -mx-2",
                            isChecked ? "bg-red-50" : "hover:bg-gray-50"
                          )}
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              className="peer h-4 w-4 opacity-0 absolute"
                              checked={isChecked}
                              onChange={() => handleMonthToggle(month)}
                            />
                            <div
                              className={cn(
                                "h-4 w-4 border rounded flex items-center justify-center",
                                isChecked
                                  ? "bg-red-500 border-red"
                                  : "border-gray-300",
                                "peer-hover:border-red-500"
                              )}
                            >
                              {isChecked && (
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-sm select-none">
                            {month.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
