import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID
    }`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
export const apiRequest = {
  scopes: [`api://f75b0ad9-8b82-4d9f-b318-388e3bb67117/WealthApp.Read`],
};
export const graphConfig = {
  graphMeEndpoint: import.meta.env.VITE_GRAPH_ME_ENDPOINT,
};
