/* eslint-disable no-mixed-spaces-and-tabs */
import useBottomIntersection from "@src/hooks/useBottomIntersection";
import BlankItem from "@src/ui/common/BlankItem";
import {
	BookmarkItemType,
	useGETBookMarkListQuery
} from "../service/api/bookmark";
import { READ_OPTION } from "../service/hooks/useReadList";
import BookmarkItem from "./BookmarkItem";
import BookmarkSkeletonItem from "./BookmarkSkeletonItem";

interface BookmarkListViewProps {
	memberId: string;
	readMode: READ_OPTION;
	selectedCategory: number | null;
}

const BookmarkListView = ({
	memberId,
	readMode,
	selectedCategory
}: BookmarkListViewProps) => {
	const {
		data: bookmarkList,
		fetchNextPage,
		isFetchingNextPage,
		isLoading
	} = useGETBookMarkListQuery({
		readByUser: readMode,
		categoryId: selectedCategory,
		memberId: memberId
	});

	const { bottom } = useBottomIntersection({
		fetchNextPage,
		enabled: !isFetchingNextPage && memberId !== ""
	});

	const flatBookMarkList = bookmarkList?.pages.flatMap((page) => page.contents);

	return (
		<>
			{!isLoading && !flatBookMarkList?.length && (
				<>
					{readMode === "📖 전체" && <BlankItem page='BOOKMARK' />}
					{readMode === "👀 읽음" && <BlankItem page='BOOKMARK' />}
					{readMode === "🫣 읽지 않음" && <BlankItem page='BOOKMARK_READ' />}
				</>
			)}
			{flatBookMarkList && (
				<BookmarkList
					bookmarkList={flatBookMarkList}
					renderItem={(item) => (
						<BookmarkItem key={item.bookmarkId} {...item} />
					)}
				/>
			)}
			<div ref={bottom} />
			{isFetchingNextPage &&
				Array.from({ length: 10 }).map((_, index) => (
					<BookmarkSkeletonItem key={index} />
				))}
		</>
	);
};

export default BookmarkListView;

interface BookmarkListProps {
	bookmarkList: BookmarkItemType[];
	renderItem: (item: BookmarkItemType) => JSX.Element;
}

export const BookmarkList = ({
	bookmarkList,
	renderItem
}: BookmarkListProps) => {
	return (
		<>
			{bookmarkList.map((bookmark) => {
				return renderItem(bookmark);
			})}
		</>
	);
};
