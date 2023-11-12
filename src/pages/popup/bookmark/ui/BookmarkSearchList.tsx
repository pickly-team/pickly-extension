import styled from "@emotion/styled";
import useBottomIntersection from "@src/hooks/useBottomIntersection";
import getRem from "@src/utils/getRem";
import useAuthContext from "../../hooks/useAuthContext";
import { useGETBookmarkSearchListQuery } from "../service/api/bookmark";
import BookmarkItem from "./BookmarkItem";
import { BookmarkList } from "./BookmarkListView";

interface BookmarkSearchListProps {
	keyword: string;
}

const BookmarkSearchList = ({ keyword }: BookmarkSearchListProps) => {
	const { user } = useAuthContext();

	console.log(keyword);

	const {
		data: bookmarkList,
		fetchNextPage,
		isFetchingNextPage
	} = useGETBookmarkSearchListQuery({
		memberId: user?.code ?? "",
		keyword
	});

	console.log(bookmarkList);

	const flatBookMarkList = bookmarkList?.pages.flatMap((page) => page.contents);

	const shouldFetchNextPage = !isFetchingNextPage && keyword.length > 0;
	const { bottom } = useBottomIntersection({
		fetchNextPage,
		enabled: shouldFetchNextPage
	});
	return (
		<>
			<Container>
				{!!flatBookMarkList?.length && (
					<BookmarkList
						bookmarkList={flatBookMarkList}
						renderItem={(bookmark) => (
							<BookmarkItem key={bookmark.bookmarkId} {...bookmark} />
						)}
					/>
				)}
			</Container>
			<div ref={bottom} />
		</>
	);
};

export default BookmarkSearchList;

const Container = styled.div`
	min-height: 100vh;
	margin-top: 1rem;
	:first-of-type {
		padding-top: ${getRem(20)};
	}
`;
