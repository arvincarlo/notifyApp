import { SearchContext } from "@/context/SearchContext";
import { useContext } from "react";

export function useSearchAccount() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchAccount must be used within a SearchProvider");
  }
  return context;
}
