import { useState, useEffect } from "react";
import { AccountSection } from "@/services/searchAccountsApi";

export function useAccounts(initialSections: AccountSection[]) {
  const [accountSections, setAccountSections] = useState<AccountSection[]>([]);

  useEffect(() => {
    if (initialSections.length > 0) {
      const sectionsWithChecked = initialSections.map((section) => ({
        ...section,
        accounts: section.accounts.map((account) => ({
          ...account,
        })),
      }));

      setAccountSections(sectionsWithChecked);
    }
  }, [initialSections]);

  const handleCheckboxChange = (sectionId: string, accountId: string) => {
    setAccountSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            accounts: section.accounts.map((account) => {
              if (account.id === accountId) {
                return { ...account, isChecked: !account.isChecked };
              }
              return account;
            }),
          };
        }
        return section;
      })
    );
  };

  return {
    accountSections,
    handleCheckboxChange,
    setAccountSections,
  };
}
