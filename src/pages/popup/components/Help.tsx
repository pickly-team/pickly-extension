import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Text from "@src/ui/Text";
import getRem from "@src/utils/getRem";

const Help = () => {
	return (
		<Wrapper>
			<HeaderText level='h2' weight='bold' fontSize={1.2}>
				도움말
			</HeaderText>
			<ContentWrapper>
				<MiddleText fontSize={0.9}>
					{"단축키를 통해 Pickly를 사용해 보세요!"}
				</MiddleText>
				<RowWrapper>
					<LogoImage src='https://cdn.emojidex.com/emoji/seal/Windows.png' />
					<MiddleText fontSize={0.9}>{" : Alt + E"}</MiddleText>
				</RowWrapper>
				<RowWrapper>
					<ButtonText
						css={css`
							margin-top: -5px;
						`}
						fontSize={0.9}
					>
						{"🍎"}
					</ButtonText>
					<MiddleText fontSize={0.9}>{" : Cmd + E"}</MiddleText>
				</RowWrapper>
			</ContentWrapper>
		</Wrapper>
	);
};

export default Help;

const Wrapper = styled.div`
	width: 100%;
	padding: 0 ${getRem(20)} ${getRem(20)} ${getRem(20)};
`;

const HeaderText = styled(Text.Header)`
	margin-bottom: 1rem;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const MiddleText = styled(Text.Span)``;

const LogoImage = styled.img`
	width: 1rem;
	height: 1rem;
`;

const RowWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 1rem;
	column-gap: 0.5rem;
`;

const ButtonText = styled(Text.Span)`
	text-align: center;
	width: 1rem;
`;
