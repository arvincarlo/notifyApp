
import AuditLogTable from "@/components/AuditLogTable";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger
} from "@/components/ui/drawer";
import { History, X } from "lucide-react";
import { useState } from "react";

const ActivityHistoryTable = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="font-normal text-slate-400 mx-3">
        <History />
      </DrawerTrigger>
      <DrawerContent className="-mb-14">
        <DrawerHeader>
          <X
            size={22}
            className="cursor-pointer ms-auto mr-7"
            onClick={() => setIsOpen(false)}
          />
          <DrawerDescription className="h-screen overflow-y-auto">
            <AuditLogTable />
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

export default ActivityHistoryTable