import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../backend/admin_command_center/static/admin_command_center",
    emptyOutDir: true
  }
});
