import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./assets/global.scss";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Error caught:", error);
        console.error("Error info:", errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
