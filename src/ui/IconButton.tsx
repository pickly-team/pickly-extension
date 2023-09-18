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
			{...restProps}
			style={{ height: getRem(height), width: getRem(width) }}
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
