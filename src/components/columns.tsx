import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";

export type Disclaimer = {
  id: string;
  title: string;
  createdBy: string;
  type: "General" | "Marketing" | "Announcement";
  // dateCreated: string;
  // validity: {
  //   start: string;
  //   end: string;
  // };
  effectivityDate: string;
  validUntil: string;
  status:
    | "Pending Approval"
    | "Pending Deletion"
    | "Scheduled"
    | "Active"
    | "Lapsed"
    | "Rejected"
    | "Past"
    | "Expired"
    | "Draft";
};

export type AuditLog = {
  user: string;
  userId: string;
  activityType: string;
  actionType: string;
  timeStamp: string;
};

export type Approval = {
  id: string;
  activityType: string;
  requestedBy: {
    name: string;
    role: string;
  };
  status: "Pending" | "Pending Deletion" | "Rejected" | "Lapsed" | "Approved";
  lastModified: string;
};

interface ColumnActions {
  onEdit?: (id: string) => void;
  onDelete?: (item: Disclaimer) => void;
  onTitleClick?: (id: string) => void;
  onGoDetail?: (id: string) => void;
  onDuplicate?: (item: Disclaimer) => void;
  onOpenAuditLog?: (item: any) => void;
}

export const getStatusColor = (status: string) => {
  const colors = {
    Pending: "bg-[#FDF9E9] text-[#957504]",
    pending: "bg-[#FDF9E9] text-[#957504]",
    "Pending Deletion": "bg-[#FDF9E9] text-[#957504]",
    "Pending Approval": "bg-[#FDF9E9] text-[#957504]",
    Scheduled: "bg-[#EBF9F7] text-[#0F766E]",
    Active: "bg-[#F5F9EE] text-[#4D7C0F]",
    Lapsed: "bg-[#F4F7FB] text-[#4A5464]",
    Past: "bg-[#F8FAFC] text-[#64748B]",
    Draft: "bg-[#F8FAFC] text-[#64748B]",
    Expired: "bg-[#F8FAFC] text-[#64748B]",
    Rejected: "bg-[#FDF4F4] text-[#B91C1C]",
    Approved: "bg-[#F5F9EE] text-[#4D7C0F]",
  };
  return colors[status as keyof typeof colors];
};

