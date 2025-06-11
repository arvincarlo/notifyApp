import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card } from "./card"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  children?: React.ReactNode
  showFilter?: boolean
  totalPages?: number
  pagSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  showFilter,
  totalPages = 1,
  pagSize = 10
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const hasSorting = ["fullName"]
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pagSize,
      }
    }
  })

  useEffect(() => {
    table.setPageSize(pagSize || 10)
  }, [pagSize, table])

  const handleSortingChange = (field: string) => {
    const currentSort = searchParams.get(field)
    searchParams.set(field, currentSort === "desc" ? "asc" : "desc")
    setSearchParams(searchParams)
  }

  return (
    <>
      <div className={cn("flex items-center", showFilter ? "mb-20" : "mb-0")}>
        {children}
        <DataTableViewOptions table={table} />
      </div>
      <Card className="p-10 mt-4">
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-secondary">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          onClick={() =>
                            hasSorting.includes(header.id) && handleSortingChange(header.id)}
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-2">
            <DataTablePagination totalPages={totalPages} />
          </div>
        </div>
      </Card>
    </>
  )
}
