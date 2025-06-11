import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { DisclaimForm } from "@/components/DisclaimForm";
import MainLayout from "@/components/MainLayout";
import { useState } from "react";

import { useLocation, useParams } from "react-router-dom";
import { Eye } from "lucide-react";

export const DisclaimerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  console.log("state", state);
  return (
    <MainLayout isAdmin={true} isApproval={false} isAudit={true}>
      <div className="p-6 bg-white">
        <CustomBreadcrumb
          variant="top"
          items={[
            { label: "Disclosures", href: "/admin" },
            { label: `${id && !state.isCopy ? "edit" : "Add New"} Disclosure` },
          ]}
        />

        <CustomBreadcrumb
          variant="back"
          items={[{ label: "Disclosures", href: "/admin" }]}
        />

        <h1 className="text-2xl font-semibold capitalize" id="formTitle">
          {id && !state.isCopy ? "Edit" : "Add New"} Disclosure
        </h1>

        <DisclaimForm
          toEditClaimer={state?.toEditDisclaimer}
          isEdit={state.isEdit}
          data={state.data}
          type={state.type}
          isCopy={state.isCopy}
        />
      </div>
    </MainLayout>
  );
};
