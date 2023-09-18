import type { Manifest } from "webextension-polyfill";
import pkg from "../package.json";

const manifest: Manifest.WebExtensionManifest = {
	manifest_version: 3,
	name: pkg.displayName,
	version: pkg.version,
	description: pkg.description,
	background: {
		service_worker: "src/pages/background/index.js",
		type: "module"
	},
	host_permissions: ["<all_urls>"],
	action: {
		default_popup: "src/pages/popup/index.html",
		default_icon: "icon-32.png"
	},
	icons: {
		"16": "icon-16.png",
		"32": "icon-32.png",
		"48": "icon-48.png",
		"128": "icon-128.png"
	},
	permissions: ["storage", "activeTab", "contextMenus", "tabs"],
	content_scripts: [
		{
			matches: ["http://*/*", "https://*/*", "<all_urls>"],
			js: ["src/pages/content/index.js"],
			include_globs: ["*://*/*"],
			match_about_blank: true,
			css: ["contentStyle.css"]
		}
	],
	web_accessible_resources: [
		{
			resources: ["contentStyle.css", "icon-128.png", "icon-32.png"],
			matches: []
		}
	]
};

export default manifest;
