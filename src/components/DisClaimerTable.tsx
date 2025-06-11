import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createColumns, Disclaimer } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TableActions {
  onEdit?: (id: string) => void;
  onDelete?: (id: Disclaimer) => void;
  onTitleClick?: (id: string) => void;
  onGoDetail?: (id: string) => void;
  onDuplicate?: (item: Disclaimer) => void;
  onOpenAuditLog?: (item: any) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: TableActions;
  isApproval?: boolean;
  isAuditLog?: boolean;
}

function DisClaimerTable<TData, TValue>({
  columns,
  data,
  actions,
  isApproval = false,
  isAuditLog = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: actions
      ? (createColumns(actions, isApproval, isAuditLog) as ColumnDef<
          TData,
          TValue
        >[])
      : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#F8F9FC]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Display</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">results</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="hover:bg-red-50 disabled:hover:bg-transparent"
          >
            <ChevronsLeft
              className={cn(
                "h-4 w-4",
                !table.getCanPreviousPage()
                  ? "text-gray-300"
                  : "text-red-500 hover:text-red-700"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="hover:bg-red-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4",
                !table.getCanPreviousPage()
                  ? "text-gray-300"
                  : "text-red-500 hover:text-red-700"
              )}
            />
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === table.getPageCount() ||
                Math.abs(page - (table.getState().pagination.pageIndex + 1)) <=
                  2
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-300"
                    disabled
                  >
                    ...
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 p-0",
                    table.getState().pagination.pageIndex + 1 === page
                      ? "bg-red-50 text-red-700"
                      : "text-red-500 hover:bg-red-50 hover:text-red-700"
                  )}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="hover:bg-red-50 disabled:hover:bg-transparent"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4",
                !table.getCanNextPage()
                  ? "text-gray-300"
                  : "text-red-500 hover:text-red-700"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="hover:bg-red-50 disabled:hover:bg-transparent"
          >
            <ChevronsRight
              className={cn(
                "h-4 w-4",
                !table.getCanNextPage()
                  ? "text-gray-300"
                  : "text-red-500 hover:text-red-700"
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DisClaimerTable;