export const createColumns = (
  actions: ColumnActions = {},
  isApproval = false,
  isAuditlog = false
): ColumnDef<Approval | Disclaimer | AuditLog>[] => {
  if (isAuditlog) {
    return [
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => (
          <div
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => actions.onOpenAuditLog?.(row.original)}
          >
            {row.getValue("user")}
          </div>
        ),
      },
      {
        accessorKey: "userId",
        header: "User ID",
      },
      {
        accessorKey: "activityType",
        header: "Activity Type",
      },
      {
        accessorKey: "actionType",
        header: "Action Type",
        cell: ({ row }) => {
          const status = row.getValue(
            "actionType"
          ) as keyof typeof statusColorMap;
          const statusColorMap = {
            Reject: "bg-red-50 text-red-800",
            "Under Review": "bg-blue-50 text-blue-800",
            Approve: "bg-green-50 text-green-800",
            Delete: "bg-gray-50 text-gray-800",
            Create: "bg-gray-50 text-gray-800",
            Update: "bg-gray-50 text-gray-800",
            "Refer back": "bg-green-50 text-green-800",
            Upload: "bg-gray-50 text-gray-800",
            View: "bg-gray-50 text-gray-800",
            Generate: "bg-green-50 text-green-800",
          };

          return (
            <Badge className={`${statusColorMap[status]}`}>{status}</Badge>
          );
        },
      },
      {
        accessorKey: "timeStamp",
        header: "Timestamp",
        cell: ({ row }) => (
          <div>{`${formatDateTime(row.getValue("timeStamp")).date}
            ${formatDateTime(row.getValue("timeStamp")).time}`}</div>
        ),
      },
    ];
  }
  if (isApproval) {
    return [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="text-red-500 hover:underline cursor-pointer">
            {row.getValue("id")}
          </div>
        ),
      },
      {
        accessorKey: "activityType",
        header: "Activity Type",
      },
      {
        accessorKey: "requestedBy",
        header: "Initiated by",
        cell: ({ row }) => {
          const requestedBy = row.getValue(
            "requestedBy"
          ) as Approval["requestedBy"];
          return (
            <div>
              <div className="font-medium">{requestedBy.name}</div>
              <div className="text-sm text-gray-500">{requestedBy.role}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as Approval["status"];
          const statusColorMap = {
            Pending: "bg-yellow-50 text-yellow-800",
            "Pending Deletion": "bg-yellow-50 text-yellow-800",
            Rejected: "bg-red-50 text-red-800",
            Lapsed: "bg-gray-100 text-gray-800",
            Approved: "bg-green-50 text-green-800",
          };

          return (
            <Badge className={`${statusColorMap[status]}`}>{status}</Badge>
          );
        },
      },
      {
        accessorKey: "lastModified",
        header: "Last Modified",
        cell: ({ row }) => {
          const lastModified = row.getValue("lastModified") as string;
          const [date, time] = lastModified.split(/(?<=\d{4})\s/);
          return (
            <div>
              <div>{date}</div>
              <div className="text-sm text-gray-500">{time}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const status = row.getValue("status") as Approval["status"];
          const isPending =
            status === "Pending" || status === "Pending Deletion";

          return (
            <div className="flex gap-2">
              {isPending ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent border border-green-500 rounded-full"
                  >
                    <Check className="h-4 w-4 stroke-green-500 stroke-[1.5px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent border border-red-500 rounded-full"
                  >
                    <X className="h-4 w-4 stroke-red-500 stroke-[1.5px]" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent bg-[#EBF0F5] rounded-full w-8 h-8"
                    disabled
                  >
                    <Check className="h-4 w-4 stroke-[#A2A2A2] stroke-[1.5px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent bg-[#EBF0F5] rounded-full w-8 h-8"
                    disabled
                  >
                    <X className="h-4 w-4 stroke-[#A2A2A2] stroke-[1.5px]" />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  }

  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div
          className="text-red-500 hover:underline cursor-pointer"
          onClick={() => actions.onGoDetail?.(row.original.id)}
        >
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div
          className="text-red-500 hover:underline cursor-pointer"
          onClick={() => actions.onGoDetail?.(row.original.id)}
        >
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Created by",
      cell: ({ row }) => {
        const createdBy = row.getValue("createdBy") as Disclaimer["createdBy"];
        console.log("createdBy", createdBy);
        const firstChar =
          createdBy.split(" ").length === 1
            ? createdBy.split(" ")[0][0]
            : createdBy.split(" ")[0][0] || "";
        const secondChar =
          createdBy.split(" ").length === 1
            ? ""
            : createdBy.split(" ")[1][0] || "";
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={createdBy.avatar} />
              <AvatarFallback>{`${firstChar}${secondChar}`}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{createdBy}</div>
              {/* <div className="text-sm text-gray-500">{createdBy}</div> */}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: "effectivityDate",
      header: "Effectivity Date",
      cell: ({ row }) => (
        <div className="">
          {new Date(row.getValue("effectivityDate")).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "validUntil",
      header: "Valid Until",
      cell: ({ row }) => (
        <div className="">
          {row.getValue("validUntil") === null ||
          (row.getValue("type") == "General" &&
            row.getValue("status") != "Past")
            ? "-"
            : new Date(row.getValue("validUntil")).toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Disclaimer["status"];
        return <Badge className={`${getStatusColor(status)}`}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.getValue("status") as Disclaimer["status"];
        if (status === "Draft" || status === "Scheduled") {
          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent border border-[#FF4647] rounded-full"
                onClick={() => actions.onEdit?.(row.original.id)}
              >
                <Pencil className="h-4 w-4 stroke-[#FF4647] stroke-[1.5px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={
                  status === "Scheduled"
                    ? "hover:bg-transparent bg-[#EBF0F5] rounded-full w-8 h-8"
                    : "hover:bg-transparent border border-[#FF4647] rounded-full"
                }
                disabled={status === "Scheduled"}
                onClick={
                  status === "Scheduled"
                    ? undefined
                    : () => actions.onDelete?.(row.original)
                }
              >
                <Trash2
                  className={
                    status === "Scheduled"
                      ? "h-4 w-4 text-gray-500 stroke-[1.5px]"
                      : "h-4 w-4 stroke-[#FF4647] stroke-[1.5px]"
                  }
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className=" hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500 stroke-[1.5px]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem
                    onClick={() => {
                      actions.onDuplicate?.(row?.original);
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        } else {
          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent bg-[#EBF0F5] rounded-full w-8 h-8"
                disabled
              >
                <Pencil className="h-4 w-4 stroke-[#A2A2A2] stroke-[1.5px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent bg-[#EBF0F5] rounded-full w-8 h-8"
                disabled
              >
                <Trash2 className="h-4 w-4 stroke-[#A2A2A2] stroke-[1.5px]" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent bg-[#EBF0F5] rounded-full w-8 h-8"
                    disabled
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500 stroke-[1.5px]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
      },
    },
  ];
};
