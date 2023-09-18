import client from "@src/utils/client";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface CategoryInfiniteQueryResponse {
	hasNext: boolean;
	contents: Category[];
}
export interface Category {
	categoryId: number;
	name: string;
	emoji: string;
	orderNum: number;
}

interface GETCategoryListRequest {
	memberId: string;
	pageRequest?: {
		cursorId?: number;
		pageSize: number;
	};
}

const getCategoryListAPI = async ({
	memberId,
	pageRequest
}: GETCategoryListRequest) => {
	const { data } = await client<CategoryInfiniteQueryResponse>({
		method: "get",
		url: "/categories/chrome-extension",
		params: { memberId: encodeURI(memberId), ...pageRequest },
		data: {}
	});
	return data;
};

export interface GETCategoryListQueryRequest {
	memberId: string;
	pageRequest?: {
		cursorId?: string;
		pageSize: number;
	};
}

const GET_CATEGORY_LIST = (params: GETCategoryListQueryRequest) => [
	"get",
	params.memberId
];

export const useGETCategoryListQuery = (
	params: GETCategoryListQueryRequest
) => {
	return useInfiniteQuery(
		GET_CATEGORY_LIST(params),
		async ({ pageParam = null }) => {
			const { contents, hasNext } = await getCategoryListAPI({
				...params,
				pageRequest: {
					cursorId: pageParam,
					pageSize: params.pageRequest?.pageSize ?? 10
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
					return lastPage.contents[lastPage.contents.length - 1].categoryId;
				}
				return undefined;
			},
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 5,
			staleTime: 1000 * 60 * 5,
			enabled: !!params.memberId.length
		}
	);
};
