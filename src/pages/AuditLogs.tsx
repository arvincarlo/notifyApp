import AuditLogTable from "@/components/AuditLogTable";
import MainLayout from "@/components/MainLayout";
import { useLocation } from "react-router-dom";

export const AuditLogs = () => {
  const location = useLocation();
  console.log(location);
  const isApproval = location.pathname === "/auditinapproval";
  return (
    <MainLayout isAdmin={true} isApproval={isApproval} isAudit={true}>
      <AuditLogTable />
    </MainLayout>
  );
};
