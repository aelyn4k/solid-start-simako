import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    allowedHosts: ["tup.web.id", "simako.vercel.app"],
  },
  plugins: [solidStart(), tailwindcss(), nitro()],
});
