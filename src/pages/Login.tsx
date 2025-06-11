import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { wealthService } from "@/services/wealthService";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const Login = () => {
  const { handleMsalLogin } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  // const { accounts } = useMsal();

  const fetchLogout = async () => {
    await wealthService.logout();
  };
  useEffect(() => {
    fetchLogout();
  }, []);
  // useEffect(() => {
  //   if (
  //     accounts.length > 0 ||
  //     (localStorage!.getItem("user") &&
  //       localStorage!.getItem("user")!.length > 0)
  //   ) {
  //     navigate("/home", { replace: true });
  //   }
  // }, [accounts, navigate]);
  // useEffect(() => {
  //   if (localStorage && localStorage.getItem("user")) {
  //     navigate("/home", { replace: true });
  //   }
  // }, []);
  return (
    <div className="flex h-screen">
      <section
        className="hidden lg:block w-1/2"
        style={{
          backgroundImage: `url('./images/login_left.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "10% 10%",
        }}
      ></section>
      <section className="flex items-center justify-center w-full lg:w-1/2">
        <div className="w-full px-8 py-12 lg:p-0 lg:w-1/2 min-h-[800px] flex flex-col justify-around">
          <div>
            <div className="form-inputs">
              <div className="py-5 flex align-center justify-center">
                <img className="w-56" src="./images/logo.svg" />
              </div>
              <div className="py-5 text-3xl font-semibold">
                Wealth Client Portfolio Statement Generator
              </div>
              <div className="text-sm">
                Securely log in with your credentials
              </div>
            </div>

            <Button
              className="w-full mt-4 flex items-center justify-center gap-2 bg-[#2F2F2F] text-white py-2 px-4 rounded hover:bg-[#404040] transition-colors"
              onClick={handleMsalLogin}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 0H0V10H10V0Z" fill="#F25022" />
                <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
                <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
                <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
              </svg>
              Sign in with Microsoft
            </Button>
            <p className="text-red-500 my-5 font-semibold text-center">{error && error}</p>
          </div>

          <div className="mt-14 flex items-center justify-between text-red-400">
            <div>
              <a href="" target="_blank">
                Terms and Conditions
              </a>
            </div>
            <div>
              <a href="" target="_blank">
                Privacy Policy
              </a>
            </div>
            <div>
              <a href="" target="_blank">
                Contact Us
              </a>
            </div>
            <div>
              <a href="/admin" target="_blank">
                Admin
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
