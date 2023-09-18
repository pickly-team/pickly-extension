import styled from "@emotion/styled";
import getRem from "@src/utils/getRem";
import { theme } from "@src/utils/theme";

import { ReactNode } from "react";

import { IoArrowBack } from "react-icons/io5";
import Text from "./Text";

interface HeaderProps {
	showBackButton?: boolean;
	title?: string;
	rightButton?: ReactNode;
	backButtonCallback?: () => void;
}

const Header = ({
	showBackButton = false,
	title,
	rightButton,
	backButtonCallback
}: HeaderProps) => {
	const onClickBackButton = () => {
		window.history.back();

		backButtonCallback && backButtonCallback();
	};
	return (
		<HeaderContainer>
			<BackButtonAndTitleWrapper>
				{showBackButton && (
					<IoArrowBack
						size={getRem(24)}
						color={theme.colors.white}
						onClick={onClickBackButton}
					/>
				)}
				{title && (
					<Text.Div fontSize={getRem(20)} weight='bold'>
						{title}
					</Text.Div>
				)}
			</BackButtonAndTitleWrapper>
			<RightButtonWrapper>{rightButton}</RightButtonWrapper>
		</HeaderContainer>
	);
};

export default Header;

const HeaderContainer = styled.div`
	position: sticky;
	top: 0;
	left: 0;
	background-color: ${theme.colors.black};
	padding: ${getRem(8, 20)};
	height: ${getRem(56)};
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 1000;
`;

const BackButtonAndTitleWrapper = styled.div`
	display: flex;
	column-gap: ${getRem(16)};
	align-items: center;
`;

const RightButtonWrapper = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
`;
