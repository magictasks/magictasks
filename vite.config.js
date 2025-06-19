import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const host = process.env.VITE_HOST || "localhost";
  console.log(`Vite is running on host: ${host}`);
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: [host],
      hmr: {
        host: host,
        protocol: host == "localhost" ? "ws" : "wss",
      },
    },
  };
});
