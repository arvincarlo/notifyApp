import { apiRequest, graphConfig, loginRequest } from "@/config/authConfig";
import {
  TOKEN_EXPIRES_SECONDS,
  TOKEN_KEY,
  TOKEN_KEY_MASL,
  USER_KEY,
} from "@/constant/auth";
import { StorageUtil } from "@/lib/storage";
import { clearAllCookies, clearAllSiteData } from "@/lib/utils";
import { mockLoginAPI } from "@/services/mockLoginApi";
import { wealthService } from "@/services/wealthService";
import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  username: string;
  name: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string;
  isAuthenticatedMSAL: boolean;
  handleMsalLogin: () => void;
  msalTokenReady: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { instance, accounts } = useMsal();
  const isAuthenticatedMSAL = useIsAuthenticated();
  const navigate = useNavigate();

  const initialized = useRef(false);
  const graphDataFetched = useRef(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = StorageUtil.get("user");
    return !!token;
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const user = StorageUtil.get(USER_KEY);
    return user ? JSON.parse(user) : null;
  });
  const [error, setError] = useState("");
  const logoutTimer = useRef<NodeJS.Timeout>();
  const [msalAccount, setMsalAccount] = useState<AccountInfo | null>(null);
  const [msalTokenReady, setMsalTokenReady] = useState(false);

  const setAutoLogout = useCallback((expiresInSeconds: number) => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    logoutTimer.current = setTimeout(() => {
      logout();
    }, expiresInSeconds * 1000);
  }, []);

  useEffect(() => {
    if (accounts.length > 0 && !msalAccount) {
      setMsalAccount(accounts[0]);
    } else if (accounts.length === 0 && msalAccount) {
      setMsalAccount(null);
    }
  }, [accounts, msalAccount]);

  // useEffect(() => {
  //   if (initialized.current) return;

  //   const initAuth = async () => {
  //     try {
  //       const token = StorageUtil.get("user");
  //       if (token) {
  //         setIsAuthenticated(true);
  //       }

  //       // const token = StorageUtil.get(TOKEN_KEY);
  //       // if (token) {
  //       //   const expiry = StorageUtil.getExpiry(TOKEN_KEY);
  //       //   if (expiry) {
  //       //     const now = new Date().getTime();
  //       //     const expiresInSeconds = Math.floor(
  //       //       (expiry.getTime() - now) / 1000
  //       //     );

  //       //     if (expiresInSeconds > 0) {
  //       //       setIsAuthenticated(true);
  //       //       setAutoLogout(expiresInSeconds);
  //       //     } else {
  //       //       await logout();
  //       //     }
  //       //   }
  //       //}
  //     } catch (error) {
  //       console.error("Auth initialization failed:", error);
  //       setIsAuthenticated(false);
  //       setUser(null);
  //     } finally {
  //       initialized.current = true;
  //       setLoading(false);
  //     }
  //   };

  //   initAuth();
  // }, [setAutoLogout]);

  useEffect(() => {
    const checkAuth = () => {
      const userCopy = localStorage.getItem("user");
      console.log("userCopy", JSON.parse(userCopy));
      if (userCopy) {
        const user = JSON.parse(userCopy);
        setIsAuthenticated(true);
        setUser({
          id: user.name,
          username: user.name,
          name: user.name || "",
        });
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getGraphData = useCallback(
    async (api = false) => {
      if (!msalAccount || graphDataFetched.current) return;

      try {
        let tokenResponse: AuthenticationResult;
        try {
          tokenResponse = await instance.acquireTokenSilent({
            ...(api ? apiRequest : loginRequest),
            account: msalAccount,
          });
          if (api) {
            StorageUtil.set(TOKEN_KEY_MASL, tokenResponse.accessToken);
            setMsalTokenReady(true);
          } else {
            const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
              headers: {
                Authorization: `Bearer ${tokenResponse.accessToken}`,
              },
            });
            if (!graphResponse.ok) {
              throw new Error(`Graph API error: ${graphResponse.status}`);
            }
            const data = await graphResponse.json();
            const userData: User = {
              id: data.id,
              username: data.userPrincipalName,
              name: `${data.givenName} ${data.surname}`,
            };
            setUser(userData);
            StorageUtil.set(
              USER_KEY,
              JSON.stringify(userData),
              TOKEN_EXPIRES_SECONDS
            );
            graphDataFetched.current = true;
          }
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            console.log("Token expired, acquiring new token...");
            tokenResponse = await instance.acquireTokenPopup(loginRequest);
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setError("Failed to fetch user data");
      }
    },
    [msalAccount, instance]
  );

  useEffect(() => {
    if (
      initialized.current &&
      (isAuthenticated || isAuthenticatedMSAL) &&
      msalAccount &&
      !graphDataFetched.current
    ) {
      setLoading(true);
      Promise.all([getGraphData(), getGraphData(true)])
        .then(() => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated, isAuthenticatedMSAL, msalAccount, getGraphData]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await mockLoginAPI(username, password);

      StorageUtil.set(TOKEN_KEY, response.token, TOKEN_EXPIRES_SECONDS);
      StorageUtil.set(
        USER_KEY,
        JSON.stringify(response.user),
        TOKEN_EXPIRES_SECONDS
      );
      setAutoLogout(TOKEN_EXPIRES_SECONDS);
      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : String(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleMsalLogin = async () => {
    window.location.href = `${
      import.meta.env.VITE_AXIOS_BASE_URL
    }/Auth/login`;
    // try {
    //   const response = await instance.loginPopup(loginRequest);
    //   if (response) {
    //     setMsalAccount(response.account);
    //     graphDataFetched.current = false;
    //     navigate("/home");
    //   }
    // } catch (error) {
    //   console.error("MSAL login failed:", error);
    //   setError("MSAL login failed");
    // }
  };

  const logout = async () => {
    clearAllCookies();
    await clearAllSiteData();
    instance.logout().then(() => {
      wealthService.logout().then(() => {
        navigate("/login");
      });
    });
  };

  // const logout = useCallback(async () => {
  //   // if (msalAccount) {
  //   //   try {
  //   //     await instance.logoutPopup({
  //   //       account: msalAccount,
  //   //       postLogoutRedirectUri: window.location.origin,
  //   //     });
  //   //     setMsalTokenReady(false);
  //   //     StorageUtil.remove(TOKEN_KEY_MASL);
  //   //     StorageUtil.remove(USER_KEY);
  //   //     StorageUtil.clear();
  //   //   } catch (e) {
  //   //     console.error("MSAL logout failed:", e);
  //   //   }
  //   // }
  //   await instance.logout();
  //   window.location.href = `${
  //     import.meta.env.VITE_AXIOS_BASE_URL
  //   }/api/auth/logout`;
  //   await clearAllCookies();
  //   await clearAllSiteData();
  //   StorageUtil.remove(TOKEN_KEY);
  //   StorageUtil.remove(TOKEN_KEY_MASL);
  //   StorageUtil.remove(USER_KEY);
  //   StorageUtil.clear();
  //   sessionStorage.clear();

  //   // if (data) {
  //   //   navigate("/login");
  //   // }

  //   setUser(null);
  //   setIsAuthenticated(false);
  //   setMsalAccount(null);
  //   graphDataFetched.current = false;

  //   if (logoutTimer.current) {
  //     clearTimeout(logoutTimer.current);
  //   }
  // }, [instance, msalAccount]);

  // useEffect(() => {
  //   const handleStorageChange = (e: StorageEvent) => {
  //     if (e.key === TOKEN_KEY && !e.newValue) {
  //       logout();
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //     if (logoutTimer.current) {
  //       clearTimeout(logoutTimer.current);
  //     }
  //   };
  // }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loading,
        user,
        login,
        logout,
        error,
        isAuthenticatedMSAL,
        handleMsalLogin,
        msalTokenReady,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
