import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface DeleteDisclaimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isCreate?: boolean;
  isEdit?: boolean;
}

export const DeleteDisclaimerDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isCreate,
  isEdit,
}: DeleteDisclaimerDialogProps) => {
  const isDelete = !isCreate && !isEdit;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <button
          onClick={onCancel}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            {isDelete && "Delete Disclosure"}
            {isCreate && "Cancel Disclosure Creation"}
            {isEdit && "Cancel Editing Disclosure "}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base !mt-8">
            {isDelete &&
              "Are you sure you want to delete this disclosure? This action cannot be undone."}
            {isCreate &&
              "Are you sure you want to cancel creating this disclosure? Any unsaved changes will be lost. "}
            {isEdit &&
              "You have unsaved changes in the disclosure you are editing. If you cancel now, all changes will be discarded. "}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-4 !justify-between">
          <AlertDialogCancel
            className="text-[#FF4647] bg-transparent hover:bg-transparent rounded-full"
            onClick={onCancel}
          >
            {isDelete ? "Cancel" : "Discard Changes"}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#FF4647] text-white px-4 py-2 hover:bg-[#FF4647]/90 rounded-full"
            onClick={onConfirm}
          >
            {isDelete ? "Delete Disclosure" : "Resume Editing"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
