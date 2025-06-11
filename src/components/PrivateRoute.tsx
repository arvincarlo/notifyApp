import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import GlobalSkeleton from "./GlobalSkeleton";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  // const { inProgress } = useMsal();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const isAuthenticatedMSAL = useIsAuthenticated();
  const location = useLocation();

  console.log("isAuthenticated", isAuthenticated);
  // if (inProgress !== "none") {
  //   return <GlobalSkeleton />;
  // }

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setIsAuthenticated(true);
        setUserRoles(userData.roles || []);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsAuthenticated(false);
        setUserRoles([]);
      }
    } else {
      setIsAuthenticated(false);
      setUserRoles([]);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
