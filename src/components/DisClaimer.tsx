import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, X, CheckCircle2 } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { useEffect, useMemo, useState } from "react";
import DisClaimerTable from "./DisClaimerTable";
import { Disclaimer } from "./columns";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteDisclaimerDialog } from "./DeleteDisclaimerDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./DatePicker";
import DisClaimerSearchBar from "./DisClaimerSearchBar";
import DisclaimerLoadingOverlay from "./DisclaimerLoadingOverlay";
import { Card } from "./ui/card";
import { wealthService } from "@/services/wealthService";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createLogs } from "@/lib/utils";

export const AddDisClaimerButton = (data, isApproval = false) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 sm:p-2 focus:outline-none">
        <Button
          className={
            "whitespace-nowrap rounded-[50px] bg-[#FF4647] hover:bg-[#FF4647]/90 text-white"
          }
        >
          {!isApproval ? (
            <>
              <Plus className="mr-2 h-5 w-5" />
              Add new item
            </>
          ) : (
            <>Export</>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {!isApproval ? (
          <>
            <DropdownMenuItem
              onClick={() => {
                console.log("data", data);
                navigate("/admin/add", {
                  state: { isEdit: false, data: data, type: "General" },
                });
              }}
            >
              General
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("data", data);
                navigate("/admin/add", {
                  state: { isEdit: false, data: data, type: "Marketing" },
                });
              }}
            >
              Marketing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("data", data);
                navigate("/admin/add", {
                  state: {
                    isEdit: false,
                    data: data,
                    type: "Announcement",
                  },
                });
              }}
            >
              Announcement
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <img
                src={`/images/pdf.png`}
                alt="Empty State"
                className="object-contain"
              />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <img
                src={`/images/xls.png`}
                alt="Empty State"
                className="object-contain"
              />
              XLSX
            </DropdownMenuItem>
            <DropdownMenuItem>
              <img
                src={`/images/csv.png`}
                alt="Empty State"
                className="object-contain"
              />
              CSV
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const DisClaimer = () => {
  const [loading, setLoading] = useState(true);
  // const [openDisclaimOp, setOpenDisclaimOp] = useState(false);
  // const [openDisclaimOpEdit, setOpenDisclaimOpEdit] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Disclaimer>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<Disclaimer[]>([]);
  const [filteredData, setFilteredData] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [delSuccess, setDelSuccess] = useState(false);
  const [filters, setFilters] = useState({
    user: "all",
    type: "all",
    status: "all",
    date: undefined,
    validUntil: undefined,
  });
  const uniqueUsers = useMemo(() => {
    return data.length === 0
      ? []
      : Array.from(new Set(data?.map((item) => item.createdBy)));
  }, [data]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchAllDisclosures = async () => {
    try {
      setLoading(true);
      const data = await wealthService.getAllDisclosures();

      console.log(data, "data");
      setData(data);
      setFilteredData(data);
      return data;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDisclosures();
  }, []);

  const filterByQuery = (dataSource: any, query: string) => {
    return query.length === 0
      ? dataSource
      : dataSource.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase()) ||
            item.status.toLowerCase().includes(query.toLowerCase()) ||
            item.effectivityDate.toLowerCase().includes(query.toLowerCase()) ||
            item.validUntil?.toLowerCase()?.includes(query.toLowerCase())
        );
  };

  const filterByFilters = (dataSource: any, filters: any) => {
    return dataSource.filter((item) => {
      const userMatch =
        filters.user === "all" || item.createdBy === filters.user;

      const typeMatch = filters.type === "all" || item.type === filters.type;

      const statusMatch =
        filters.status === "all" ||
        item.status.toLowerCase() === filters.status.toLowerCase();

      const effectivityDate = new Date(item.effectivityDate);
      const validUntilDate = new Date(item.validUntil);
      const filterDate = new Date(filters.date);
      const filterValiDate = new Date(filters.validUntil);

      // const startOfMonth = new Date(
      //   filterDate.getFullYear(),
      //   filterDate.getMonth(),
      //   1
      // );
      // const endOfMonth = new Date(
      //   filterDate.getFullYear(),
      //   filterDate.getMonth() + 1,
      //   0
      // );

      // const dateMatch =
      //   filters.date === undefined
      //     ? true
      //     : effectivityDate.getMonth() === filterDate.getMonth() &&
      //       effectivityDate.getFullYear() === filterDate.getFullYear();

      // const validateMatch =
      //   filters.validUntil === undefined
      //     ? true
      //     : validUntilDate.getMonth() === filterValiDate.getMonth() &&
      //       validUntilDate.getFullYear() === filterValiDate.getFullYear();

      const lastDayOfMonth = new Date(
        filterValiDate.getFullYear(),
        filterValiDate.getMonth() + 1,
        0
      );
      lastDayOfMonth.setHours(23, 59, 59, 999);
      const dateMatch =
        filters.date === undefined || filters.validUntil === undefined
          ? true
          : effectivityDate.getTime() >= filterDate.getTime() &&
            validUntilDate.getTime() <= lastDayOfMonth.getTime() &&
            item.validUntil != null &&
            item.effectivityDate != null;

      return userMatch && typeMatch && statusMatch && dateMatch;
    });
  };

  useEffect(() => {
    console.log("filters", filters);
    const newFilteredData = filterByFilters(data, filters);
    let filterDatas = newFilteredData;
    if (searchQuery.length > 0) {
      filterDatas = filterByQuery(newFilteredData, searchQuery);
    }
    setFilteredData(filterDatas);
  }, [filters]);

  const handleSearch = (query: string) => {
    const filtered = filterByQuery(data, query);
    let filteredDatas = filtered;
    if (
      filters.user !== "all" ||
      filters.type !== "all" ||
      filters.status !== "all" ||
      filters.date !== undefined
    ) {
      filteredDatas = filterByFilters(filtered, filters);
    }
    setFilteredData(filteredDatas);
  };

  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);

    navigate(`/admin/edit/${id}`, {
      state: { toEditDisclaimer: item, isEdit: true, data: data },
    });
  };

  const handleDelete = (item: Disclaimer) => {
    setDeleteItem(item);
    setShowDeleteDialog(true);
  };

  const handleDuplicate = async (item: Disclaimer) => {
    navigate(`/admin/edit/${item.id}`, {
      state: {
        toEditDisclaimer: item,
        isEdit: false,
        data: data,
        isCopy: true,
      },
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const data = await wealthService.deleteDisclosureById(deleteItem?.id);
      createLogs("", user, "Delete");
      console.log("data", data);
      if (data || data.status.toString().includes("20")) {
        setDelSuccess(true);
        toast.custom(
          (t) => (
            <div className="relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-w-[320px]">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">
                  Deletion Request Submitted
                </h3>
                <p className="text-gray-500">
                  Your request to delete the disclosure has been successfully
                  submitted for approval. The item has been temporarily removed
                  from the view and is pending action from the checker. You will
                  be notified once the request is approved or rejected.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t);
                  setDelSuccess(false);
                }}
                className="z-100000 absolute right-2 top-2 p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Close notification"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ),
          {
            duration: 5000,
            position: "top-right",
          }
        );
        fetchAllDisclosures();
      }
    } catch (e) {
      console.log("error", e);
    } finally {
      setTimeout(() => {
        setDelSuccess(false);
      }, 5000);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteItem(undefined);
  };

  const handleTitleClick = (id: string) => {
    console.log("Title clicked:", id);
  };

  const handleGoToDetail = (id: string) => {
    console.log("Go to detail:", id);
    navigate(`/admin/disclaim/${id}`, {
      state: {
        data: data,
      },
    });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="p-6 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Disclosure</h1>
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
            {AddDisClaimerButton(data)}
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
                    <div className="w-full">
                      <Select
                        value={filters.user}
                        onValueChange={(value) =>
                          handleFilterChange("user", value)
                        }
                      >
                        <SelectTrigger className="w-full h-10  focus-visible:ring-red-500">
                          <SelectValue placeholder="All User" />
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
                            All Users
                          </SelectItem>
                          {uniqueUsers.map((name) => (
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

                    {/* Type Select */}
                    <div className="w-full">
                      <Select
                        defaultValue="all"
                        value={filters.type}
                        onValueChange={(value) =>
                          handleFilterChange("type", value)
                        }
                      >
                        <SelectTrigger className="w-full h-10  focus-visible:ring-red-500">
                          <SelectValue placeholder="All Type" />
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
                            All Type
                          </SelectItem>
                          {["General", "Marketing", "Announcement"].map(
                            (type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="data-[state=checked]:text-red-500"
                              >
                                {type}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Select */}
                    <div className="w-full">
                      <Select
                        value={filters.status}
                        onValueChange={(value) =>
                          handleFilterChange("status", value)
                        }
                      >
                        <SelectTrigger className="w-full h-10  focus-visible:ring-red-500">
                          <SelectValue placeholder="All Status" />
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
                            "Active",
                            "Pending",
                            "Scheduled",
                            "Lapsed",
                            "Rejected",
                            "Past",
                            "Draft",
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
                      <DatePicker
                        isFilterEffectDate={true}
                        isFilterValiDate={false}
                        isFilter={true}
                        date={filters.date}
                        onDateChange={(value) =>
                          handleFilterChange("date", value)
                        }
                      />
                    </div>
                    <div className="w-full">
                      <DatePicker
                        isFilterEffectDate={false}
                        isFilterValiDate={true}
                        isFilter={true}
                        date={filters.validUntil}
                        onDateChange={(value) =>
                          handleFilterChange("validUntil", value)
                        }
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {loading ? (
          <EmptyState isDisClaimer={true} />
        ) : (
          <Card className="p-10 mt-4">
            <DisClaimerTable
              data={filteredData}
              actions={{
                onEdit: handleEdit,
                onDelete: handleDelete,
                onTitleClick: handleTitleClick,
                onGoDetail: handleGoToDetail,
                onDuplicate: handleDuplicate,
              }}
              columns={[]}
            />
          </Card>
        )}
      </div>
      <DeleteDisclaimerDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {updating && <DisclaimerLoadingOverlay />}
    </>
  );
};
