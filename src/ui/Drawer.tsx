import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme } from "@src/utils/theme";
import { ReactNode } from "react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";

interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

const Drawer = ({ isOpen, onClose, children }: DrawerProps) => {
	return (
		<>
			<Overlay isOpen={isOpen} onClick={onClose} />
			<DrawerContainer
				isOpen={isOpen}
				css={css`
					width: ${document.body.clientWidth * 0.8}px;
				`}
			>
				<div
					css={css`
						display: flex;
						justify-content: flex-end;
						padding: 1rem;
						cursor: pointer;
					`}
					onClick={onClose}
				>
					<CloseIcon size={20} />
				</div>
				{children}
			</DrawerContainer>
		</>
	);
};

export default Drawer;

const DrawerContainer = styled.div<{ isOpen: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	background-color: ${theme.colors.grey900};
	box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
	transform: translateX(${(props) => (props.isOpen ? 0 : -100)}%);
	transition: transform 0.3s ease-in-out;
	display: flex;
	flex-direction: column;
	z-index: 2;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
	opacity: ${(props) => (props.isOpen ? 1 : 0)};
	transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;
