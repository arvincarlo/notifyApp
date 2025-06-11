import { AnimatePresence, motion } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

interface Props {
    searchName?: string;
}

const Search = ({ searchName = "searchTerm" }: Props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

   const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

   useEffect(() => {
       if (debouncedSearchQuery) {
           searchParams.set(searchName, debouncedSearchQuery);
           setSearchParams(searchParams);
       } else {
              searchParams.delete(searchName);
              setSearchParams(searchParams);
       }
   }, [debouncedSearchQuery, searchName, searchParams, setSearchParams]);

   const handleSearch = (query: string) => {
       setSearchQuery(query);
       searchParams.delete("pageNumber");
   };

    return (
        <div className="relative flex items-center justify-end">
            <AnimatePresence>
                {isSearchExpanded && (
                    <motion.div
                        initial={{ width: 0, opacity: 0, x: "100%" }}
                        animate={{ width: "364px", opacity: 1, x: "0%" }}
                        exit={{ width: 0, opacity: 0, x: "100%" }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-10"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        handleSearch("");
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full 
                         text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors z-10 ${isSearchExpanded ? "bg-gray-100" : ""
                    }`}
            >
                <SearchIcon className="h-5 w-5 text-gray-500" />
            </button>
        </div>
    );
};

export default Search;
