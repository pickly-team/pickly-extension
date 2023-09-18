export const getMemberCode = async (): Promise<string> => {
	const code = await chrome.storage.local.get("memberCode");
	return code.memberCode;
};

export const resetMemberCode = async (): Promise<void> => {
	await chrome.storage.local.set({
		memberCode: ""
	});
};
