import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from "vite-plugin-svgr";
import basicSsl from "@vitejs/plugin-basic-ssl";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), basicSsl()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "https://cbccibddv-ap",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // "/WealthApp": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
      // "/Fcbs": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/Fcbs/, ""),
      // },
      // "/TrustPortfolio": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/TrustPortfolio/, ""),
      // },
      // "/ActivityHistory/GetAllActivityHistory": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      //   // rewrite: (path) => path.replace(/^\/WealthApp\/GetActivityHistory/, ""),
      // },
      // "/ActivityHistory/AddActivityHistory": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/WealthApp\/AddActivityHistory/, ""),
      // },
      // "/GeneratePDF/GetAllDisclosures": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      // },
      // "/GeneratePDF/CreateDisclosure": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      // },
      // "/GeneratePDF/UpdateDisclosureById/": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      // },
      // "/ParameterMaintenance/GetAllParameters": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      // },
      // "/ParameterMaintenance/UpdateCustomer/": {
      //   target: "https://10.120.37.20",
      //   changeOrigin: true,
      // },
    },
  },
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif"],
});
