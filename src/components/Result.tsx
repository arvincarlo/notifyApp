import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2, EyeIcon, FileText, X } from "lucide-react";
import { cn, generatePwd, isDateRange } from "@/lib/utils";
import { useSearchAccount } from "@/hooks/useSearchAccounts";
import { useAccounts } from "@/hooks/useAccounts";
import { EmptyState } from "./EmptyState";
import ResultSkeleton from "./ResultSkeleton";
import useExportPDF from "@/hooks/useExportPDF";
import { Report } from "../pages/Report";
import { toast } from "sonner";
import LoadingOverlay from "./LoadingOverlay";
import { CheckedState } from "@radix-ui/react-checkbox";
import { wealthService } from "@/services/wealthService";
import { StorageUtil } from "@/lib/storage";
import { TOKEN_KEY_MASL } from "@/constant/auth";
import axios from "axios";
import Report1 from "@/pages/Report1";
import Report2 from "@/pages/Report2";
import Report3 from "@/pages/Report3";
import Report4 from "@/pages/Report4";
import Report5 from "@/pages/Report5";
import Report6 from "@/pages/Report6";
import Report7 from "@/pages/Report7";
import Report8 from "@/pages/Report8";
import { useAuth } from "@/hooks/useAuth";
import Report10 from "@/pages/Report10";
import Report9 from "@/pages/Report9";
import Appendix from "@/pages/Appendix";
import Report11 from "@/pages/Report11";
import Report12 from "@/pages/Report12";
import Report13 from "@/pages/Report13";
import Report14 from "@/pages/Report14";

interface Page {
  content: React.ReactNode;
}

const FullScreenModal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex flex-col h-full">
        <div className="bg-[#0f0f10] h-12 flex items-center px-4 text-white">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>SOA Preview</span>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute right-2 top-1 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
