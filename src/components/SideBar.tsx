import { User, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Assignment from "../assets/assignment.svg?react";
import Chart from "../assets/chart.svg?react";
import Done from "../assets/done.svg?react";
import History from "../assets/history.svg?react";
import Settings from "../assets/settings.svg?react";
import ActivityHistory from "./ActivityHistory";
import SideBarItem from "./SideBarItem";

// const menuItems = [
//   {
//     id: "statement",
//     icon: <Chart className="h-5 w-5" />,
//     label: "Statement Generator",
//   },
//   {
//     id: "activity",
//     icon: <History className="h-5 w-5" />,
//     label: "Activity History",
//   },
// ];
type MenuItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  url?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type SideBarProps = {
  isAdmin?: boolean;
  isApproval?: boolean;
  isAudit?: boolean;
  isSysAdmin?: boolean;
};

const pathToMenuItem: Record<string, string> = {
  "/admin": "disclaimer",
  "/parameter": "parameter",
  "/statement": "statement",
  "/audit": "audit",
  "/users-maintenance": "users-maintenance",
  "/role-title": "role-title"
};

const menuItemToPath: Record<string, string> = {
  disclaimer: "/admin",
  parameter: "/parameter",
  statement: "/statement",
};

const SideBar = ({
  isAdmin = false,
  isApproval = false,
  isAudit = false,
  isSysAdmin = false,
}: SideBarProps) => {
  const [activeItem, setActiveItem] = useState(
    isAdmin ? (isAdmin ? "approvals" : "disclaimer") : "statement"
  );
  const [showActivity, setShowActivity] = useState(false);
  const navigate = useNavigate();
  const getMenuSections = (isAdmin: boolean, isApproval: boolean, isAudit: boolean, isSysAdmin: boolean) => {
    if (!isAdmin) {
      return [
        {
          title: "PORTFOLIO MANAGEMENT",
          items: [
            {
              id: "statement",
              icon: <Chart className="h-5 w-5" />,
              label: "Statement Generator",
            },
            {
              id: "activity",
              icon: <History className="h-5 w-5" />,
              label: "Activity History",
            },
          ],
        },
      ];
    } else {
      if (isApproval && isAudit) {
        return [
          {
            title: "WORKFLOW OVERSIGHT",
            items: [
              {
                id: "approvals",
                icon: <Done className="h-5 w-5" />,
                label: "Approvals",
                url: "/approval",
              },
              {
                id: "audit",
                icon: <Assignment className="h-5 w-5" />,
                label: "Audit Logs",
                url: "/auditinapproval",
              },
            ],
          },
        ];
      }

      if (isSysAdmin) {
        return [
          {
            title: "USER MANAGEMENT",
            items: [
              {
                id: "users-maintenance",
                icon: <User className="h-5 w-5" />,
                label: "Users Maintenance",
                url: "/users-maintenance",
              },
              {
                id: "role-title",
                icon: <UserCog className="h-5 w-5" />,
                label: "Role Title",
                url: "/role-title",
              },
            ],
          },
        ]
      }

      if (!isApproval && isAudit) {
        return [
          {
            title: "WORKFLOW OVERSIGHT",
            items: [
              {
                id: "audit",
                icon: <Assignment className="h-5 w-5" />,
                label: "Audit Logs",
                url: "/audit",
              },
            ],
          },
          {
            title: "SETTINGS",
            items: [
              {
                id: "parameter",
                icon: <Settings className="h-5 w-5" />,
                label: "Parameter  Maintenance",
                url: "/parameter",
              },
              {
                id: "disclaimer",
                icon: <Assignment className="h-5 w-5" />,
                label: "Disclosure",
                url: "/admin",
              },
            ],
          },
        ];
      }
    }
    return [];
  };
  const menuSections: MenuSection[] = getMenuSections(
    isAdmin,
    isApproval,
    isAudit,
    isSysAdmin
  );

  useEffect(() => {
    const matchingPath = Object.keys(pathToMenuItem).find((path) =>
      location.pathname.includes(path)
    );

    if (matchingPath) {
      setActiveItem(pathToMenuItem[matchingPath]);
    }
  }, [location.pathname]);

  const handleItemClick = (itemId: string) => {
    console.log("itemId", itemId);
    setActiveItem(itemId);

    if (["parameter", "disclaimer", "audit", "approvals", "users-maintenance", "role-title"].includes(itemId)) {
      const url = menuSections.reduce<string | undefined>(
        (url, section) =>
          url || section.items.find((item) => item.id === itemId)?.url,
        undefined
      );
      console.log("url", url);
      if (url) {
        navigate(url);
      }
    }
    if (itemId === "activity") {
      setShowActivity(true);
    }
  };

  return (
    <>
      <aside className="w-64 border-r border-[#E5E7EB]">
        <div className="mt-3 p-4">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-8">
              <div className="text-sm font-medium text-gray-500">
                {section.title}
              </div>
              <div className="mt-4 space-y-1">
                {section.items.map((item) => (
                  <SideBarItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => handleItemClick(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
      {!isAdmin && (
        <ActivityHistory
          open={showActivity}
          onClose={() => setShowActivity(false)}
        />
      )}
    </>
  );
};

export default SideBar;
