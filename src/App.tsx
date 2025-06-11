import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { SearchAccountProvider } from "./context/SearchContext";
import { MsalAuthProvider } from "./providers/MsalAuthProvider";
import { RouterGenerator } from "./routes/RouterGenerator";
import { routes } from "./routes/config";

function App() {
  return (
    <BrowserRouter>
      <MsalAuthProvider>
        <AuthProvider>
          <SearchAccountProvider>
            <RouterGenerator routes={routes} />
            <Toaster />
          </SearchAccountProvider>
        </AuthProvider>
      </MsalAuthProvider>
    </BrowserRouter>
  );
}

export default App;
