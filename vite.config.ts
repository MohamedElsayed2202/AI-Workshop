import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  resolve: {
    // Mirrors the paths in tsconfig.base.json, which is the source of truth.
    alias: [
      { find: /^@shared\//, replacement: fromRoot("./src/shared/") },
      { find: /^@dashboard\//, replacement: fromRoot("./src/dashboard/") },
      { find: /^@users\//, replacement: fromRoot("./src/users/") },
      { find: /^@auth\//, replacement: fromRoot("./src/auth/") },
      { find: /^@\//, replacement: fromRoot("./src/") },
    ],
  },
});
