/* eslint-disable @typescript-eslint/no-empty-interface */
// types.d.ts 또는 emotion.d.ts

import "@emotion/react";
import { ThemeType } from "./utils/theme";

declare module "@emotion/react" {
	export interface Theme extends ThemeType {}
}
