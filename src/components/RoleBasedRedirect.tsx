// src/components/RoleBasedRedirect.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROLE_DEFAULT_ROUTES } from "@/constant/roleRoutes";

export const RoleBasedRedirect = () => {
  const [redirectPath, setRedirectPath] = useState<string>("/login");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.roles && userData.roles.length > 0) {
          const firstRole = userData.roles[0];
          const defaultRoute =
            ROLE_DEFAULT_ROUTES[
              firstRole as keyof typeof ROLE_DEFAULT_ROUTES
            ] || "/home";
          setRedirectPath(defaultRoute);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setRedirectPath("/login");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Navigate to={redirectPath} state={{ from: location }} replace />;
};
