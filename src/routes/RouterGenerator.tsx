import { Routes, Route } from "react-router-dom";
import { RouteConfig } from "./config";
import { PrivateRoute } from "@/components/PrivateRoute";

interface RouterGeneratorProps {
  routes: RouteConfig[];
}

export const RouterGenerator = ({ routes }: RouterGeneratorProps) => {
  const generateRoute = (route: RouteConfig) => {
    const element = route.auth ? (
      <PrivateRoute roles={route.roles}>{route.element}</PrivateRoute>
    ) : (
      route.element
    );

    return (
      <Route key={route.path} path={route.path} element={element}>
        {route.children?.map((child) => generateRoute(child))}
      </Route>
    );
  };

  return <Routes>{routes.map((route) => generateRoute(route))}</Routes>;
};
