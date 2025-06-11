import MainLayout from "@/components/MainLayout";
import { SearchAccountProvider } from "@/context/SearchContext";
import { wealthService } from "@/services/wealthService";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";

const ApiRes = () => {
  interface WealthData {
    userName: string;
    firstName: string;
    emailAddress: string;
  }

  const { isAuthenticatedMSAL, msalTokenReady } = useAuth();

  const [dataTable, setDataTable] = useState<WealthData[]>([]);

  const fetchWealthData = async () => {
    try {
      const data = await wealthService.getWealthData();
      setDataTable(data);
    } catch (error) {
      console.error("Error fetching wealth data:", error);
    }
  };
  useEffect(() => {
    if (isAuthenticatedMSAL && msalTokenReady) {
      fetchWealthData();
    }
    //   fetchWealthData();
  }, [isAuthenticatedMSAL, msalTokenReady]);
  return (
    <SearchAccountProvider>
      <MainLayout>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataTable.map((data) => (
              <TableRow key={data.userName}>
                <TableCell>{data.userName}</TableCell>
                <TableCell>{data.firstName}</TableCell>
                <TableCell>{data.emailAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </MainLayout>
    </SearchAccountProvider>
  );
};

export default ApiRes;
