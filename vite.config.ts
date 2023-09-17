import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import makeManifest from "./utils/plugins/make-manifest";
import buildContentScript from "./utils/plugins/build-content-script";
import { outputFolderName } from "./utils/constants";
import svgr from "vite-plugin-svgr";
import { PreRenderedChunk } from "rollup";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, outputFolderName);
const publicDir = resolve(__dirname, "public");

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		resolve: {
			alias: {
				"@src": root,
				"@assets": assetsDir,
				"@pages": pagesDir,
				"@utils": resolve(root, "utils")
			}
		},
		plugins: [
			react({
				jsxImportSource: "@emotion/react",
				babel: {
					plugins: [["@emotion/babel-plugin", { sourceMap: true }]]
				}
			}),
			makeManifest(),
			buildContentScript(),
			svgr()
		],
		publicDir,
		build: {
			outDir,
			sourcemap: process.env.__DEV__ === "true",
			emptyOutDir: false,
			rollupOptions: {
				input: {
					background: resolve(pagesDir, "background", "index.ts"),
					popup: resolve(pagesDir, "popup", "index.html")
				},
				output: {
					entryFileNames: (assetInfo: PreRenderedChunk) => {
						return `src/pages/${assetInfo.name}/index.js`;
					}
				}
			},
			define: {
				"process.env": env,
				"process.env.NODE_ENV": JSON.stringify(mode),
				"process.env.VITE_SERVER_URI": JSON.stringify(env.VITE_SERVER_URI)
			}
		}
	};
});
