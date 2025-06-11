import DisclaimDetail from "@/components/DisclaimDetail";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";
import { Admin } from "@/pages/Admin";
import Approval from "@/pages/Approval";
import { AuditLogs } from "@/pages/AuditLogs";
import Callback from "@/pages/Callback";
import { DisclaimerEdit } from "@/pages/DisclaimerEdit";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Parameter } from "@/pages/Parameter";
import { Unauthorized } from "@/pages/Unauthorized";
import RoleTitle from "@/pages/systemAdmin/roleTitle/RoleTitle";
import UserMaintenance from "@/pages/systemAdmin/userManagement/UsersMaintenance";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  auth?: boolean;
  roles?: string[];
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <RoleBasedRedirect />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
    auth: true,
    roles: [
      "maker",
      "Admin,Checker",
      "Member",
      "member",
      "Admin,Maker",
      "Checker",
      "ClusterHead",
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    auth: true,
    roles: ["maker", "Admin,Maker"],
  },
  {
    path: "/admin/add",
    element: <DisclaimerEdit />,
    auth: true,
    roles: ["maker", "Admin,Maker"],
  },
  {
    path: "/admin/edit/:id",
    element: <DisclaimerEdit />,
    auth: true,
    roles: ["maker", "Admin,Maker"],
  },
  {
    path: "/admin/disclaim/:id",
    element: <DisclaimDetail />,
    auth: true,
    roles: ["maker", "Admin,Maker"],
  },
  {
    path: "/parameter",
    element: <Parameter />,
    auth: true,
    roles: ["maker", "Admin,Maker"],
  },
  {
    path: "/users-maintenance",
    element: <UserMaintenance />,
    auth: true,
    roles: ["SysAdmin,Maker", "SysAdmin,Checker"],
  },
  {
    path: "/role-title",
    element: <RoleTitle />,
    auth: true,
    roles: ["SysAdmin,Maker"],
  },
  {
    path: "/approval",
    element: <Approval />,
    auth: true,
    roles: ["checker", "maker", "Admin,Maker", "Admin,Checker"],
  },
  {
    path: "audit",
    element: <AuditLogs />,
    auth: true,
    roles: ["checker", "maker", "Admin,Maker"],
  },
  {
    path: "auditinapproval",
    element: <AuditLogs />,
    roles: ["checker", "maker", "Admin,Maker"],
  },
  {
    path: "/callback",
    element: <Callback />,
    auth: false,
  },
  {
    path: "/Unauthorized",
    element: <Unauthorized />,
    auth: true,
  },
];
