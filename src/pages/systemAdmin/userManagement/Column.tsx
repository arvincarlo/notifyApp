import { Button } from "@/components/ui/button";
import { UserItem } from "@/types/systemAdmin";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import CreateNewUser from "./CreateNewUser";
import UserActionButtons from "./UserActionButtons";

export const UserTableColumns = (onRoleTitleCreate: () => void): ColumnDef<UserItem>[] => [
    {
        accessorKey: "fullName",
        header: () => {
            return (
                <Button variant="ghost">
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) =>
            <CreateNewUser
                isEdit={true}
                user={row.original}
                handleAddUser={() => { }}
                handleCloseModal={() => onRoleTitleCreate()}
            />
    },
    {
        accessorKey: "roleTitle",
        header: "Role Title",
        cell: ({ row }) => <span className="capitalize">{row.original.roleTitle.roleName}</span>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
            <span>
                {row.original.status === "for processing to: Deleted" ? "for processing to: Delete" : row.original.status}
            </span>
    },
    {
        accessorKey: "action",
        header: () => <span className="flex justify-center">Action</span>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-end">
                    <UserActionButtons
                        user={row.original}
                        onRoleTitleCreate={onRoleTitleCreate}
                    />
                </div>
            );
        }
    }
]
