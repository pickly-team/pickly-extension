import styled from "@emotion/styled";
import LogoImg from "@assets/img/Icon.png";

import { FormEvent, useState } from "react";
import Button from "../../../ui/Button";
import { useDeleteMemberCodeMutation } from "../api/auth";
import { theme } from "@src/utils/theme";
import Input from "@src/ui/Input";

const Login = () => {
	const [code, setCode] = useState("");
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value);
	};

	const { mutate: deleteMemberCode } = useDeleteMemberCodeMutation();

	const onClick_인증하기 = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		deleteMemberCode({ code: code });
	};

	return (
		<Wrapper onSubmit={onClick_인증하기}>
			<LogoWrapper>
				<Icon src={LogoImg} alt='logo icon' />
			</LogoWrapper>
			<DescriptionWrapper>
				<Description>5분 이내에 인증번호를 입력해주세요.</Description>
			</DescriptionWrapper>
			<InputWrapper>
				<Input height={3} value={code} onChange={onChange} />
			</InputWrapper>
			<ButtonWrapper>
				<Button type='submit'>
					<ButtonText>인증하기</ButtonText>
				</Button>
			</ButtonWrapper>
		</Wrapper>
	);
};

export default Login;

const LogoWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 3rem;
`;

const Icon = styled.img`
	width: 205px;
	height: 205px;
`;

const DescriptionWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 3rem;
	padding: 0 2rem;
`;

const Description = styled.span`
	font-size: 0.8rem;
	color: ${theme.colors.white};
	margin-top: 1.3rem;
	margin-bottom: 1.3rem;
`;

const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 1.3rem;
	row-gap: 1.3rem;
	column-gap: 1.3rem;
	margin-top: 1rem;
	margin-bottom: 1rem;
`;

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 1.3rem;
	row-gap: 1.3rem;
	column-gap: 1.3rem;
	margin-top: 2rem;
	margin-bottom: 1.3rem;
`;

const Wrapper = styled.form`
	position: "absolute";
	background-color: ${theme.colors.black};
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: "flex";
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;

	overflow: auto;
	&::-webkit-scrollbar {
		width: 10px;
	}
`;

const ButtonText = styled.span`
	color: ${theme.colors.white};
	font-size: 1rem;
`;
