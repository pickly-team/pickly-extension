/* eslint-disable @typescript-eslint/no-empty-function */
import styled from "@emotion/styled";
import useDrawer from "@src/hooks/useDrawer";
import useBottomSheet from "@src/ui/BottomSheet/useBottomSheet";
import Button from "@src/ui/Button";
import Header from "@src/ui/Header";
import IconButton from "@src/ui/IconButton";
import Text from "@src/ui/Text";
import useToast from "@src/ui/toast/useToast";
import { theme } from "@src/utils/theme";
import { useQueryClient } from "@tanstack/react-query";
import { FiMenu as MenuIcon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { GET_CATEGORY_LIST, useGETCategoryListQuery } from "../api/category";
import { GET_BOOKMARK_TITLE } from "../api/title";
import { resetMemberCode } from "../auth/store/auth";
import AddBookmark from "../bookmark/ui/AddBookmark";
import BookmarkDrawer from "../bookmark/ui/BookmarkDrawer";
import useAddBookmark from "../hooks/useAddBookmark";
import useAuthContext from "../hooks/useAuthContext";
import useGetHref from "../hooks/useGetHref";

const AddBookmarkPage = () => {
	const { user } = useAuthContext();

	const { data: categoryList } = useGETCategoryListQuery({
		memberId: user?.code ?? ""
	});

	const {
		url,
		title,
		selectedCategory,
		visibilityList,
		selectedVisibility,
		isPostEnabled,
		onChangeUrl,
		onChangeTitle,
		onChangeThumbnail,
		onChangeCategory,
		onChangeVisibility,
		onClickPostBookmark
	} = useAddBookmark({ category: categoryList });

	useGetHref({ onChangeUrl, onChangeTitle, onChangeThumbnail });

	const {
		isOpen: logoutBSOpen,
		open: openLogoutBS,
		close: closeLogoutBS
	} = useBottomSheet();

	const navigate = useNavigate();

	const { fireToast } = useToast();
	const queryClient = useQueryClient();
	const onClickLogout = () => {
		queryClient.removeQueries(GET_BOOKMARK_TITLE(url));
		queryClient.removeQueries(GET_CATEGORY_LIST(user?.code ?? ""));
		resetMemberCode();
		fireToast({ message: "로그아웃 되었습니다" });
		closeLogoutBS();
		navigate("/login");
	};

	const { open, openDrawer, closeDrawer } = useDrawer();

	return (
		<Wrapper>
			<BookmarkDrawer isOpen={open} onClose={closeDrawer} />
			<Header
				leftButton={
					<IconButton width={24} height={24} onClick={openDrawer}>
						<MenuIcon size={24} />
					</IconButton>
				}
			/>
			<AddBookmark>
				<AddBookmark.Url url={url} />
				<AddBookmark.Title title={title} onChangeTitle={onChangeTitle} />
				<AddBookmark.Category
					categoryList={categoryList}
					selectedCategory={selectedCategory}
					onChangeCategory={onChangeCategory}
				/>
				<AddBookmark.Visibility
					visibilityList={visibilityList}
					selectedVisibility={selectedVisibility}
					onChangeVisibility={onChangeVisibility}
				/>
			</AddBookmark>
			<ButtonWrapper>
				<Button onClick={onClickPostBookmark} disabled={!isPostEnabled}>
					<Text.Span weight='bold'>추가하기</Text.Span>
				</Button>
			</ButtonWrapper>
		</Wrapper>
	);
};

export default AddBookmarkPage;

const Wrapper = styled.div`
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

const HeaderRightButtonWrapper = styled.div`
	display: flex;
	column-gap: 0.5rem;
	align-items: center;
`;

const ButtonWrapper = styled.div`
	width: 100%;
	margin: 2rem 0;
	padding: 0 1.3rem;
`;

const ButtonText = styled(Text.Span)`
	padding: 1rem;
`;
