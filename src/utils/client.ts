import axios, { AxiosError, AxiosResponse } from "axios";

const client = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URI
});

type ErrorType = "NO_USER_INFO" | "PRIVATE_BOOKMARK" | "DUPLICATED_NICKNAME";

export const ErrorTypes: Record<ErrorType, string> = {
	NO_USER_INFO: "M001",
	DUPLICATED_NICKNAME: "M002",
	PRIVATE_BOOKMARK: "B002"
} as const;

interface CustomData {
	message: string;
	code: ErrorType;
}

export type CustomAxiosError = AxiosError<CustomData>;

client.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => {
		// 응답을 그대로 리턴
		return response;
	},
	(error: AxiosError): Promise<never> => {
		// Axios 에러 처리
		if (error.response) {
			// 서버가 에러 상태 코드를 리턴한 경우
			// console.log(error.response.data);
			// console.log(error.response.status);
			// console.log(error.response.headers);
		} else if (error.request) {
			// 요청이 만들어졌지만 응답을 받지 못한 경우
			// console.log(error.request);
		} else {
			// 요청을 만드는 중에 다른 오류가 발생한 경우
			// console.log("Error", error.message);
		}
		// console.log(error.config);

		// 처리한 후 에러를 다시 throw
		return Promise.reject(error);
	}
);

export default client;
