import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

interface AddBookmarkProps {
	category?: Category[];
}

const useAddBookmark = ({ category }: AddBookmarkProps) => {
	const { user } = useAuthContext();
	const [url, setUrl] = useState<string>("");

	const onChangeUrl = (url: string) => {
		setUrl(url);
	};

	const [title, setTitle] = useState<string>("");

	const { isError: isBookmarkError } = useGETBookmarkTitleQuery({
		memberId: 112,
		url,
		setTitle
	});

	const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
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

	return {
		url,
		title,
		selectedCategory,
		visibilityList,
		selectedVisibility,
		isBookmarkError,
		onChangeUrl,
		onChangeTitle,
		onChangeCategory,
		onChangeVisibility,
		onClickPostBookmark
	};
};

export default useAddBookmark;
