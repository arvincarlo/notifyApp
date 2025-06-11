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
import { toastError, toastSuccess } from "@/lib/utils";
import { wealthService } from "@/services/wealthService";
import { RoleTitleItem } from '@/types/systemAdmin';
import { Trash2 } from 'lucide-react';

interface Props {
    roleTitle: RoleTitleItem
    onRoleTitleCreate: () => void;
}

const DeleteRoleTitle = ({ roleTitle, onRoleTitleCreate }: Props) => {
    const handleDelete = async (id: number) => {
        await wealthService.deleteRoleTitle(id)
            .then(() => {
                toastSuccess(`Role Title ${roleTitle.roleName} deleted successfully`);
            })
            .catch((error) => {
                toastError(`Error deleting role title: ${error.message}`);
            });
        onRoleTitleCreate();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className="icon">
                    <Trash2 size={22} />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete {roleTitle.roleName}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(roleTitle.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteRoleTitle