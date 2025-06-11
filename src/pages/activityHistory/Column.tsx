import { ColumnDef } from "@tanstack/react-table"

export type ActivityHistory = {
    id: string;
    user: string;
    activity: string;
    date: string;
}

export const ActivityColumns: ColumnDef<ActivityHistory>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "user",
        header: "User",
    },
    {
        accessorKey: "activity",
        header: "Activity",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
]
