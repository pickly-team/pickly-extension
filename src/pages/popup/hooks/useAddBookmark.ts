import { useEffect, useMemo, useState } from "react";
import { Category } from "../api/category";
import { usePOSTBookmarkMutation } from "../api/bookmark";
import useAuthContext from "./useAuthContext";

export interface SelectedCategory {
	categoryId: number;
	item: string;
}

export type Visibility = "SCOPE_PUBLIC" | "SCOPE_PRIVATE" | "SCOPE_FRIEND";
export type ClientVisibility = "👀 전체 공개" | "🔒 나만 보기" | "👥 친구 공개";
export const TEMP_VISIBILITY: Record<ClientVisibility, Visibility> = {
	"👀 전체 공개": "SCOPE_PUBLIC",
	"🔒 나만 보기": "SCOPE_PRIVATE",
	"👥 친구 공개": "SCOPE_FRIEND"
};

export const NOT_FOUND_PAGE = "공유할 수 없는 페이지입니다.";

interface AddBookmarkProps {
	category?: Category[];
}

interface BookmarkInfo {
	url: string;
	title: string;
	thumbnail: string;
}

const useAddBookmark = ({ category }: AddBookmarkProps) => {
	const { user } = useAuthContext();
	const [bookmarkInfo, setBookmarkInfo] = useState<BookmarkInfo>({
		url: NOT_FOUND_PAGE,
		title: "",
		thumbnail: ""
	});

	const onChangeUrl = (url: string) => {
		setBookmarkInfo((prev) => ({ ...prev, url }));
	};

	const onChangeTitle = (title: string) => {
		setBookmarkInfo((prev) => ({ ...prev, title }));
	};

	const onChangeThumbnail = (thumbnail: string) => {
		setBookmarkInfo((prev) => ({ ...prev, thumbnail }));
	};
	// 1. 카테고리 선택
	const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
		categoryId: -1,
		item: "사용 가능한 카테고리가 없어요 😥"
	});

	const onChangeCategory = (categoryId: number, item: string) => {
		setSelectedCategory({ categoryId, item });
	};

	useEffect(() => {
		if (category && category.length > 0) {
			setSelectedCategory({
				categoryId: category[0].categoryId,
				item: `${category[0].emoji + " " + category[0].name}`
			});
		}
	}, [category?.length]);

	// 2. 공개 범위 선택
	const visibilityList = useMemo<ClientVisibility[]>(() => {
		return ["👀 전체 공개", "🔒 나만 보기", "👥 친구 공개"];
	}, []);
	const [selectedVisibility, setSelectedVisibility] =
		useState<ClientVisibility>("👀 전체 공개");

	const onChangeVisibility = (visibility: ClientVisibility) => {
		setSelectedVisibility(visibility);
	};

	const { mutate: postBookmark, isLoading: isPostBookmarkLoading } =
		usePOSTBookmarkMutation();

	const onClickPostBookmark = () => {
		if (isPostBookmarkLoading) return;
		if (user?.code) {
			postBookmark({
				memberId: user.code,
				categoryId: selectedCategory.categoryId,
				url: bookmarkInfo.url,
				title: bookmarkInfo.title,
				thumbnail: bookmarkInfo.thumbnail,
				visibility: TEMP_VISIBILITY[selectedVisibility]
			});
		}
	};

	const isPostEnabled = useMemo(() => {
		return (
			bookmarkInfo.url !== NOT_FOUND_PAGE &&
			bookmarkInfo.title.length > 0 &&
			selectedCategory.categoryId !== -1 &&
			!isPostBookmarkLoading
		);
	}, [bookmarkInfo, selectedCategory, isPostBookmarkLoading]);

	return {
		url: bookmarkInfo.url,
		title: bookmarkInfo.title,
		thumbnail: bookmarkInfo.thumbnail,
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
	};
};

export default useAddBookmark;
