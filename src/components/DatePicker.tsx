import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker, CaptionProps } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  isFilterEffectDate?: boolean;
  isFilterValiDate?: boolean;
  date?: Date;
  onDateChange?: (date?: Date) => void;
  className?: string;
  // open: boolean;
  // setCalendarOpen: any;
  isEdit?: boolean;
  isFilter: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  className,
  isEdit,
  isFilterEffectDate = false,
  isFilterValiDate = false,
  isFilter = false,
}: DatePickerProps) {
  const [isMonthSelector, setIsMonthSelector] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [currentYear, setCurrentYear] = React.useState(
    date?.getFullYear() || new Date().getFullYear()
  );
  const [defaultMonth, setDefaultMonth] = React.useState(date || new Date());

  const today = React.useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const disabledDays = React.useCallback(
    (day: Date) => {
      // if (isEdit) return false;
      return day < today && !isFilter;
    },
    [today, isFilter]
  );
  const months = [
    ["Jan", "Feb", "Mar", "Apr"],
    ["May", "Jun", "Jul", "Aug"],
    ["Sep", "Oct", "Nov", "Dec"],
  ];

  const handleYearChange = (increment: number) => {
    const newYear = currentYear + increment;
    if (newYear < today.getFullYear() && !isFilter) return;

    const now = new Date();
    const newDate = new Date(newYear, defaultMonth.getMonth(), 1);

    if (
      newYear === now.getFullYear() &&
      defaultMonth.getMonth() === now.getMonth()
    ) {
      newDate.setDate(now.getDate());
    }

    setCurrentYear(newYear);
    setDefaultMonth(newDate);
  };
  const handleMonthSelect = (monthIndex: number) => {
    if (isMonthDisabled(monthIndex)) return;

    const now = new Date();
    const newDate = new Date(currentYear, monthIndex, 1);

    if (currentYear === now.getFullYear() && monthIndex === now.getMonth()) {
      newDate.setDate(now.getDate());
    }

    setDefaultMonth(newDate);
    setIsMonthSelector(false);
    setOpen(false);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };
  const isMonthDisabled = (monthIndex: number) => {
    if (currentYear === today.getFullYear()) {
      return monthIndex < today.getMonth() && !isFilter;
    }
    return false;
  };

  const CustomCaption = ({ displayMonth }: CaptionProps) => {
    return (
      <div
        className="flex justify-center pt-1 relative items-center text-sm font-medium cursor-pointer"
        onClick={() => setIsMonthSelector(true)}
      >
        {format(displayMonth, "MMMM yyyy")}
      </div>
    );
  };

  const MonthSelector = () => (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleYearChange(-1)}
          className={cn(
            "p-2",
            currentYear <= today.getFullYear() &&
              "opacity-50 cursor-not-allowed" &&
              !isFilter
          )}
          disabled={currentYear <= today.getFullYear() && !isFilter}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{currentYear}</span>
        <button onClick={() => handleYearChange(1)} className="p-2">
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {months.flat().map((month, index) => (
          <Button
            key={month}
            variant="ghost"
            className={cn(
              "h-9 rounded-full",
              date && date.getMonth() === index && "bg-red-500 text-white",
              isMonthDisabled(index) && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleMonthSelect(index)}
            disabled={isMonthDisabled(index)}
          >
            {month}
          </Button>
        ))}
      </div>
      <div className="flex justify-between mt-4 border-t pt-4">
        <Button
          variant="ghost"
          className="text-red-500"
          onClick={() => {
            if (onDateChange) onDateChange(undefined);
            setIsMonthSelector(false);
          }}
        >
          Clear
        </Button>
        <Button
          variant="ghost"
          className="text-red-500"
          onClick={() => {
            const today = new Date();
            setDefaultMonth(today);
            setCurrentYear(today.getFullYear());
            if (onDateChange) onDateChange(today);
            setIsMonthSelector(false);
          }}
        >
          This month
        </Button>
      </div>
    </div>
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    if (onDateChange) {
      onDateChange(newDate);
    }
    setOpen(false);
  };

  const Calendar = () => (
    <DayPicker
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      defaultMonth={defaultMonth}
      disabled={disabledDays}
      showOutsideDays={true}
      className="p-3"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-gray-100",
        day_selected: "bg-red-500 text-white hover:bg-red-500 hover:text-white",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
        Caption: CustomCaption,
      }}
    />
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-[40px] flex items-center justify-between border border-gray-200 px-4 py-2 hover:bg-transparent hover:border-gray-300",
            className
          )}
        >
          <span
            className={cn(
              "text-base font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date
              ? format(date, "MMM, yyyy")
              : isFilter
              ? `Select ${isFilterValiDate ? "Valid Until" : ""}  ${
                  isFilterEffectDate ? "effective" : ""
                }  date`
              : "Select a date"}
          </span>
          <CalendarIcon className="h-5 w-5 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl">
        {isMonthSelector ? <MonthSelector /> : <Calendar />}
      </PopoverContent>
    </Popover>
  );
}
