import styled from "@emotion/styled";
import Header from "@src/ui/Header";
import Input from "@src/ui/Input";
import SkeletonWrapper from "@src/ui/common/SkeletonWrapper";
import getRem from "@src/utils/getRem";
import { Suspense } from "react";
import useSearchUser from "../bookmark/service/hooks/useSearchUser";
import BookmarkSearchList from "../bookmark/ui/BookmarkSearchList";
import BookmarkSkeletonItem from "../bookmark/ui/BookmarkSkeletonItem";

const BookmarkSearchPage = () => {
	const { keyword, debounceKeyword, handleChange, initializeKeyword } =
		useSearchUser();

	return (
		<>
			<Header
				title='북마크 검색'
				showBackButton={true}
				backButtonCallback={initializeKeyword}
			/>
			<Wrapper>
				<SearchInput
					value={keyword}
					onChange={handleChange}
					border={{
						color: "grey800",
						borderWidth: 1,
						borderRadius: 0.5
					}}
					height={3}
				/>
			</Wrapper>
			<Suspense
				fallback={
					<SkeletonWrapper>
						{Array.from({ length: 5 }, (_, item) => (
							<BookmarkSkeletonItem key={item} />
						))}
					</SkeletonWrapper>
				}
			>
				<BookmarkSearchList keyword={debounceKeyword} />
			</Suspense>
		</>
	);
};

export default BookmarkSearchPage;

const Wrapper = styled.div`
	padding: 0 ${getRem(20)};
`;

const SearchInput = styled(Input)`
	margin-top: ${getRem(12)};
`;
