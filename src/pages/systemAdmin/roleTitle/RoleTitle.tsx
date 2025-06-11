import MainLayout from "@/components/MainLayout"
import Search from "@/components/Search"
import { DataTable } from "@/components/ui/data-table"
import { wealthService } from "@/services/wealthService"
import { Pagination, RoleTitleItem } from "@/types/systemAdmin"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import CreateRoleTitle from "./CreateRoleTitle"
import { RoleTitleColumns } from "./RoleTitleColumn"

const RoleTitle = () => {
    const [data, setData] = useState<Pagination<RoleTitleItem>>();
    const [searchParams] = useSearchParams();

    const fetchData = useCallback(async () => {
        const fetchedRoleTitleData = await wealthService.getAllRoleTitles(searchParams);
        setData(fetchedRoleTitleData);
    }, [searchParams])

    const onRoleTitleCreate = () => fetchData();

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <MainLayout isAdmin={true} isSysAdmin={true}>
            <div className="mt-10">
                <DataTable
                    columns={RoleTitleColumns(onRoleTitleCreate)}
                    data={data?.items || []}
                    totalPages={data?.totalPages}
                    pagSize={data?.pageSize}
                >
                    <div className="flex items-center w-full justify-between">
                        <h1 className="text-xl font-semibold text-gray-800">Role Title</h1>
                        <div className="flex items-center gap-2">
                            <Search />
                            <CreateRoleTitle onRoleTitleCreate={onRoleTitleCreate} />
                        </div>
                    </div>
                </DataTable>
            </div>
        </MainLayout>
    )
}

export default RoleTitle