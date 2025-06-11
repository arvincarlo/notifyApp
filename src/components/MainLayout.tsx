import React from "react";
import SideBar from "./SideBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Navbar } from "./Navbar";

interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isAdmin?: boolean;
  isApproval?: boolean;
  isAudit?: boolean;
  isSysAdmin?: boolean;
}

const MainLayout = React.forwardRef<HTMLDivElement, MainLayoutProps>(
  ({ children, isAdmin = false, isApproval = false, isAudit = false, isSysAdmin = false }, ref) => {
    return (
      <div ref={ref} className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex flex-1">
          <div className="hidden lg:block  border-r bg-[#F6F7F9]">
            <SideBar
              isAdmin={isAdmin}
              isApproval={isApproval}
              isAudit={isAudit}
              isSysAdmin={isSysAdmin}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed left-4 top-[4rem] z-40"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-[#F6F7F9]">
              <SideBar
                isAdmin={isAdmin}
                isApproval={isApproval}
                isAudit={isAudit}
                isSysAdmin={isSysAdmin}
              />
            </SheetContent>
          </Sheet>

          <main className="flex-1 overflow-y-auto bg-white">
            <div className="mx-auto p-4 lg:p-6">{children}</div>
          </main>
        </div>
      </div>
    );
  }
);

export default MainLayout;
