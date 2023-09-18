import client from "@src/utils/client";
import { Visibility } from "../hooks/useAddBookmark";
import useToast from "@src/ui/toast/useToast";
import { useMutation } from "@tanstack/react-query";

interface POSTBookmarkRequest {
	memberId: string;
	categoryId: number;
	url: string;
	title: string;
	visibility: Visibility;
}

interface POSTBookmarkResponse {
	id: number;
}

const postBookmark = async (params: POSTBookmarkRequest) => {
	const { data } = await client<POSTBookmarkResponse>({
		method: "post",
		url: "/bookmarks/chrome-extension",
		data: {
			...params,
			memberId: encodeURI(params.memberId)
		}
	});
	return data;
};

export const usePOSTBookmarkMutation = () => {
	const { fireToast } = useToast();
	return useMutation(postBookmark, {
		onSuccess: () => {
			fireToast({ message: "북마크가 추가되었어요" });
			// 창을 닫는다.
			setTimeout(() => {
				window.close();
			}, 2000);
		},
		onError: () => {
			fireToast({ message: "앗! 추가할 수 없는 북마크에요", mode: "DELETE" });
		}
	});
};
