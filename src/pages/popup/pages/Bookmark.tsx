import styled from "@emotion/styled";

import useDrawer from "@src/hooks/useDrawer";
import Header from "@src/ui/Header";
import IconButton from "@src/ui/IconButton";
import SkeletonWrapper from "@src/ui/common/SkeletonWrapper";
import { Suspense } from "react";
import { FiMenu as MenuIcon } from "react-icons/fi";
import useCategory from "../bookmark/service/hooks/useCategory";
import useReadList from "../bookmark/service/hooks/useReadList";
import BookmarkDrawer from "../bookmark/ui/BookmarkDrawer";
import BookmarkListView from "../bookmark/ui/BookmarkListView";
import BookmarkSkeletonItem from "../bookmark/ui/BookmarkSkeletonItem";
import BookmarkToggle from "../bookmark/ui/BookmarkToggle";
import useAuthContext from "../hooks/useAuthContext";

const BookmarkPage = () => {
	const { user } = useAuthContext();
	const { selectedCategoryId, categoryOptions, onChangeCategory } = useCategory(
		{
			memberId: user?.code ?? ""
		}
	);

	const { readSelectOptionsList, selectedReadOption, onClickReadMode } =
		useReadList();

	const { open, openDrawer, closeDrawer } = useDrawer();

	return (
		<>
			<BookmarkDrawer isOpen={open} onClose={closeDrawer} />
			<Header
				leftButton={
					<IconButton width={24} height={24} onClick={openDrawer}>
						<MenuIcon size={24} />
					</IconButton>
				}
			/>
			<BookmarkToggle>
				<BookmarkToggle.SelectCategory
					selectedCategoryId={selectedCategoryId}
					categoryOptions={categoryOptions}
					setCategoryId={onChangeCategory}
				/>
				<BookmarkToggle.SelectReadMode
					selectedReadOption={selectedReadOption}
					readOptions={readSelectOptionsList}
					onChangeRead={onClickReadMode}
				/>
			</BookmarkToggle>
			<LMiddle>
				<Suspense
					fallback={
						<SkeletonWrapper>
							{Array.from({ length: 10 }).map((_, index) => (
								<BookmarkSkeletonItem key={index} />
							))}
						</SkeletonWrapper>
					}
				>
					<BookmarkListView
						memberId={user?.code ?? ""}
						readMode={selectedReadOption}
						selectedCategory={selectedCategoryId}
					/>
				</Suspense>
			</LMiddle>
		</>
	);
};

export default BookmarkPage;

const LMiddle = styled.div`
	padding-bottom: 5rem;
	width: 100vw;
`;
