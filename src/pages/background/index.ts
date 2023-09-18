import createContextMenu from "./utils/contextMenu";

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	if (request.message === "GET_HREF") {
		sendResponse({ received: true });
		return true;
	}
	if (request.message === "READY") {
		sendResponse({ received: true });
		return true;
	}
	return true;
});

createContextMenu();
