import { useMutation } from "@tanstack/react-query";
import client from "@src/utils/client";
import { StorageType, createStorage } from "@src/hooks/useStorage";
import { useNavigate } from "react-router-dom";
import useToast from "@src/ui/toast/useToast";
import useAuthContext from "../hooks/useAuthContext";

export type MemberCode = string;

interface RequestInterface {
	code: string;
}

const deleteMemberCodeAPI = async ({ code }: RequestInterface) => {
	const { data } = await client<MemberCode>({
		method: "delete",
		url: "/members/authentication-code",
		params: { code },
		data: {}
	});
	return data;
};

export const useDeleteMemberCodeMutation = () => {
	const { set } = createStorage("memberCode", "", {
		storageType: StorageType.Local
	});
	const { fireToast } = useToast();

	const router = useNavigate();
	const { login } = useAuthContext();
	return useMutation(deleteMemberCodeAPI, {
		onSuccess: async (data) => {
			fireToast({ message: "인증 되었습니다" });
			set(data);
			await login();
			router("/");
		},
		onError: () => {
			fireToast({ message: "앗! 인증에 실패했어요", mode: "DELETE" });
		}
	});
};
