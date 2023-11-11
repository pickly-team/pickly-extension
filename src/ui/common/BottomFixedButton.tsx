import styled from "@emotion/styled";
import getRem from "@src/utils/getRem";
import Button, { ButtonProps } from "../Button";

const BottomFixedButton = (props: ButtonProps) => {
	return (
		<StyleFixedButtonWrapper>
			<Button {...props}>{props.children}</Button>
		</StyleFixedButtonWrapper>
	);
};

export default BottomFixedButton;

const StyleFixedButtonWrapper = styled.div`
	position: fixed;
	width: 100%;
	max-width: calc(100vw - 0.5rem);
	margin: 0 auto;
	padding: 0 1.3rem;
	bottom: ${getRem(20)};
`;
