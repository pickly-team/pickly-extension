/* eslint-disable @typescript-eslint/no-empty-function */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import BSConfirmation from "@src/ui/BottomSheet/BSConfirmation";
import TriggerBottomSheet from "@src/ui/BottomSheet/TriggerBottomSheet";
import useBottomSheet from "@src/ui/BottomSheet/useBottomSheet";
import Drawer from "@src/ui/Drawer";
import Text from "@src/ui/Text";
import useToast from "@src/ui/toast/useToast";
import getRem from "@src/utils/getRem";
import { theme } from "@src/utils/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GET_CATEGORY_LIST } from "../../api/category";
import { resetMemberCode } from "../../auth/store/auth";
import Help from "../../components/Help";
import useAuthContext from "../../hooks/useAuthContext";

interface BookmarkDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

const BookmarkDrawer = ({ isOpen, onClose }: BookmarkDrawerProps) => {
	const { user } = useAuthContext();
	const router = useNavigate();

	const onClick_북마크_추가 = () => {
		router("/");
		onClose();
	};

	const onClick_북마크_목록 = () => {
		router("/bookmark");
		onClose();
	};

	const onClick_로그아웃 = () => {
		openLogoutBS();
	};

	const { fireToast } = useToast();
	const queryClient = useQueryClient();

	const {
		isOpen: logoutBSOpen,
		open: openLogoutBS,
		close: closeLogoutBS
	} = useBottomSheet();

	const navigate = useNavigate();

	const onClickLogout = () => {
		queryClient.removeQueries(GET_CATEGORY_LIST(user?.code ?? ""));
		resetMemberCode();
		fireToast({ message: "로그아웃 되었습니다" });
		closeLogoutBS();
		navigate("/login");
	};

	return (
		<Drawer isOpen={isOpen} onClose={onClose}>
			<Item text='북마크 추가' onClick={onClick_북마크_추가} />
			<Item text='북마크 목록' onClick={onClick_북마크_목록} />
			<TriggerBottomSheet>
				<TriggerBottomSheet.Trigger
					as={<Item text='도움말' onClick={() => {}} />}
				/>
				<TriggerBottomSheet.BottomSheet>
					<Help />
				</TriggerBottomSheet.BottomSheet>
			</TriggerBottomSheet>
			<Item text='로그아웃' onClick={onClick_로그아웃} />

			<BSConfirmation
				open={logoutBSOpen}
				title='로그아웃'
				description='로그아웃 하시겠습니까?'
				onConfirm={onClickLogout}
				onClose={closeLogoutBS}
				onCancel={closeLogoutBS}
			/>
		</Drawer>
	);
};

export default BookmarkDrawer;

interface ItemProps {
	text: string;
	onClick?: () => void;
}

const Item = ({ text, onClick }: ItemProps) => {
	const handleClick = () => {
		onClick && onClick();
	};

	return (
		<ListButton onClick={handleClick}>
			<div
				css={css`
					display: flex;
					justify-content: flex-start;
					justify-items: flex-start;
				`}
			>
				<Text.P fontSize={0.9}>{text}</Text.P>
			</div>
		</ListButton>
	);
};

const ListButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	border-bottom: 1px solid ${theme.colors.grey600};
	padding: ${getRem(15)} ${getRem(20)};
	:nth-last-of-type(1) {
		border-bottom: none;
	}
	:hover {
		background-color: ${theme.colors.grey800};
	}

	transition: all 0.2s ease-in-out;
`;
