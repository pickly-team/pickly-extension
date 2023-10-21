import { css } from "@emotion/react";
import getRem from "@src/utils/getRem";
import { ColorType, theme } from "@src/utils/theme";
import {
	ChangeEvent,
	ComponentPropsWithRef,
	forwardRef,
	ForwardRefRenderFunction
} from "react";

export type InputProps = {
	value: string;
	color?: ColorType;
	backgroundColor?: ColorType;
	focusTheme?: {
		color?: ColorType;
		backgroundColor?: ColorType;
	};
	border?: {
		color?: ColorType;
		borderWidth?: number;
		borderRadius?: number;
	};
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & ComponentPropsWithRef<"input">;

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
	{
		color = "white",
		backgroundColor = "grey900",
		border = {
			borderRadius: 0.5,
			borderWidth: 0,
			color: undefined
		},
		focusTheme = {
			color: "white",
			backgroundColor: "grey800"
		},
		...restProps
	},
	ref
) => {
	return (
		<input
			type={"text"}
			css={css`
				box-shadow: none;
				font-size: 0.8rem;
				appearance: none;
				color: ${theme.colors[color]};
				font-family: "NanumSquareRoundR";
				border-radius: ${border.borderRadius}rem;
				border: ${border.borderWidth && border.color
					? `${border.borderWidth}px solid ${theme.colors[border.color]}`
					: "none"};
				background-color: ${theme.colors[backgroundColor]};
				transition: all ease 0.5s 0s;
				width: 100%;
				height: ${restProps.height ? `${restProps.height}rem` : getRem(40)};
				padding: ${getRem(15)};
				box-sizing: border-box;
				:focus {
					outline: none;
					color: ${focusTheme.color
						? theme.colors[focusTheme.color]
						: theme.colors.white};
					background-color: ${focusTheme.backgroundColor
						? theme.colors[focusTheme.backgroundColor]
						: theme.colors.grey800};
				}
				::placeholder {
					color: ${theme.colors.grey800};
				}
				:disabled {
					background-color: ${theme.colors.darkBlack};
				}
			`}
			ref={ref}
			{...restProps}
		/>
	);
};

export default forwardRef(Input);
