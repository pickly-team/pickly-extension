import { GET_CATEGORY_LIST } from "@src/pages/popup/api/category";
import useToast from "@src/ui/toast/useToast";
import client from "@src/utils/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CategoryItem {
	name: string;
	emoji: string;
}

interface POSTCategoryRequest {
	memberId: string;
	postData: CategoryItem[];
}

const POSTCategory = {
	API: async (params: POSTCategoryRequest) => {
		const { data } = await client.post(
			"/categories/chrome-extension",
			params.postData,
			{
				params: {
					memberId: params.memberId
				}
			}
		);
		return data;
	}
};

interface POSTCategoryMutation {
	memberId: string;
}

export const usePOSTCategoryMutation = ({ memberId }: POSTCategoryMutation) => {
	const queryClient = useQueryClient();

	const router = useNavigate();
	const { fireToast } = useToast();
	return useMutation(POSTCategory.API, {
		onSuccess: async () => {
			queryClient.refetchQueries(GET_CATEGORY_LIST(memberId));
			router(-1);
		},
		onError: () => {
			fireToast({ message: "앗! 카테고리 추가에 실패했어요", mode: "ERROR" });
		}
	});
};
