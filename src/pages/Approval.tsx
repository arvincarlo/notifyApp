import Approvals from "@/components/Approvals";
import MainLayout from "@/components/MainLayout";

export default function Approval() {
  return (
    <MainLayout isAdmin={true} isApproval={true} isAudit={true}>
      <Approvals />
    </MainLayout>
  );
}
