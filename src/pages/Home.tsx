import MainLayout from "@/components/MainLayout";
import Result from "@/components/Result";
import SearchBar from "@/components/SearchBar";
import { SearchAccountProvider } from "@/context/SearchContext";
import { Toaster } from "sonner";

export const Home = () => {
  return (
    <SearchAccountProvider>
      <MainLayout>
        <SearchBar />
        <Result />

        <Toaster position="top-right" closeButton theme="light" richColors />
      </MainLayout>
    </SearchAccountProvider>
  );
};
