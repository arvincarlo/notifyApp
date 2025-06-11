import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";
import { formatDateForAuditLog, formatDateTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { wealthService } from "@/services/wealthService";
import { Disclaimer } from "./columns";

const AuditLogHistory = ({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: any;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [disclosureDetail, setDisClosureDetail] = useState<Disclaimer>();
  const date = useMemo(() => {
    return item ? formatDateTime(item.timeStamp) : { date: "", time: "" };
  }, [item]);
  const fetchDisClosureById = async (disclosureId: string) => {
    const data = await wealthService.getAllDisclosureById(disclosureId);
    setDisClosureDetail(data);
  };
  useEffect(() => {
    if (item?.disclosureId) {
      fetchDisClosureById(item?.disclosureId);
    }
  }, [item]);
  console.log("disclosureDetail", disclosureDetail);
  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        onClose();
        setDisClosureDetail(undefined);
      }}
    >
      <SheetContent className="w-[400px] sm:w-[540px] p-0 rounded-l-2xl">
        <SheetHeader className="p-6 bg-red-500 text-white rounded-tl-2xl relative">
          <SheetTitle className="text-white text-xl font-normal">
            {item && item?.activityType}
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
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
              {/* <img
                src={item?.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              /> */}
              <Avatar className="w-full h-full">
                <AvatarImage src={item?.user || ""} />
                <AvatarFallback>
                  {`${item?.user[0] || ""}${item?.user[0] || ""}`}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="relative">
                    <h3
                      className="font-medium max-w-[200px] truncate"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      {item?.user || "Cody Fisher"}
                      {showTooltip && (
                        <div className="absolute z-50 -left-10 -top-8 bg-gray-900 text-white text-sm rounded px-2 py-1 whitespace-nowrap">
                          {item?.user || "Cody Fisher"}
                        </div>
                      )}
                    </h3>
                  </div>
                  {/* <p className="text-sm text-gray-500">Jr. Relation Manager</p> */}
                </div>
                <div className="text-right">
                  <p className="text-sm">{date.date}</p>
                  <p className="text-sm text-gray-500">{date.time}</p>
                </div>
              </div>
              {/* <p className="text-sm text-gray-500 mt-1">cf_1234567890</p> */}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium">Action Type: <span className="font-semibold">{item?.actionType}</span></h4>
          <h4 className="text-lg font-medium mb-4">Activity Type: <span className="font-semibold">{item?.activityType}</span></h4>
          {
            disclosureDetail && (
              <div className="space-y-2">
                <p className="text-sm">{disclosureDetail?.createdBy}</p>
                <p className="text-sm text-gray-500">
                  {disclosureDetail &&
                    formatDateForAuditLog(disclosureDetail?.effectivityDate)}
                  to{" "}
                  {disclosureDetail &&
                    formatDateForAuditLog(disclosureDetail?.validUntil)}
                </p>
              </div>
            )
          }
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuditLogHistory;
