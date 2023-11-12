/* eslint-disable @typescript-eslint/no-empty-function */
import styled from "@emotion/styled";
import useDrawer from "@src/hooks/useDrawer";
import Header from "@src/ui/Header";
import IconButton from "@src/ui/IconButton";
import Text from "@src/ui/Text";
import BottomFixedButton from "@src/ui/common/BottomFixedButton";
import { theme } from "@src/utils/theme";
import { FiMenu as MenuIcon } from "react-icons/fi";
import { useGETCategoryListQuery } from "../api/category";
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

	const { open, openDrawer, closeDrawer } = useDrawer();

	return (
		<>
			<Wrapper>
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

				<BottomFixedButton
					onClick={onClickPostBookmark}
					disabled={!isPostEnabled}
				>
					<Text.Span weight='bold'>추가하기</Text.Span>
				</BottomFixedButton>
			</Wrapper>
			<BookmarkDrawer isOpen={open} onClose={closeDrawer} />
		</>
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
	min-height: 100vh;

	&::-webkit-scrollbar {
		width: 10px;
	}
`;
