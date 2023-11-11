import useToast from "@src/ui/toast/useToast";
import client from "@src/utils/client";
import { useQuery } from "@tanstack/react-query";

export interface Category {
	categoryId: number;
	name: string;
	emoji: string;
	orderNum: number;
}

interface GETCategoryListRequest {
	memberId: string;
}

const getCategoryListAPI = async ({ memberId }: GETCategoryListRequest) => {
	const { data } = await client<Category[]>({
		method: "get",
		url: "/members/categories/chrome-extension",
		params: { memberId: encodeURI(memberId) },
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

export const GET_CATEGORY_LIST = (memberId: string) => ["get", memberId];

export const useGETCategoryListQuery = (
	params: GETCategoryListQueryRequest
) => {
	const { fireToast } = useToast();
	return useQuery(
		GET_CATEGORY_LIST(params.memberId),
		() => getCategoryListAPI(params),
		{
			onSuccess: (data) => {
				if (data.length === 0) {
					fireToast({
						message: "현재 사용할 수 있는 카테고리가 없어요 😥",
						mode: "ERROR"
					});
				}
			},
			enabled: !!params.memberId,
			cacheTime: 5 * 60 * 1000,
			staleTime: 5 * 60 * 1000
		}
	);
};
