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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_USER as CREATE_USER_CONSTANT, SELECTED_USER } from "@/constant/sysAdmin";
import { StorageUtil } from "@/lib/storage";
import { cn, getRole, toastError, toastSuccess } from "@/lib/utils";
import { createUserSchema } from "@/schemas/sysAdmin";
import { wealthService } from "@/services/wealthService";
import { ClusterHeadItem, CreateUser as CreateUserType, EditUser, LoggedInUser, RoleTitleItem, UserItem } from "@/types/systemAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Undo2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
    isEdit?: boolean;
    user?: UserItem;
    entraUser?: typeof SELECTED_USER;
    handleAddUser: () => void;
    handleCloseModal: () => void;
}

const CreateNewUser = ({ entraUser, user, isEdit, handleAddUser, handleCloseModal }: Props) => {
    const [isValidate, setIsValidate] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [roleTitleOpen, setRoleTitleOpen] = useState(false);
    const [selectedRoleTitle, setSelectedRoleTitle] = useState("");
    const [roleTitleSearch, setRoleTitleSearch] = useState("");
    const [roleTitleData, setRoleTitleData] = useState<RoleTitleItem[]>();
    const [clusterHeadData, setClusterHeadData] = useState<ClusterHeadItem[]>();
    const [currentUser] = useState<LoggedInUser | null>(() => {
        const user = StorageUtil.get("user");
        return user ? JSON.parse(user) : null;
    });
    const isChecker = getRole() === "SysAdmin,Checker";

    const form = useForm<z.infer<typeof createUserSchema>>({
        resolver: zodResolver(createUserSchema),
        defaultValues: user ? {
            ...user,
            id: user.id.toString(),
            clusterHeadId: user.clusterHeadId ? Number(user.clusterHeadId) : undefined,
            role: user.role.split(",")[0] as "Member" | "SysAdmin" | "Admin" | "ClusterHead",
            permission: user.role.split(",")[1] as "Maker" | "Checker",
            roleId: user.roleTitle.id,
            remarks: user.remarks,
            profileValidityStart: user.profileValidityStart ? new Date(user.profileValidityStart) : undefined,
            profileValidityEnd: user.profileValidityEnd ? new Date(user.profileValidityEnd) : undefined,
        } : CREATE_USER_CONSTANT
    });

    useEffect(() => {
        if (entraUser) {
            form.reset({
                fullName: entraUser.fullName,
                emailAddress: entraUser.email,
                userName: entraUser.userName,
                entraId: entraUser.id,
                status: "for processing to: Active",
            });
        }
    }, [entraUser, form]);

    useEffect(() => {
        if (isEdit && user) {
            form.reset({
                ...user,
                id: user.id.toString(),
                clusterHeadId: user.clusterHeadId ? Number(user.clusterHeadId) : undefined,
                role: user.role.split(",")[0] as "Member" | "SysAdmin" | "Admin" | "ClusterHead",
                permission: user.role.split(",")[1] as "Maker" | "Checker",
                roleId: user.roleTitle.id,
                remarks: user.remarks,
                profileValidityStart: user.profileValidityStart ? new Date(user.profileValidityStart) : undefined,
                profileValidityEnd: user.profileValidityEnd ? new Date(user.profileValidityEnd) : undefined,
            });
        }
    }, [form, isEdit, user])

    useEffect(() => {
        if (isEdit && user?.roleTitle) setSelectedRoleTitle(user?.roleTitle.roleName);
        if (isSheetOpen) {
            const fetchRoleTitles = async () => {
                const response = await wealthService.getAllRoleTitles(new URLSearchParams({ searchTerm: roleTitleSearch }));
                setRoleTitleData(response.items);
            }
            const fetchClusterHeads = async () => {
                const response = await wealthService.getAllClusterHeads();
                setClusterHeadData(response);
            }

            fetchRoleTitles();
            fetchClusterHeads();
        }
    }, [isEdit, isSheetOpen, roleTitleSearch, user?.roleTitle])

    const onSubmit: SubmitHandler<z.infer<typeof createUserSchema>> = async (data) => {
        if (isValidate) {
            let response;

            if (isEdit) {
                const submitData: EditUser = {
                    ...data,
                    id: user!.id,
                    lastLoginDate: "",
                    role: `${data.role},${data.permission}`,
                    roleTitle: {
                        id: form.getValues("roleId"),
                        roleName: selectedRoleTitle
                    },
                    status: "for processing to: Active",
                }
                response = await wealthService.editUser(submitData, Number(user?.id));
            } else {
                const submitData: CreateUserType = {
                    ...data,
                    lastLoginDate: "",
                    role: `${data.role},${data.permission}`
                }
                response = await wealthService.createUser(submitData);
            }

            if (!(response instanceof AxiosError)) {
                handleAddUser();
                setIsSheetOpen(false);
                setIsValidate(false);
                handleCloseModal();
                await wealthService.createLogs({
                    user: currentUser?.name,
                    userId: currentUser?.id,
                    disclosureId: null,
                    activityType: `
                    ${currentUser?.name.trim()} 
                    ${isEdit ? "requested to update" : "requested to create"}
                    ${form.getValues("firstName")} ${form.getValues("lastName")}
                    `,
                    actionType: `${isEdit ? "Edit" : "Create"}`,
                    timestamp: new Date().toISOString(),
                })
                toastSuccess(`${isEdit ? "User updated successfully" : "User created successfully"}`);
            }
        } else {
            setIsValidate(true)
            if (form.getValues("role") !== "Member") form.resetField("clusterHeadId")
        }
    }

    const handleAction = async (id: string, action: string) => {
        if (user) {
            const submitData: EditUser = {
                ...user,
                id: Number(id),
                roleId: user.roleTitle.id,
                lastLoginDate: user.lastLoginDate ?? "",
                remarks: user.remarks,
                clusterHeadId: user.clusterHeadId ? Number(user.clusterHeadId) : null,
                status: action.trim(),
            }
            await wealthService.editUser(submitData, Number(id))
                .then(() => {
                    toastSuccess(`Status changed to ${submitData.status}`);
                })
                .catch((error) => {
                    toastError("Error updating user: " + error);
                })
            await wealthService.createLogs({
                user: currentUser?.name,
                userId: currentUser?.id,
                disclosureId: null,
                activityType: `
                ${currentUser?.name.trim()} 
                ${action.trim() === "Active" ? "Approved" : action} 
                ${user.firstName} ${user.lastName}
                `,
                actionType: `${action.trim() === "Active" ? "Approved" : action} `,
                timestamp: new Date().toISOString(),
            })
        }
        handleCloseModal();
        setIsSheetOpen(false);
    }

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                {isEdit ?
                    <span className="text-blue-500 cursor-pointer">{user?.fullName}</span> :
                    <Button disabled={!entraUser?.fullName}>
                        Confirm
                    </Button>
                }
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px] p-0 rounded-l-2xl">
                <SheetHeader className="p-6 bg-red-500 text-white rounded-tl-2xl relative">
                    <SheetTitle
                        className="text-white text-xl font-normal"
                    >
                        {isValidate ?
                            "Acknowledgement" :
                            `${isEdit ? "Update User" : "Add New User"} - 
                            ${entraUser?.userName || user?.userName}`
                        }
                    </SheetTitle>
                    <SheetDescription className="text-slate-200">
                        {isValidate ? "Are the details correct?" : "Fields with * are required"}
                    </SheetDescription>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-2 text-white h-8 w-8 hover:bg-transparent hover:text-white"
                        onClick={() => setIsSheetOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </SheetHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pt-4">
                        <div className="mt-5">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "fullName"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Full Name *
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={true} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-5">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "firstName"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            First Name *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isValidate || isChecker}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-5">
                            <FormField
                                control={form.control}
                                name="middleName"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "middleName"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Middle Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isValidate || isChecker}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-5">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "lastName"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Last Name *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isValidate || isChecker}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-5">
                            <FormField
                                control={form.control}
                                name="emailAddress"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "emailAddress"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email Address*
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={true} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-5">
                            <FormField
                                control={form.control}
                                name="remarks"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "remarks"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Remarks
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea {...field} disabled={isValidate || isChecker} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-between mt-5 gap-3">
                            <Card className="w-full -mx-1">
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "role"> }) => (
                                            <FormItem className="mt-4">
                                                <FormLabel>Role</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={isValidate || isChecker}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="SysAdmin" id="SysAdmin" />
                                                            <Label htmlFor="SysAdmin">SysAdmin</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Admin" id="Admin" />
                                                            <Label htmlFor="Admin">Admin</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="ClusterHead" id="ClusterHead" />
                                                            <Label htmlFor="ClusterHead">Cluster Head</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Member" id="Member" />
                                                            <Label htmlFor="Member">Member</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                            <Card className="w-full">
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="permission"
                                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "permission"> }) => (
                                            <FormItem className="mt-4">
                                                <FormLabel>Permission</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={isValidate || isChecker}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Maker" id="Maker" />
                                                            <Label htmlFor="Maker">Maker</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Checker" id="Checker" />
                                                            <Label htmlFor="Checker">Checker</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {form.watch("role") === "Member" && (
                            <div className="mt-5">
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="clusterHeadId"
                                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "clusterHeadId"> }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Cluster Head</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value?.toString()}
                                                    >
                                                        <SelectTrigger disabled={isValidate || isChecker} {...field}>
                                                            <SelectValue placeholder="Select Cluster Head" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {clusterHeadData?.map((clusterHead) => (
                                                                <SelectItem
                                                                    key={clusterHead.id}
                                                                    value={clusterHead.id.toString()}>
                                                                    {clusterHead.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-5">
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="roleId"
                                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "roleId"> }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Role Title *</FormLabel>
                                            <FormControl>
                                                <Popover
                                                    {...field}
                                                    open={roleTitleOpen}
                                                    onOpenChange={setRoleTitleOpen}
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={isValidate || isChecker}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={roleTitleOpen}
                                                            className="w-full justify-between"
                                                        >
                                                            {selectedRoleTitle || "Select Role Title"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command>
                                                            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                                                                <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                                                <input
                                                                    className={cn(
                                                                        "border-none flex h-10 w-full rounded-md bg-white py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                                                                    )}
                                                                    id="search-role-title"
                                                                    value={roleTitleSearch}
                                                                    onChange={(e) => setRoleTitleSearch(e.target.value)}
                                                                />
                                                            </div>
                                                            <CommandList className="bg-white">
                                                                <CommandEmpty>
                                                                    No role title found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {roleTitleData?.map((roleTitle) => (
                                                                        <CommandItem
                                                                            key={roleTitle.id}
                                                                            onSelect={(currentValue) => {
                                                                                setSelectedRoleTitle(currentValue);
                                                                                field.onChange(roleTitle.id);
                                                                                setRoleTitleOpen(false);
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
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <FormLabel>Profile Validity Period</FormLabel>
                            <div className="mt-3">
                                <FormField
                                    control={form.control}
                                    name="profileValidityStart"
                                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "profileValidityStart"> }) => (
                                        <FormItem className="flex flex-col gap-1">
                                            <FormLabel>Start Date *</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                                disabled={isValidate || isChecker}
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                            disabled={isValidate || isChecker}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-3">
                                <FormField
                                    control={form.control}
                                    name="profileValidityEnd"
                                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof createUserSchema>, "profileValidityEnd"> }) => (
                                        <FormItem className="flex flex-col gap-1">
                                            <FormLabel>End Date *</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                                disabled={isValidate || isChecker}
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                            disabled={isValidate || isChecker}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        {isChecker && user && user.status.includes("for processing") &&
                            (
                                <div className="flex gap-3 my-5">
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <div className="icon flex items-center">
                                                <Check size={18} /> <p className="text-sm" /> Approve
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will approve {user.firstName} {user.lastName} with a status of {user.status.split(":")[1]}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleAction(user.id.toString(), user.status.split(":")[1])}>
                                                    Approve
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <div className="icon flex items-center">
                                                <X size={18} /> <p className="text-sm" /> Reject
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will reject {user.firstName} {user.lastName}.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleAction(user.id.toString(), "Rejected")}>
                                                    Reject
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <div className="icon flex items-center">
                                                <Undo2 size={18} /> <p className="text-sm text-nowrap ms-2">Return to Maker</p>
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {user.firstName} {user.lastName} will return to Maker
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleAction(user.id.toString(), "Return to Maker")}>
                                                    Return
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}

                        {!isChecker && (
                            <SheetFooter className="my-7">
                                <SheetClose asChild>
                                    {!isValidate &&
                                        <Button variant="secondary">
                                            Cancel
                                        </Button>
                                    }
                                </SheetClose>
                                {isValidate ?
                                    <>
                                        <Button type="button" variant="secondary" onClick={() => setIsValidate(false)}>No</Button>
                                        <Button type="submit">Yes</Button>
                                    </> :
                                    <Button type="submit">Next</Button>
                                }
                            </SheetFooter>
                        )}
                    </form>
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}

export default CreateNewUser