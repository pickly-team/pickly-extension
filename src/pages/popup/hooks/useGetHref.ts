import { GET_HREF_RESULT } from "@src/pages/content";
import { useEffect, useState } from "react";
import { NOT_FOUND_PAGE } from "./useAddBookmark";
import useToast from "@src/ui/toast/useToast";

interface GetHrefProps {
	onChangeUrl: (url: string) => void;
}

const useGetHref = ({ onChangeUrl }: GetHrefProps) => {
	const [loading, setLoading] = useState(true);
	const checkIfReceiverIsReady = (
		tabId: number,
		callback: (isReady: boolean) => void
	) => {
		chrome.tabs.sendMessage(tabId, { message: "READY" }, (response) => {
			if (chrome.runtime.lastError) {
				setTimeout(() => checkIfReceiverIsReady(tabId, callback), 1000);
				setLoading(false);
			} else {
				callback(response.data);
			}
		});
	};

	const getHref = (
		tabId: number | undefined,
		callback: (data: GET_HREF_RESULT) => void
	) => {
		tabId &&
			chrome.tabs.sendMessage(tabId, { message: "GET_HREF" }, (response) => {
				if (chrome.runtime.lastError) {
					setTimeout(() => getHref(tabId, callback), 1000);
				} else {
					callback(response.data);
				}
			});
	};

	const { fireToast } = useToast();

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			tabs[0].id &&
				checkIfReceiverIsReady(tabs[0].id, (isReady) => {
					if (isReady) {
						getHref(tabs[0].id, (data) => {
							if (data.href === "") {
								fireToast({
									message:
										"현재 페이지의 북마크를 가져올 수 없어요 🥲 \n 페이지를 새로고침 해보세요",
									mode: "ERROR"
								});
								onChangeUrl(NOT_FOUND_PAGE);
								return;
							}
							onChangeUrl(data.href);
						});
						setTimeout(() => {
							setLoading(false);
						}, 500);
					} else {
						console.error("Error: Receiving end does not exist");
					}
				});
		});
		// Context menu를 위한 코드
		chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
			if (tabs.length === 0) return;
			tabs.forEach(
				(tab) =>
					tab.id &&
					checkIfReceiverIsReady(tab.id, (isReady) => {
						if (isReady) {
							getHref(tab?.id, (data) => {
								if (data.href === "") {
									fireToast({
										message:
											"현재 페이지의 북마크를 가져올 수 없어요 🥲 \n 페이지를 새로고침 해보세요",
										mode: "ERROR"
									});
									onChangeUrl(NOT_FOUND_PAGE);
									return;
								}
								onChangeUrl(data.href);
							});
							setTimeout(() => {
								setLoading(false);
							}, 500);
						}
					})
			);
		});
	}, []);

	return { loading };
};

export default useGetHref;
