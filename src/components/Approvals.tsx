import React, { useEffect, useState } from "react";
import { EmptyState } from "./EmptyState";
import { Approval } from "./columns";
import DisClaimerTable from "./DisClaimerTable";
import { Card } from "./ui/card";
import DisClaimerSearchBar from "./DisClaimerSearchBar";
import { AddDisClaimerButton } from "./DisClaimer";
import { AnimatePresence, motion } from "framer-motion";
import UserSearchInput from "./UserSearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePickerWithPresets } from "./DateRangePickerWithPresets";
import { DateRange } from "react-day-picker";
import { isCurrentDate, isWithinDateRange } from "@/lib/utils";
import { useNotification } from "@/context/NotificationContext";

export default function Approvals() {
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [filters, setFilters] = useState({
    activity: "all",
    status: "all",
  });

  // Approvals data
  const { approvals } = useNotification();

  const data1: Approval[] = approvals;
  const users = data1.map((item) => ({
    id: item.id,
    name: item.requestedBy.name,
  }));

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(data1);
  const [showFilters, setShowFilters] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleDateSelect = (range: DateRange) => {
    setDateRange(range);
    console.log("Selected date range:", range);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const newFilteredData = data1?.filter((item) => {
      const typeMatch =
        item.activityType === filters.activity || filters.activity === "all";
      const userMatch =
        item.requestedBy.name === selectedUser || selectedUser === "All Users";
      const statusMatch =
        item.status === filters.status || filters.status === "all";
      const dateMatch = isCurrentDate(dateRange)
        ? true
        : isWithinDateRange(item.lastModified, dateRange);
      return typeMatch && userMatch && statusMatch && dateMatch;
    });

    setFilteredData(newFilteredData);
  }, [filters, selectedUser, dateRange]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = data1.filter(
      (item) =>
        item.activityType.toLowerCase().includes(query.toLowerCase()) ||
        item.lastModified.toLowerCase().includes(query.toLowerCase()) ||
        item.requestedBy.name.toLowerCase().includes(query.toLowerCase()) ||
        item.requestedBy.role.toLowerCase().includes(query.toLowerCase()) ||
        item.status.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };
  return (
    <>
      <div className="p-6 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Approvals</h1>
          <div className="flex items-center gap-4">
            <DisClaimerSearchBar
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
              onSearch={handleSearch}
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
            {AddDisClaimerButton([], true)}
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

                    {/* Activity Select */}
                    <div className="w-full">
                      <Select
                        defaultValue="all"
                        // value={filters.type}
                        onValueChange={(value) =>
                          handleFilterChange("activity", value)
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
                          {["Disclosures", "Parameter Maintenance"].map(
                            (activity) => (
                              <SelectItem
                                key={activity}
                                value={activity}
                                className="data-[state=checked]:text-red-500"
                              >
                                {activity}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Select */}
                    <div className="w-full">
                      <Select
                        defaultValue="all"
                        // value={filters.type}
                        onValueChange={(value) =>
                          handleFilterChange("status", value)
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
                            All Status
                          </SelectItem>
                          {[
                            "Approved",
                            "Lapsed",
                            "Pending",
                            "Pending Deletion",
                            "Referred back",
                            "Rejected",
                          ].map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="data-[state=checked]:text-red-500"
                            >
                              {status}
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
          <>
            <EmptyState isApprovals={true} />
          </>
        ) : (
          <Card className="p-10 mt-4">
            <DisClaimerTable
              isApproval={true}
              data={filteredData}
              actions={{
                onEdit: () => {},
                onDelete: () => {},
                onTitleClick: () => {},
                onGoDetail: () => {},
              }}
              columns={[]}
            />
          </Card>
        )}
      </div>
    </>
  );
}
