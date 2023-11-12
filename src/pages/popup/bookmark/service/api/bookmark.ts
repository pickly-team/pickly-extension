// 북마크 메인 페이지
// 북마크 리스트 조회

import client from "@src/utils/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { READ_OPTION, READ_OPTIONS } from "../hooks/useReadList";

/** API call 결과 */
export interface SeverBookMarkItem {
	hasNext: boolean;
	contents: BookmarkItemType[];
}

export interface BookmarkItemType {
	bookmarkId: number;
	title: string;
	url: string;
	previewImageUrl: string;
	isUserLike: boolean;
	readByUser: boolean;
	commentCnt: number;
	createdDate: string;
	disabled?: boolean;
	categoryName: string;
	categoryEmoji: string;
}

/** mapping 결과 */
export type bookmarkGETBookMarkList = BookmarkItemType[];

interface GETBookMarkListRequest {
	memberId: string;
	categoryId: number | null;
	readByUser: READ_OPTION;
	pageRequest?: {
		cursorId?: number;
		pageSize?: number;
	};
}

const GETBookMarkList = {
	API: async (params: GETBookMarkListRequest) => {
		const { data } = await client.get<SeverBookMarkItem>(
			`/members/bookmarks/chrome-extension`,
			{
				params: {
					memberId: params.memberId,
					categoryId: params.categoryId === 0 ? null : params.categoryId,
					readByUser: READ_OPTIONS[params.readByUser],
					cursorId: params.pageRequest?.cursorId,
					pageSize: params.pageRequest?.pageSize
				}
			}
		);

		return {
			hasNext: data.hasNext,
			contents: GETBookMarkList.Mapper(data.contents)
		};
	},
	Mapper: (bookmarkList: BookmarkItemType[]): bookmarkGETBookMarkList => {
		return bookmarkList.map((bookmark) => ({
			bookmarkId: bookmark.bookmarkId,
			title: bookmark.title,
			url: bookmark.url,
			previewImageUrl:
				bookmark.previewImageUrl ??
				import.meta.env.VITE_ASSETS_URL + "/main.webp",
			isUserLike: bookmark.isUserLike,
			readByUser: bookmark.readByUser,
			commentCnt: bookmark.commentCnt,
			createdDate: bookmark.createdDate,
			categoryName: bookmark.categoryName,
			categoryEmoji: bookmark.categoryEmoji
		}));
	}
};

export const GET_BOOKMARK_LIST = (params: GETBookMarkListRequest) => [
	"GET_BOOKMARK_LIST",
	params.memberId,
	params.readByUser,
	params.categoryId
];

export const useGETBookMarkListQuery = (params: GETBookMarkListRequest) => {
	return useInfiniteQuery(
		GET_BOOKMARK_LIST(params),
		async ({ pageParam = null }) => {
			const { contents, hasNext } = await GETBookMarkList.API({
				...params,
				pageRequest: {
					cursorId: pageParam,
					pageSize: 10
				}
			});
			return {
				contents,
				hasNext
			};
		},
		{
			getNextPageParam: (lastPage) => {
				if (lastPage.hasNext) {
					return lastPage.contents[lastPage.contents.length - 1].bookmarkId;
				}
				return undefined;
			},
			refetchOnWindowFocus: false,
			cacheTime: 5 * 60 * 1000,
			staleTime: 5 * 60 * 1000,
			enabled: params.memberId !== "",
			suspense: true
		}
	);
};
export interface SeverBookMarkItem {
	hasNext: boolean;
	contents: BookmarkItem[];
}

export interface BookmarkItem {
	bookmarkId: number;
	title: string;
	url: string;
	previewImageUrl: string;
	isUserLike: boolean;
	readByUser: boolean;
	commentCnt: number;
	createdDate: string;
	disabled?: boolean;
	categoryName: string;
	categoryEmoji: string;
}

/** mapping 결과 */

interface GETBookMarkSearchListRequest {
	memberId: string;
	keyword: string;
	pageRequest?: {
		cursorId?: number;
		pageSize?: number;
	};
}

const GETBookSearchMarkList = {
	API: async (params: GETBookMarkSearchListRequest) => {
		const { data } = await client.get<SeverBookMarkItem>(
			"/members/bookmarks/search/chrome-extension",
			{
				params: {
					memberId: params.memberId,
					keyword: params.keyword,
					cursorId: params.pageRequest?.cursorId,
					pageSize: params.pageRequest?.pageSize
				}
			}
		);
		console.log(data);
		return {
			hasNext: data.hasNext,
			contents: GETBookMarkList.Mapper(data.contents)
		};
	},
	Mapper: (bookmarkList: BookmarkItem[]): bookmarkGETBookMarkList => {
		return bookmarkList.map((bookmark) => ({
			bookmarkId: bookmark.bookmarkId,
			title: bookmark.title,
			url: bookmark.url,
			previewImageUrl:
				bookmark.previewImageUrl ?? process.env.VITE_ASSETS_URL + "/main.webp",
			isUserLike: bookmark.isUserLike,
			readByUser: bookmark.readByUser,
			commentCnt: bookmark.commentCnt,
			createdDate: bookmark.createdDate,
			categoryName: bookmark.categoryName,
			categoryEmoji: bookmark.categoryEmoji
		}));
	}
};

const GET_BOOKMARK_SEARCH_LIST = (keyword: string) => [
	"GET_BOOKMARK_SEARCH_LIST",
	keyword
];

export const useGETBookmarkSearchListQuery = (
	params: GETBookMarkSearchListRequest
) => {
	return useInfiniteQuery(
		GET_BOOKMARK_SEARCH_LIST(params.keyword),
		async ({ pageParam = null }) => {
			const { contents, hasNext } = await GETBookSearchMarkList.API({
				...params,
				pageRequest: {
					cursorId: pageParam,
					pageSize: 10
				}
			});
			return {
				contents,
				hasNext
			};
		},
		{
			getNextPageParam: (lastPage) => {
				if (lastPage.hasNext) {
					return lastPage.contents[lastPage.contents.length - 1].bookmarkId;
				}
				return undefined;
			},
			refetchOnWindowFocus: false,
			cacheTime: 5 * 60 * 1000,
			staleTime: 5 * 60 * 1000,
			enabled: params.memberId !== "" && params.keyword.length > 0,
			suspense: true
		}
	);
};
