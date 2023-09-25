import useToast from "@src/ui/toast/useToast";
import client, { CustomAxiosError, ErrorTypes } from "@src/utils/client";
import { useQuery } from "@tanstack/react-query";
import { NOT_FOUND_PAGE } from "../hooks/useAddBookmark";

type GETBookmarkTitleResponse = string;

interface GetBookmarkTitleRequest {
	memberId: string | undefined;
	url: string;
}

const getBookmarkTitleAPI = async ({
	memberId,
	url
}: GetBookmarkTitleRequest) => {
	const { data } = await client<GETBookmarkTitleResponse>({
		method: "get",
		url: `${`/members/bookmark/title/chrome-extension`}`,
		params: { url, memberId },
		data: {}
	});
	return data;
};

export const GET_BOOKMARK_TITLE = (
	url: string,
	memberId: string | undefined
) => ["GET_BOOKMARK_TITLE", url, memberId];

interface GETBookmarkTitleQuery {
	memberId: string | undefined;
	url: string;
	setTitle: (title: string) => void;
}

export const useGETBookmarkTitleQuery = ({
	memberId,
	url,
	setTitle
}: GETBookmarkTitleQuery) => {
	const { fireToast } = useToast();
	return useQuery(
		GET_BOOKMARK_TITLE(url, memberId),
		() => getBookmarkTitleAPI({ memberId, url }),
		{
			enabled: !!url.length && !!memberId?.length && url !== NOT_FOUND_PAGE,
			retry: 0,
			staleTime: 1000 * 60 * 60 * 24,
			cacheTime: 1000 * 60 * 60 * 24,
			onSuccess: (data) => {
				setTitle && setTitle(data);
			},
			onError: (e: CustomAxiosError) => {
				if (e.response?.data.code === ErrorTypes.PRIVATE_BOOKMARK) {
					fireToast({
						message: "앗! 비공개 북마크는 공유할 수 없어요",
						mode: "ERROR"
					});
				} else {
					fireToast({
						message: "앗! 유효하지 않은 주소에요",
						mode: "ERROR"
					});
				}
			}
		}
	);
};
