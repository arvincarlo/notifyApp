import { FC, PropsWithChildren, useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export const MsalAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      await msalInstance.initialize();

      await msalInstance.handleRedirectPromise().catch(console.error);

      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }

      setIsInitialized(true);
    };

    initializeMsal();

    const callbackId = msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const account = (event.payload as any).account;
        msalInstance.setActiveAccount(account);
      }
    });

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
    };
  }, []);

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export { msalInstance };
