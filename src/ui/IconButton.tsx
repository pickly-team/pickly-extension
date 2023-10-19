import { css } from "@emotion/react";
import styled from "@emotion/styled";
import getRem from "@src/utils/getRem";
import { ButtonHTMLAttributes } from "react";

type IconButtonProps = {
	children: React.ReactNode;
	width?: number;
	height?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = ({
	children,
	width = 40,
	height = 40,
	...restProps
}: IconButtonProps) => {
	return (
		<StyleButton
			css={css`
				width: ${getRem(width)};
				height: ${getRem(height)};
			`}
			{...restProps}
		>
			{children}
		</StyleButton>
	);
};

export default IconButton;

const StyleButton = styled.button`
	display: flex;
	justify-content: flex-end;
`;
