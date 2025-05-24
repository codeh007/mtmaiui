import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
export default defineConfig({
	plugins: [
		cloudflare({
			inspectorPort: 9229,
		}),
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindcss(),
	],
	environments: {
		mtmag: {
			define: {
				MY_VARIABLE: "MY_VARIABLE9999invite",
			},
		},
	},
	define: {
		__dirname: '""',
		"process.env": process.env,
	},
	resolve: {
		alias: {
			"@mtmaiui": path.resolve(__dirname, "./src"),
			// mtmaiapi: path.resolve(__dirname, "../../packages/mtmaiapi/src"),
			// mtxuilib: path.resolve(__dirname, "../../packages/mtxuilib/src"),
		},
	},
	build: {
		sourcemap: true,
	},
	server: {
		port: 6111,
	},
});
