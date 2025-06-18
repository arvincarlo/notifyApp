import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
  UserPen
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import Notifications from "./Notifications";

export const Navbar = () => {
  const { user, logout } = useAuth();
  console.log(user);
  const ShortName = useMemo(() => {
    return user
      ? user?.name[0].toLocaleUpperCase() + user?.name[1].toLocaleUpperCase()
      : "";
    // return user?.name[0] + user?.name[1];
  }, [user?.name]);

  return (
    <div className="h-14 sm:h-16">
      <header className="fixed top-0 left-0 right-0 w-full bg-white border-b shadow-md z-50">
        <div className="px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link to={"/"} className="h-full flex items-center p-1">
            <img
              src="/images/logo.svg"
              alt="Chinabank"
              className="w-36 object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Notifications/>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm">{ShortName}</span>
              </div>

              <div className="hidden sm:block">
                <div className="font-medium text-sm sm:text-base">
                  {user?.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Last login: {format(new Date(), "HH:mm, MMM dd")}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 sm:p-2 focus:outline-none">
                  <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="sm:hidden">
                    <BellIcon className="h-4 w-4 mr-2" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {user?.name !== "null null" ? (
                      <UserIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <UserPen className="h-4 w-4 mr-2" />
                    )}
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon className="h-4 w-4 mr-2 cursor-pointer" />
                    <span className="cursor-pointer">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
