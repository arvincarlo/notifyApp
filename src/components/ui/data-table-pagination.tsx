import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface Props {
    totalPages: number;
}

export function DataTablePagination({ totalPages }: Props) {
    const [paginationSize, setPaginationSize] = useState("10");
    const [current, setCurrent] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("pageNumber") !== null) {
            setCurrent(parseInt(searchParams.get("pageNumber")!))
        }
        if (searchParams.get("pageSize") !== null) {
            setPaginationSize(searchParams.get("pageSize")!)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (searchParams.get("searchTerm")) setCurrent(1)
        if (searchParams.get("pageNumber") === null) {
            setCurrent(1)
        } else {
            setCurrent(parseInt(searchParams.get("pageNumber")!))
        }
        if (searchParams.get("pageSize") === null) {
            setPaginationSize("10")
        } else {
            setPaginationSize(searchParams.get("pageSize")!)
        }
    }, [searchParams])

    const handlePaginationChange = (page: number) => {
        if (page) {
            if (page < 1) page = 1
            searchParams.set("pageNumber", page.toString());
            setCurrent(page)
        } else {
            searchParams.delete("pageNumber")
            setCurrent(1)
        }
        setSearchParams(searchParams)
    }

    const handlePageSizeChange = (size: string) => {
        setPaginationSize(size)
        if (size) {
            searchParams.set("pageSize", size);
            searchParams.set("pageNumber", "1");
            setCurrent(1)
        } else {
            searchParams.delete("pageSize")
        }
        setSearchParams(searchParams)
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mt-5">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Display</p>
                    <Select
                        value={paginationSize}
                        onValueChange={(value) => {
                            handlePageSizeChange(value)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={paginationSize} />
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

                <Pagination className="w-min mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            {current > 2 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handlePaginationChange(1)}
                                    className="hover:bg-red-50 disabled:hover:bg-transparent"
                                >
                                    <ChevronsLeft
                                        className="text-red-500 hover:text-red-700"
                                    />
                                </Button>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            {current > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handlePaginationChange(current - 1)}
                                    className="hover:bg-red-50 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft
                                        className="text-red-500 hover:text-red-700"
                                    />
                                </Button>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            {current > 2 && (
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handlePaginationChange(current - 2)}
                                >
                                    {current - 2}
                                </Button>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            {current > 1 && (
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handlePaginationChange(current - 1)}
                                >
                                    {current - 1}
                                </Button>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink className="bg-red-50 text-red-700" isActive>
                                {current}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            {current < totalPages && (
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handlePaginationChange(current + 1)}
                                >
                                    {current + 1}
                                </Button>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            {current + 1 < totalPages && (
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handlePaginationChange(current + 2)}
                                >
                                    {current + 2}
                                </Button>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            {current !== totalPages && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handlePaginationChange(current + 1)}
                                    className="hover:bg-red-50 disabled:hover:bg-transparent"
                                >
                                    <ChevronRight
                                        className="text-red-500 hover:text-red-700"
                                    />
                                </Button>
                            )}
                        </PaginationItem>
                        <PaginationItem>
                            {current + 1 < totalPages && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handlePaginationChange(totalPages)}
                                    className="hover:bg-red-50 disabled:hover:bg-transparent"
                                >
                                    <ChevronsRight
                                        className="text-red-500 hover:text-red-700"
                                    />
                                </Button>
                            )}
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    )
}
