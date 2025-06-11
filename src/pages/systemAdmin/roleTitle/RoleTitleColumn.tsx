import { RoleTitleItem } from '@/types/systemAdmin';
import { ColumnDef } from '@tanstack/react-table';
import CreateRoleTitle from './CreateRoleTitle';
import DeleteRoleTitle from './DeleteRoleTitle';

export const RoleTitleColumns = (onRoleTitleCreate: () => void): ColumnDef<RoleTitleItem>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => {
            return <div className="text-blue-500 cursor-pointer">
                <CreateRoleTitle
                    isEdit={true}
                    roleTitle={row.original}
                    onRoleTitleCreate={onRoleTitleCreate}
                />
            </div>;
        },
    },
    {
        accessorKey: 'roleName',
        header: 'Role Name',
    },
    {
        accessorKey: "action",
        header: () => <span className="flex justify-end">Action</span>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-end">
                    <DeleteRoleTitle
                        roleTitle={row.original}
                        onRoleTitleCreate={onRoleTitleCreate}
                    />
                </div>
            );
        }
    }
]