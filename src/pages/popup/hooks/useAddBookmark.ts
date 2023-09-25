import { useEffect, useMemo, useState } from "react";
import { Category } from "../api/category";
import { useGETBookmarkTitleQuery } from "../api/title";
import { usePOSTBookmarkMutation } from "../api/bookmark";
import useAuthContext from "./useAuthContext";

interface SelectedCategory {
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

const useAddBookmark = ({ category }: AddBookmarkProps) => {
	const { user } = useAuthContext();
	const [url, setUrl] = useState<string>(NOT_FOUND_PAGE);

	const onChangeUrl = (url: string) => {
		setUrl(url);
	};

	const [title, setTitle] = useState<string>("");

	const { isError: isBookmarkError, isFetching: isLoadingGetTitle } =
		useGETBookmarkTitleQuery({
			memberId: user?.code,
			url,
			setTitle
		});

	const onChangeTitle = (title: string) => {
		setTitle(title);
	};
	// 1. 카테고리 선택
	const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
		categoryId: -1,
		item: "🐶 전체"
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

	const { mutate: postBookmark } = usePOSTBookmarkMutation();

	const onClickPostBookmark = () => {
		if (user?.code) {
			postBookmark({
				memberId: user.code,
				categoryId: selectedCategory.categoryId,
				url,
				title,
				visibility: TEMP_VISIBILITY[selectedVisibility]
			});
		}
	};

	const isPostEnabled = useMemo(() => {
		return (
			url !== NOT_FOUND_PAGE &&
			title.length > 0 &&
			selectedCategory.categoryId !== -1
		);
	}, [url, title, selectedCategory]);

	return {
		url,
		title,
		selectedCategory,
		visibilityList,
		selectedVisibility,
		isBookmarkError,
		isLoadingGetTitle,
		isPostEnabled,
		onChangeUrl,
		onChangeTitle,
		onChangeCategory,
		onChangeVisibility,
		onClickPostBookmark
	};
};

export default useAddBookmark;
