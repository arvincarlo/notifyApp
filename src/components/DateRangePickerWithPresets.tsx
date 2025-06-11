import React, { useMemo } from "react";
import { addDays, differenceInDays, format } from "date-fns";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";

interface DateRangePickerProps {
  className?: string;
  date?: DateRange;
  onSelect: (date: DateRange) => void;
}

export function DateRangePickerWithPresets({
  className,
  date,
  onSelect,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const presets = [
    {
      label: "Today",
      value: {
        from: new Date(),
        to: new Date(),
      },
    },
    {
      label: "This Week",
      value: {
        from: addDays(new Date(), -new Date().getDay()),
        to: addDays(new Date(), 6 - new Date().getDay()),
      },
    },
    {
      label: "This Month",
      value: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    },
    {
      label: "This Quarter",
      value: {
        from: new Date(
          new Date().getFullYear(),
          Math.floor(new Date().getMonth() / 3) * 3,
          1
        ),
        to: new Date(
          new Date().getFullYear(),
          Math.floor(new Date().getMonth() / 3) * 3 + 3,
          0
        ),
      },
    },
    {
      label: "This Year",
      value: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
      },
    },
    {
      label: "Yesterday",
      value: {
        from: addDays(new Date(), -1),
        to: addDays(new Date(), -1),
      },
    },
    {
      label: "Previous Week",
      value: {
        from: addDays(new Date(), -7 - new Date().getDay()),
        to: addDays(new Date(), -1 - new Date().getDay()),
      },
    },
    {
      label: "Previous Month",
      value: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
    {
      label: "Previous Quarter",
      value: {
        from: new Date(
          new Date().getFullYear(),
          Math.floor(new Date().getMonth() / 3) * 3 - 3,
          1
        ),
        to: new Date(
          new Date().getFullYear(),
          Math.floor(new Date().getMonth() / 3) * 3,
          0
        ),
      },
    },
    {
      label: "Previous Year",
      value: {
        from: new Date(new Date().getFullYear() - 1, 0, 1),
        to: new Date(new Date().getFullYear() - 1, 11, 31),
      },
    },
  ];

  // const isWarnAble = useMemo(() => {
  //   return date?.from && date?.to && differenceInDays(date.to, date.from) > 90;
  // }, [date]);

  const handleCancel = () => {
    onSelect({
      from: new Date(),
      to: new Date(),
    });
    setOpen(false);
  };

  // 处理确认按钮点击
  const handleOkay = () => {
    setOpen(false);
  };

  return (
    <div className={cn("relative flex-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              placeholder="Select Period"
              value={
                date?.from
                  ? `${format(date.from, "LLL dd, y")} - ${
                      date.to ? format(date.to, "LLL dd, y") : ""
                    }`
                  : ""
              }
              className="w-full pr-10 focus-visible:ring-red-500"
              readOnly
            />
            <CalendarIcon className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[680px] max-w-[calc(100vw-2rem)] p-0"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <div className="flex">
            <div className="border-r border-gray-200 p-2 space-y-1 bg-white w-[140px]">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className={cn(
                    "justify-start text-left font-normal w-full", // 移除默认的 hover 和文字颜色
                    "text-gray-600 hover:bg-gray-100", // 添加默认状态的样式
                    date?.from &&
                      date?.to &&
                      date.from.getTime() === preset.value.from.getTime() &&
                      date.to.getTime() === preset.value.to.getTime()
                      ? "bg-red-50 text-red-500 hover:bg-red-50" // 选中状态的样式
                      : "hover:text-red-500" // 未选中状态的悬停样式
                  )}
                  onClick={() => onSelect(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="p-2 bg-white w-[520px]">
              {/* {isWarnAble && (
                <div className="mb-3 p-2 bg-red-50 rounded-lg flex flex-col">
                  <div className="flex gap-1">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    Invalid Selection
                  </div>
                  <p className="text-sm text-red-800">
                    You can only select dates within the past 90 days. Please
                    adjust your date range
                  </p>
                </div>
              )} */}
              <Calendar
                mode="range"
                defaultMonth={new Date()}
                selected={date}
                onSelect={(range) => {
                  if (range) {
                    onSelect(range);
                  }
                }}
                numberOfMonths={2}
                className="gap-8"
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-transparent"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-500 text-white hover:bg-red-600 rounded-full px-8"
                  onClick={handleOkay}
                >
                  Okay
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
