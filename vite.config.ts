import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const apiBaseUrl = env.VITE_API_BASE_URL;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5174,
      strictPort: true,
      proxy:
        command === "serve" && apiBaseUrl
          ? {
              "/api": {
                target: apiBaseUrl,
                changeOrigin: true,
                secure: false,
              },
            }
          : undefined,
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: true,
    },
  };
});