declare module "*.svg" {
	import React = require("react");
	export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}

declare module "*.json" {
	const content: string;
	export default content;
}

declare module "virtual:reload-on-update-in-background-script" {
	export const reloadOnUpdate: (watchPath: string) => void;
	export default reloadOnUpdate;
}
