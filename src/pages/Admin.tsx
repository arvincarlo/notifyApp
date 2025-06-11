import { DisClaimer } from "@/components/DisClaimer";
import MainLayout from "@/components/MainLayout";

export const Admin = () => {
  return (
    <>
      <MainLayout isAdmin={true} isApproval={false} isAudit={true}>
        <DisClaimer />
      </MainLayout>
    </>
  );
};
