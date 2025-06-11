import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import LoginLoading from "./LoginLoading";
import { useNavigate } from "react-router-dom";

import EyeIcon from "../assets/icon_eye.svg?react";
import EyeSlashIcon from "../assets/icon_eye_slash.svg?react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await login(values.username, values.password);
    if (success) {
      //const from = (location.state as any)?.from?.pathname || "/home";
      navigate("/home", { replace: true });
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setIsPasswordVisible((prevState: boolean) => !prevState);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-16">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  {...field}
                  className="focus-visible:ring-red-500 focus-visible:border-red-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-16">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {isPasswordVisible ? (
                    <EyeSlashIcon
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <EyeIcon
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="rounded-[50px] bg-[#FF0025] text-white hover:bg-[#FF0025]/90"
          >
            Login {loading && <LoginLoading />}
          </Button>
          <a
            href="#"
            className=" text-14 text-red-500 hover:text-red-600 text-sm"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
