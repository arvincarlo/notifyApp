import { Separator } from "@/components/ui/separator";
import { CalendarClock, BellIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Fragment } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNotification } from "@/context/NotificationContext";

export default function Notifications() {
    const { notifications } = useNotification();
    console.log(notifications);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="border-none shadow-none hover:bg-transparent hover:shadow-none focus:outline-none focus:ring-0 focus:border-none active:border-none"
                    style={{ boxShadow: "none", border: "none" }}
                >
                    <BellIcon className="h-5 w-5 text-gray-500" />
                    {notifications.length > 0 && (
                        <div className="flex">
                            <Badge
                                className="h-5 min-w-5 rounded-lg px-1 font-mono tabular-nums"
                                variant="destructive"
                            >
                                {notifications.length}
                            </Badge>
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="overflow-auto w-96 p-4 max-h-[90vh]">
                <div className="">
                    {notifications.length === 0 && (
                        <div className="flex justify-center gap-3">
                            No notifications available.
                        </div>
                    )}

                    {notifications.length > 0 && (
                        <>
                            <div className="flex justify-center pb-4 font-semibold">
                                Pending Approvals
                            </div>
                            <Separator />
                            {notifications.map((notification, index) => (
                                <Fragment key={index}>
                                    <div key={notification.id} className="group flex items-center gap-x-6 p-4 hover:bg-gray-100 rounded-lg">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white  group-hover:text-red-600 transition-colors">
                                            <CalendarClock className="h-6 w-6text-gray-600 group-hover:bg-white" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-semibold">{notification?.activityType}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{notification.requestedBy.name}</p>
                                        </div>
                                    </div>
                                </Fragment>
                            ))}
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}