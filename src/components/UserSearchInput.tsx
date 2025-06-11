import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Loader2, SearchIcon, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HighlightText } from "./SearchInput";

type User = {
  id: string;
  name: string;
  avatar?: string;
};

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (user: User) => void;
  users: User[];
  minWidth?: number;
  maxWidth?: number;
}

const ITEMS_PER_PAGE = 10;

const UserSearchInput = ({
  value,
  onChange,
  onSelect,
  users,
  minWidth = 250,
  maxWidth = 400,
}: UserSearchProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const ALL_USERS_OPTION: User = {
    id: "all-users",
    name: "All Users",
  };

  const calculateContentWidth = useCallback((users: User[]) => {
    if (!measureRef.current) return 0;

    const measureElement = document.createElement("div");
    measureElement.style.position = "absolute";
    measureElement.style.visibility = "hidden";
    measureElement.style.whiteSpace = "nowrap";
    measureElement.style.padding = "0.75rem"; // p-3
    measureElement.style.display = "flex";
    measureElement.style.alignItems = "center";
    measureElement.style.gap = "0.5rem"; // gap-2

    document.body.appendChild(measureElement);

    const widths = users.map((user) => {
      measureElement.innerHTML = `
          <div style="width: 2rem; height: 2rem; flex-shrink: 0;"></div>
          <div>${user.name}</div>
        `;
      return measureElement.offsetWidth;
    });

    document.body.removeChild(measureElement);

    return Math.max(...widths) + 32;
  }, []);

  const loadMoreItems = useCallback(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredUsers.slice(startIndex, endIndex);

    setDisplayedUsers((prev) => [...prev, ...newItems]);
    setHasMore(endIndex < filteredUsers.length);
    setPage((prev) => prev + 1);
  }, [page, filteredUsers]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      // 50px threshold
      loadMoreItems();
    }
  }, [hasMore, loadMoreItems]);

  const getInitials = (name: string) => {
    if (name === "All Users") return "AU";
    const parts = name.split(" ");
    return (
      parts[0]?.charAt(0)?.toUpperCase() +
      (parts[1]?.charAt(0)?.toUpperCase() || "")
    );
  };

  const updateDropdownPosition = useCallback(() => {
    if (!inputRef.current || !dropdownRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = Math.min(
      300,
      window.innerHeight - inputRect.bottom - 10
    );

    const contentWidth = calculateContentWidth(filteredUsers);

    const width = Math.max(
      Math.min(Math.max(contentWidth, inputRect.width), maxWidth),
      minWidth
    );

    let left = inputRect.left;
    const rightEdge = left + width;
    if (rightEdge > window.innerWidth) {
      left = Math.max(0, window.innerWidth - width);
    }

    dropdownRef.current.style.position = "fixed";
    dropdownRef.current.style.top = `${inputRect.bottom + 4}px`;
    dropdownRef.current.style.left = `${left}px`;
    dropdownRef.current.style.width = `${width}px`;
    dropdownRef.current.style.maxHeight = `${dropdownHeight}px`;
  }, [filteredUsers, minWidth, maxWidth]);

  const handleSearch = (searchValue: string) => {
    onChange(searchValue);
    setIsLoading(true);

    requestAnimationFrame(() => {
      const filtered = searchValue
        ? [ALL_USERS_OPTION].concat(
            users.filter((user) =>
              user.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          )
        : [];

      setFilteredUsers(filtered);
      setDisplayedUsers(filtered.slice(0, ITEMS_PER_PAGE));
      setShowDropdown(!!searchValue);
      setIsLoading(false);
      setPage(2);
      setHasMore(filtered.length > ITEMS_PER_PAGE);
      updateDropdownPosition();
    });
  };

  const handleSelect = (user: User) => {
    onSelect?.(user);
    onChange(user.name);
    setShowDropdown(false);
    setFilteredUsers([]);
    setDisplayedUsers([]);
    setPage(1);
  };

  const handleClear = () => {
    onChange("All Users");
    onSelect?.(ALL_USERS_OPTION);
    setShowDropdown(false);
    setFilteredUsers([]);
    setDisplayedUsers([]);
    setPage(1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (showDropdown) {
      const handleScrollEvent = () =>
        requestAnimationFrame(updateDropdownPosition);
      const handleResize = () => requestAnimationFrame(updateDropdownPosition);
      const handleClickOutside = (e: MouseEvent) => {
        if (
          !containerRef.current?.contains(e.target as Node) &&
          !dropdownRef.current?.contains(e.target as Node)
        ) {
          setShowDropdown(false);
        }
      };

      updateDropdownPosition();
      window.addEventListener("scroll", handleScrollEvent, true);
      window.addEventListener("resize", handleResize);
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("scroll", handleScrollEvent, true);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]);

  const Dropdown = () => (
    <>
      <div ref={measureRef} className="hidden" />
      <div
        ref={dropdownRef}
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col z-50"
      >
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="text-xs font-semibold text-gray-500 p-3">
            USERS ({filteredUsers.length})
          </div>
        </div>

        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1"
          onScroll={handleScroll}
        >
          {displayedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(user)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="min-w-0 flex-1 truncate">
                <HighlightText text={user.name} highlight={value} />
              </div>
            </div>
          ))}
          {displayedUsers.length === 0 && (
            <div className="text-sm text-gray-500 p-3">No results found</div>
          )}
          {hasMore && (
            <div className="p-3 text-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              Loading more...
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-[400px]">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="pl-10 pr-10 bg-white"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
          ) : (
            <SearchIcon className="h-4 w-4 text-gray-500" />
          )}
        </div>
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {showDropdown && createPortal(<Dropdown />, document.body)}
    </div>
  );
};

export default UserSearchInput;
