import { create } from "zustand";

export type ToastMessage =
	| "차단 되었습니다"
	| "차단이 해제 되었습니다"
	| "삭제 되었습니다"
	| "앗! 추가할 수 없는 북마크에요"
	| "앗! 비공개 북마크는 공유할 수 없어요"
	| "앗! 유효하지 않은 주소에요"
	| "신고 되었습니다"
	| "이미 신고한 북마크에요"
	| "앗! 알림 설정 기준일은 1일 이상이어야 해요"
	| "차단된 사용자는 팔로우 할 수 없어요"
	| "준비 중인 기능이에요"
	| "앗! 알림 설정이 꺼져 있어요"
	| "앗! URL을 입력해주세요"
	| "앗! 카테고리를 선택해주세요"
	| "앗! 제목을 입력해주세요"
	| "앗! 중복된 닉네임이에요"
	| "앗! 에러가 발생했어요"
	| "URL이 복사되었어요"
	| "북마크가 추가되었어요"
	| "로그아웃 되었습니다"
	| "인증 되었습니다"
	| "앗! 인증에 실패했어요"
	| "현재 페이지의 북마크를 가져올 수 없어요 🥲 \n 페이지를 새로고침 해보세요";

export type ToastMode = "SUCCESS" | "DELETE" | "ERROR";

export interface Toast {
	id?: string;
	message: ToastMessage;
	mode?: ToastMode;
}

interface ToastStore {
	toasts: Toast[];
	duration: number;
	addToast: (toast: Toast) => void;
	removeToast: (id: string) => void;
	setDuration: (duration: number) => void;
}

const useToastStore = create<ToastStore>((set) => ({
	toasts: [],
	duration: 2000,
	addToast: (toast: Toast) =>
		set((state) => ({ toasts: [...state.toasts, toast] })),
	removeToast: (id: string) =>
		set((state) => ({
			toasts: state.toasts.filter((toast) => toast.id !== id)
		})),
	setDuration: (duration: number) => set({ duration })
}));

export default useToastStore;
