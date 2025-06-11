import { SearchBarState } from "@/components/SearchBar";
import axios from "axios";
export interface Account {
  referenceNumber?: string;
  relationship?: string;
  isChecked: unknown;
  id: string;
  accountNumber: string;
  accountName: string;
}

export interface AccountSection {
  id: string;
  title: string;
  accounts: Account[];
}
export const searchAccountsApi = async (
  params: SearchBarState
): Promise<AccountSection[]> => {
  const { data } = await axios.post("/api/search", {
    clientName: params.clientName,
    // startDate: params.dateRange?.from?.toISOString(),
    // endDate: params.dateRange?.to?.toISOString(),
  });
  return data;
};
