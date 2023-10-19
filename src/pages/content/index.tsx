export interface GET_HREF_RESULT {
	href: string;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "READY") {
		sendResponse({ code: 200, data: true });
		return true;
	}
	if (request.message === "GET_HREF") {
		(async () => {
			if (request.url && request.url === window.location.href) {
				sendResponse({
					code: 200,
					data: {
						href: window.location.href
					}
				});
				return true;
			}
		})();
		return true;
	}
	return true;
});
