import axios from "axios";
import { StorageUtil } from "./storage";
import { TOKEN_KEY_MASL } from "@/constant/auth";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_AXIOS_BASE_URL}/`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = StorageUtil.get(TOKEN_KEY_MASL);
//     if (!token) {
//       return Promise.reject(new Error("No token available"));
//     }
//     if (token) {
//       // config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
