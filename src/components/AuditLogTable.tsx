import React, { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { EmptyState } from "./EmptyState";
import DisClaimerTable from "./DisClaimerTable";
import { wealthService } from "@/services/wealthService";
import DisClaimerSearchBar from "./DisClaimerSearchBar";
import { AddDisClaimerButton } from "./DisClaimer";
import { formatDateTime, isCurrentDate, isWithinDateRange } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import UserSearchInput from "./UserSearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DateRange } from "react-day-picker";
import { DateRangePickerWithPresets } from "./DateRangePickerWithPresets";
import AuditLogHistory from "./AuditLogHistory";

type AuditType = {
  user: string;
  userId: string;
  actionType: string;
  activityType: string;
  timeStamp: string;
  disclosureId: string;
};

export default function AuditLogTable() {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [data, setData] = useState<AuditType[]>([]);
  const [filteredData, setFilteredData] = useState<AuditType[]>([]);
  const [auditLogDetail, setAuditLogDetail] = useState<AuditType>();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    activityType: "all",
    actionType: "all",
    date: undefined,
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const [openAuditDetail, setOpenAuditDetail] = useState(false);
  const fetchAllAuditLogs = async () => {
    try {
      const data = await wealthService.getAllLogs();
      const logs = data.map((item) => ({
        user: item.user,
        userId: item.userId,
        actionType: item.actionType,
        activityType: item.activityType,
        timeStamp: item.timeStamp,
        disclosureId: item.disclosureId,
      }));
      setData(logs);
      setFilteredData(logs);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const users = useMemo(() => {
    return data.map((item, index) => ({
      id: (index + 1).toString(),
      name: item.user,
    }));
  }, [data]);
  const handleDateSelect = (range: DateRange) => {
    setDateRange(range);
    console.log("Selected date range:", range);
  };

  const activityTypes = useMemo(() => {
    return [...new Set(data.map((item) => item.activityType))];
  }, [data]);

  const actionTypes = useMemo(() => {
    return [...new Set(data.map((item) => item.actionType))];
  }, [data]);

  useEffect(() => {
    fetchAllAuditLogs();
  }, []);
  const filterByQuery = (dataSource: any, query: string) => {
    return query.length === 0
      ? dataSource
      : dataSource.filter(
          (item) =>
            item.user.toLowerCase().includes(query.toLowerCase()) ||
            item.userId.toLowerCase().includes(query.toLowerCase()) ||
            item.actionType.toLowerCase().includes(query.toLowerCase()) ||
            item.activityType.toLowerCase().includes(query.toLowerCase()) ||
            formatDateTime(item.timeStamp)
              .date.toLowerCase()
              .includes(query.toLowerCase()) ||
            formatDateTime(item.timeStamp)
              .time.toLowerCase()
              .includes(query.toLowerCase())
        );
  };

  const filterByFilters = (dataSource: any, filters: any) => {
    return dataSource.filter((item) => {
      const userMatch =
        item.user === selectedUser || selectedUser === "All Users";

      const activityTypeMatch =
        filters.activityType === "all" ||
        item.activityType === filters.activityType;

      const actionTypeMatch =
        filters.actionType === "all" || item.actionType === filters.actionType;

      const dateMatch = isCurrentDate(dateRange)
        ? true
        : isWithinDateRange(item.timeStamp, dateRange);

      return userMatch && activityTypeMatch && actionTypeMatch && dateMatch;
    });
  };
  const handleSearch = (query: string) => {
    const filtered = filterByQuery(data, query);
    let filteredDatas = filtered;
    if (
      filters.user !== "all" ||
      filters.actionType !== "all" ||
      filters.activityType !== "all" ||
      filters.date !== undefined
    ) {
      filteredDatas = filterByFilters(filtered, filters);
    }
    setFilteredData(filteredDatas);
  };

  const handleOpenAuditLog = (item: any) => {
    console.log("item", item);
    setOpenAuditDetail(true);
    setAuditLogDetail(item);
  };

  useEffect(() => {
    const newFilteredData = filterByFilters(data, filters);
    let filterDatas = newFilteredData;
    if (searchQuery.length > 0) {
      filterDatas = filterByQuery(newFilteredData, searchQuery);
    }
    setFilteredData(filterDatas);
  }, [filters, selectedUser, dateRange]);
  return (
    <>
      <div className="p-6 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Audit Logs</h1>
          <div className="flex items-center gap-4">
            <DisClaimerSearchBar
              onSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"
                  fill={showFilters ? "#FF4647" : "#616161"}
                />
              </svg>
            </button>
            {AddDisClaimerButton(data, true)}
          </div>
        </div>
        {showFilters && (
          <div className="flex gap-4 border-t">
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-full overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="grid grid-cols-4 gap-4 w-full py-4 px-1"
                  >
                    {/* Users Select */}
                    <UserSearchInput
                      value={selectedUser}
                      users={users}
                      onChange={setSelectedUser}
                    />

                    {/* ActivityType Select */}
                    <div className="w-full">
                      <Select
                        defaultValue="all"
                        value={filters.activityType}
                        onValueChange={(value) =>
                          handleFilterChange("activityType", value)
                        }
                      >
                        <SelectTrigger className="w-full h-10  focus-visible:ring-red-500">
                          <SelectValue placeholder="All Activity" />
                        </SelectTrigger>
                        <SelectContent
                          className="bg-white border border-gray-200 shadow-lg rounded-lg p-1 z-50"
                          position="popper"
                          sideOffset={4}
                          align="start"
                          avoidCollisions={true}
                          side="bottom"
                        >
                          <SelectItem
                            value="all"
                            className="data-[state=checked]:text-red-500"
                          >
                            All Activity
                          </SelectItem>
                          {activityTypes.map((activity) => (
                            <SelectItem
                              key={activity}
                              value={activity}
                              className="data-[state=checked]:text-red-500"
                            >
                              {activity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ActionType Select */}
                    <div className="w-full">
                      <Select
                        defaultValue="all"
                        value={filters.actionType}
                        onValueChange={(value) =>
                          handleFilterChange("actionType", value)
                        }
                      >
                        <SelectTrigger className="w-full h-10  focus-visible:ring-red-500">
                          <SelectValue placeholder="All Action" />
                        </SelectTrigger>
                        <SelectContent
                          className="bg-white border border-gray-200 shadow-lg rounded-lg p-1 z-50"
                          position="popper"
                          sideOffset={4}
                          align="start"
                          avoidCollisions={true}
                          side="bottom"
                        >
                          <SelectItem
                            value="all"
                            className="data-[state=checked]:text-red-500"
                          >
                            All Action
                          </SelectItem>
                          {actionTypes.map((actionType) => (
                            <SelectItem
                              key={actionType}
                              value={actionType}
                              className="data-[state=checked]:text-red-500"
                            >
                              {actionType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full">
                      <DateRangePickerWithPresets
                        date={dateRange}
                        onSelect={handleDateSelect}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {loading ? (
          <EmptyState isAuditLog={true} />
        ) : (
          <Card className="p-10 mt-4">
            <DisClaimerTable
              isAuditLog={true}
              data={filteredData}
              actions={{
                onEdit: () => {},
                onDelete: () => {},
                onTitleClick: () => {},
                onGoDetail: () => {},
                onOpenAuditLog: handleOpenAuditLog,
              }}
              columns={[]}
            />
          </Card>
        )}
      </div>
      <AuditLogHistory
        open={openAuditDetail}
        onClose={() => {
          setOpenAuditDetail(false);
          setAuditLogDetail(undefined);
        }}
        item={openAuditDetail ? auditLogDetail : undefined}
      />
    </>
  );
}
