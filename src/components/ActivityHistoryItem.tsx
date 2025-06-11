import { ActivityItem } from "@/hooks/useActivityHistory";

const ActivityHistoryItem = ({
  name,
  cif,
  onClick,
  monthsSelected,
  selectedMonth,
}: ActivityItem) => {
  return (
    <div
      className="h-[55px] p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
      onClick={() =>
        onClick({
          name,
          cif,
          selectedMonth,
          dateCovered: undefined,
        })
      }
    >
      <div className="flex justify-between items-start h-full">
        <div className="flex flex-col justify-center space-y-[2px]">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-gray-900 leading-tight">
              {name}
            </span>
            <span className="text-[13px] text-gray-500 leading-tight">
              {cif}
            </span>
          </div>
          <p className="text-[13px] text-gray-500 leading-tight">
            {monthsSelected?.split(".").join(" ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryItem;