const Result = () => {
  const { searchResults, loading, searchParams } = useSearchAccount();
  const { accountSections, handleCheckboxChange, setAccountSections } =
    useAccounts(searchResults);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const { user } = useAuth();
  console.log("user", user);

  const { exportToPDF, isExporting } = useExportPDF();
  const [showReport, setShowReport] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([
    "Branch Linked Accounts",
  ]);

  const [activeDisclosures, setActiveDisclosures] = useState<any[]>([]);

  const fetchAllActiveDisclosures = async (selectedMonths) => {
    const data = await wealthService.getAllDisclosures();
    const activeDisclosures = data.filter(
      (disclosure) =>
        isDateRange(
          new Date(disclosure.effectivityDate),
          selectedMonths,
          new Date(disclosure.validUntil)
        ) &&
        (disclosure.status.toLowerCase() == "active" ||
          disclosure.status.toLowerCase() == "past")
    );
    console.log("activeDisclosures", activeDisclosures);
    setActiveDisclosures(
      activeDisclosures.map((disclosure) => disclosure.template)
    );
  };
  useEffect(() => {
    fetchAllActiveDisclosures(searchParams.selectedMonths);
  }, [searchParams.selectedMonths]);

  const getDefaultOpenSections = (accountSections: any) => {
    if (userInteracted) return openSections;

    const titles = accountSections
      .filter((section) =>
        section.accounts.some((account) => account.isChecked)
      )
      .map((section) => section.title);
    return titles;
  };

  useEffect(() => {
    if (!userInteracted) {
      setOpenSections(getDefaultOpenSections(accountSections));
    }
  }, [accountSections, userInteracted]);

  const handleGenerateReport = async () => {
    const token = StorageUtil.get("user");
    if (!token) {
      console.error("Token is null");
      return;
    }
    // const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("accountSections", accountSections);
    const selectedAccounts = accountSections
      .flatMap((section) =>
        section.accounts
          .filter((account) => account.isChecked === true)
          .map((account) => `${account.accountNumber}.${account.accountName}`)
      )
      .join(",");
    console.log("searchParams", searchParams);
    const createActivityBody = {
      userId: token,
      cifNumber: searchParams.cif,
      customerName: searchParams.customerName || searchParams.clientName,
      dateCovered: new Date().toISOString(),
      accountsSelected: selectedAccounts,
      monthsSelected: searchParams.selectedMonths.join(","),
    };

    console.log("createActivityBody", createActivityBody);

    try {
      const data = await wealthService.createActivity(createActivityBody);
      if (data) {
        toast.success("Activity created successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        toast.error(error.message);
        console.error("Stack trace:", error.stack);
      } else if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
        console.error("Status text:", error.response?.statusText);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }

    const counts = searchParams.selectedMonths.length;

    for (let i = 0; i < counts; i++) {
      const dates = searchParams.selectedMonths[i];
      const month = dates.split(".")[0];
      const year = dates.split(".")[1];
      console.log("month", month);
      console.log("year", year);

      const pages: Page[] = [
        {
          content: (
            <Report
              month={month.split(".")[0]}
              year={month.split(".")[1]}
              accountName={searchParams.customerName || ""}
              unitTrustsValue={searchParams.unitTrustsValue}
              structuredProductsValue={searchParams.structuredProductsValue}
              equitiesValue={searchParams.equitiesValue}
              fixedIncomeValue={searchParams.fixedIncomeValue}
              moneyMarketValue={searchParams.moneyMarketValue}
            />
          ),
        },
        {
          content: <Report1 print={true} />,
        },
        {
          content: <Report2 print={true} />,
        },
        {
          content: <Report3 print={true} />,
        },
        {
          content: <Report4 print={true} />,
        },
        {
          content: <Report5 print={true} />,
        },
        {
          content: <Report6 print={true} />,
        },
        {
          content: <Report7 print={true} />,
        },
        {
          content: <Report8 print={true} />,
        },
        {
          content: <Report9 print={true} />,
        },
        {
          content: <Report10 print={true} />,
        },
        {
          content: <Report11 print={true} />,
        },
        {
          content: <Report12 print={true} />,
        },
        {
          content: <Report13 print={true} />,
        },
        {
          content: <Report14 print={true} />,
        },
        {
          content: (
            <Appendix
              print={true}
              content={activeDisclosures.join("<p class='mb-4'></p>")}
            />
          ),
        },
      ];
      const success = await exportToPDF(
        pages,
        searchParams.selectedMonths[i],
        searchParams.middleName,
        searchParams?.customerName?.split(" ")[1] || "",
        month,
        year
      );
      if (success) {
        toast.custom(
          () => (
            <div className="relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-w-[320px]">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">
                  Report has been generated
                </h3>
                <p className="text-gray-500">
                  Report has been generated into your device
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.dismiss()}
                className="z-100000 absolute right-2 top-2 p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Close notification"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ),
          {
            duration: 5000,
            position: "top-right",
          }
        );
      }
    }
  };

  const handlePreviewReport = () => {
    setShowReport(true);
  };

  const isButtonActive = useMemo(() => {
    return accountSections.some((section) =>
      section.accounts.some((account) => account.isChecked)
    );
  }, [accountSections]);

  const emptyAccounts = useMemo(() => {
    return searchResults.every((section) => section.accounts.length === 0);
  }, [searchResults]);

  if (loading) {
    return <ResultSkeleton />;
  }
  console.log("searchResults", searchResults);

  if (searchResults.length === 0 || emptyAccounts) {
    return <EmptyState />;
  }

  return (
    <div className="relative">
      <LoadingOverlay isLoading={isExporting} />
      <div className="absolute right-4 top-4 flex gap-2">
        <Button
          className={cn(
            "font-medium flex items-center gap-2",
            "bg-white text-[#DE4138] border border-[#DE4138] hover:bg-[#DE4138]/5",
            "rounded-[50px] px-4 py-2"
          )}
          disabled={!isButtonActive}
          onClick={handlePreviewReport}
          variant="secondary"
        >
          <EyeIcon className="h-5 w-5" />
          Preview SOA
        </Button>
        <Button
          className={cn(
            "font-medium px-4 py-2 rounded-[50px] flex items-center gap-2",
            isButtonActive && "bg-[#E94E51] hover:bg-[#D43134] text-white"
          )}
          disabled={!isButtonActive}
          onClick={handleGenerateReport}
          variant="secondary"
        >
          <FileText className="h-5 w-5" />
          Generate SOA
        </Button>
      </div>

      <Card className="mt-16">
        <CardContent className="pt-10 pl-8 mt-6">
          <Accordion
            type="multiple"
            value={
              openSections.length === 0 && !userInteracted
                ? ["Branch Linked Accounts"]
                : openSections
            }
            onValueChange={(value) => {
              setUserInteracted(true);
              setOpenSections(value);
            }}
          >
            {accountSections.map(
              (section) =>
                section.accounts.length > 0 && (
                  <AccordionItem key={section.id} value={section.title}>
                    <AccordionTrigger className="px-6 hover:no-underline bg-[#F3F6F9]">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="relative">
                        <div className="border-t border-gray-100 w-[50%]">
                          <div className="grid grid-cols-3 px-6 py-3 ml-2">
                            <div className="flex items-center gap-1">
                              <Checkbox
                                checked={
                                  section.accounts.every(
                                    (account) => account.isChecked
                                  ) && section.accounts.length > 0
                                }
                                onCheckedChange={(checked) => {
                                  setAccountSections((prevSections) =>
                                    prevSections.map((s) => {
                                      if (s.id === section.id) {
                                        return {
                                          ...s,
                                          accounts: s.accounts.map(
                                            (account) => ({
                                              ...account,
                                              isChecked: !!checked,
                                            })
                                          ),
                                        };
                                      }
                                      return s;
                                    })
                                  );
                                }}
                                className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                              />
                              <span>Account Number</span>
                            </div>
                            <div>Account Name</div>
                            {section.id === "branch" && <div>Relationship</div>}
                          </div>
                          <hr className="absolute left-0 right-0 border-gray-200" />
                          {section.accounts.map((account) => {
                            return (
                              <div
                                key={account.id}
                                className="grid grid-cols-3 px-6 py-3 hover:bg-gray-50 ml-2"
                              >
                                <div className="flex items-center gap-1">
                                  <Checkbox
                                    checked={account.isChecked as CheckedState}
                                    onCheckedChange={() =>
                                      handleCheckboxChange(
                                        section.id,
                                        account.id
                                      )
                                    }
                                    className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                                  />
                                  <span>{account.referenceNumber}</span>
                                </div>
                                <div>{account.accountName}</div>
                                {section.id === "branch" && (
                                  <div>{account.relationship}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
            )}
          </Accordion>
        </CardContent>
      </Card>
      <FullScreenModal isOpen={showReport} onClose={() => setShowReport(false)}>
        {searchParams.selectedMonths.map((month, index) => (
          <>
            <Report
              key={`${month}-${index}`}
              month={month.split(".")[0]}
              year={month.split(".")[1]}
              accountName={searchParams.customerName || ""}
              unitTrustsValue={searchParams.unitTrustsValue}
              structuredProductsValue={searchParams.structuredProductsValue}
              equitiesValue={searchParams.equitiesValue}
              fixedIncomeValue={searchParams.fixedIncomeValue}
              moneyMarketValue={searchParams.moneyMarketValue}
            />
            {/* <Report1 print={false} /> */}
            {/*<Report2 />
             <Report3 />
            <Report4 />
            <Report5 />
            <Report6 />
            <Report7 />
            <Report10 />
            <Report9 />
            <Report11 />
            <Report12 />
            <Report13 />
            <Report14 />
            <Appendix /> */}
          </>
        ))}
      </FullScreenModal>
    </div>
  );
};

export default Result;
