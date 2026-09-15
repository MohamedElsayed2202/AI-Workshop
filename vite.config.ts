import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const aliasMap = {
  "@shared": "src/shared",
  "@dashboard": "src/dashboard",
  "@users": "src/users",
  "@auth": "src/auth",
  "@": "src",
};

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      aliases: {
        "@shared/*": [path.join(rootDir, "src/shared/*")],
        "@dashboard/*": [path.join(rootDir, "src/dashboard/*")],
        "@users/*": [path.join(rootDir, "src/users/*")],
        "@auth/*": [path.join(rootDir, "src/auth/*")],
        "@/*": [path.join(rootDir, "src/*")],
      },
      unstable_moduleResolution: { type: "commonJS", rootDir },
    }),
    react(),
  ],
  server: { port: 5173, strictPort: true },
  resolve: {
    alias: Object.entries(aliasMap).map(([alias, target]) => ({
      find: new RegExp("^" + alias + "/"),
      replacement: path.join(rootDir, target) + path.sep,
    })),
  },
});
