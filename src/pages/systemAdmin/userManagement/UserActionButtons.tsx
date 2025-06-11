import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { StorageUtil } from "@/lib/storage";
import { getRole, toastError, toastSuccess } from "@/lib/utils";
import { wealthService } from "@/services/wealthService";
import { EditUser, LoggedInUser, UserItem } from "@/types/systemAdmin";
import { AxiosError } from "axios";
import { Check, Undo2, X } from 'lucide-react';
import { useMemo, useState } from "react";

interface Props {
    user: UserItem;
    onRoleTitleCreate: () => void;
}

const UserActionButtons = ({ user, onRoleTitleCreate }: Props) => {
    const [isMaker, setIsMaker] = useState(false);
    const [currentUser] = useState<LoggedInUser | null>(() => {
        const user = StorageUtil.get("user");
        return user ? JSON.parse(user) : null;
    });

    useMemo(() => {
        const role = getRole();
        if (role === "SysAdmin,Maker") {
            setIsMaker(true);
        } else {
            setIsMaker(false);
        }
    }, [])

    const handleAction = async (id: string, action: string) => {
        const submitData: EditUser = {
            ...user,
            id: Number(id),
            roleId: user.roleTitle.id,
            lastLoginDate: user.lastLoginDate ?? "",
            remarks: user.remarks,
            clusterHeadId: user.clusterHeadId ? Number(user.clusterHeadId) : null,
            status: isMaker ? "for processing to: " + action : action.trim(),
        }
        const response = await wealthService.editUser(submitData, Number(id));
        if (response instanceof AxiosError) {
            toastError("Error updating user" + response);
        } else {
            onRoleTitleCreate();
            toastSuccess(`Status changed to ${submitData.status}`);
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
    }

    if (user.status === "Deleted") return <div className="py-5"></div>

    if (!isMaker && user.status.split(":")[0] === "for processing to") return (
        <div className="flex gap-3">
            <AlertDialog>
                <AlertDialogTrigger>
                    <div className="icon">
                        <Check size={22} />
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
                    <div className="icon">
                        <X size={22} />
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
                    <div className="icon">
                        <Undo2 size={22} />
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
    )

    if (isMaker) return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className="icon">
                    <X size={22} />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete {user.firstName} {user.lastName}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => handleAction(user.id.toString(), "Deleted")}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    return <div className="py-5"></div>
}

export default UserActionButtons