export const ROLE_DEFAULT_ROUTES = {
  "Admin,Maker": "/admin",
  "Admin,Checker": "/approval",
  "SysAdmin,Maker": "/users-maintenance",
  "SysAdmin,Checker": "/users-maintenance",
} as const;

export type UserRole = keyof typeof ROLE_DEFAULT_ROUTES;
