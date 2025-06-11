import MainLayout from "@/components/MainLayout";
import Search from "@/components/Search";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DataTable } from "@/components/ui/data-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SELECTED_USER } from "@/constant/sysAdmin";
import { cn, getRole } from "@/lib/utils";
import { wealthService } from "@/services/wealthService";
import {
  Pagination as PaginationType,
  RoleTitleItem,
  UserItem,
} from "@/types/systemAdmin";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronsUpDown, ListFilter, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ActivityHistoryTable from "../../activityHistory/ActivityHistoryTable";
import { UserTableColumns } from "./Column";
import CreateNewUser from "./CreateNewUser";
import { SearchUser } from "./SearchUser";

const UserMaintenance = () => {
  const [data, setData] = useState<PaginationType<UserItem>>();
  const [roleTitleData, setRoleTitleData] =
    useState<PaginationType<RoleTitleItem>>();
  const [selectedRoleTitle, setSelectedRoleTitle] = useState("");
  const [roleTitleOpen, setroleTitleOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(SELECTED_USER);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all") value = "";
    if (key !== "pageNumber") searchParams.delete("pageNumber");
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (searchParams.get("roleTitle")) {
      setSelectedRoleTitle(searchParams.get("roleTitle")!);
    }
    if (searchParams.get("roleTitleSearch")) {
      setSelectedRoleTitle(searchParams.get("roleTitleSearch")!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = useCallback(async () => {
    const fetchedData = await wealthService.getAllUsers(searchParams);
    setData(fetchedData);
  }, [searchParams]);

  useEffect(() => {
    const fetchRoleTitleData = async () => {
      const roleTitle = searchParams.get("roleTitleSearch") || undefined;
      const fetchedRoleTitleData = await wealthService.getAllRoleTitles(
        roleTitle ? new URLSearchParams({ searchTerm: roleTitle }) : undefined
      );
      setRoleTitleData(fetchedRoleTitleData);
    };
    fetchData();
    fetchRoleTitleData();
  }, [fetchData, searchParams]);

  return (
    <MainLayout isAdmin={true} isSysAdmin={true}>
      <div className="mt-10 relative">
        <DataTable
          columns={UserTableColumns(fetchData)}
          data={data?.items || []}
          showFilter={showFilters}
          totalPages={data?.totalPages}
          pagSize={data?.pageSize}
        >
          <div className="flex items-center w-full justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              Users Maintenance
            </h1>
            <div className="flex items-center gap-2">
              <Search />
              <ListFilter
                size={36}
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-2 hover:bg-gray-100 cursor-pointer rounded-full focus:outline-none",
                  showFilters ? "text-[#FF4647]" : "text-[#616161]"
                )}
              />
            </div>
          </div>
          <div className="absolute top-10 w-full block">
            {showFilters && (
              <div className="flex gap-4 border-t">
                <AnimatePresence>
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
                      className="flex justify-end gap-4 w-full py-4 px-1"
                    >
                      <div className="basis-52">
                        <Popover
                          open={roleTitleOpen}
                          onOpenChange={setroleTitleOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={roleTitleOpen}
                              className="w-full justify-between"
                            >
                              {selectedRoleTitle || "All Role Title"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput
                                id="search-role-title"
                                onValueChange={(value) =>
                                  handleFilterChange("roleTitleSearch", value)
                                }
                              />
                              <CommandList className="bg-white">
                                <CommandEmpty>
                                  No role title found.
                                </CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value="all"
                                    onSelect={() => {
                                      setSelectedRoleTitle("");
                                      handleFilterChange("roleTitle", "all");
                                      setroleTitleOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedRoleTitle === ""
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    All Role Title
                                  </CommandItem>
                                  {roleTitleData?.items.map((roleTitle) => (
                                    <CommandItem
                                      key={roleTitle.id}
                                      value={roleTitle.roleName}
                                      onSelect={(currentValue) => {
                                        setSelectedRoleTitle(currentValue);
                                        handleFilterChange("roleTitle", currentValue)
                                        setroleTitleOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedRoleTitle ===
                                            roleTitle.roleName
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {roleTitle.roleName}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="basis-52">
                        <Select
                          defaultValue="all"
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
                              "Inactive",
                              "Deleted",
                              "Return to Maker",
                              "for processing to: Active",
                              "for processing to: Deleted"
                            ].map((activity) => (
                              <SelectItem
                                key={activity}
                                value={activity}
                                className="data-[state=checked]:text-red-500"
                              >
                                {activity === "for processing to: Deleted" ? "for processing to: Delete" : activity}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

          <ActivityHistoryTable />

          {getRole() === "SysAdmin,Maker" && (
            <AlertDialog
              open={alertOpen}
              onOpenChange={() => setAlertOpen(!alertOpen)}
            >
              <AlertDialogTrigger asChild>
                <Button
                  className={
                    "whitespace-nowrap rounded-[50px] bg-[#FF4647] hover:bg-[#FF4647]/90 text-white"
                  }
                >
                  <Plus className=" h-5 w-5" />
                  Add User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Active Directory Registered Users
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <SearchUser
                      value={
                        selectedUser.fullName
                      }
                      onSelect={(user) => {
                        setSelectedUser(user);
                      }}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setSelectedUser(SELECTED_USER)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    asChild
                    onClick={() => setAlertOpen(false)}
                  >
                    <CreateNewUser
                      entraUser={selectedUser}
                      handleAddUser={() => handleFilterChange("pageNumber", "1")}
                      handleCloseModal={() => {
                        setAlertOpen(false)
                        handleFilterChange("pageNumber", "1")
                        handleFilterChange("pageSize", "10")
                        setSelectedUser(SELECTED_USER)
                        fetchData()
                      }}
                    />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default UserMaintenance;
