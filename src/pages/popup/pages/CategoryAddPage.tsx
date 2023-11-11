import styled from "@emotion/styled";
import HeaderLeftAndRight from "@src/ui/common/HeaderLeftAndRight";
import useToast from "@src/ui/toast/useToast";
import getRem from "@src/utils/getRem";
import { useNavigate } from "react-router-dom";
import { usePOSTCategoryMutation } from "../category/service/api/category";
import useChangeEmoji from "../category/service/hooks/useChaneEmoji";
import useChangeCategoryName from "../category/service/hooks/useChangeCategoryName";
import CategoryAddInfo from "../category/ui/CategoryAddInfo";
import CategoryName from "../category/ui/CategoryName";
import Emoji from "../category/ui/Emoji";
import EmojiSelect from "../category/ui/EmojiSelect";
import useAuthContext from "../hooks/useAuthContext";

interface CategoryAddPageProps {
	mode: "ADD" | "EDIT";
}

export const bookmarkAddPagePaths = [
	"",
	"/friend",
	"/notification",
	"/profile"
] as const;

const CategoryAddPage = ({ mode }: CategoryAddPageProps) => {
	// TODO : 인증 로직 추가
	const { user } = useAuthContext();
	const router = useNavigate();

	const { fireToast } = useToast();

	// BUSINESS LOGIC
	const { emoji, isEmojiBSOpen, onChangeEmoji, setEmojiBSOpen } =
		useChangeEmoji();
	const { categoryName, onChangeCategoryName } = useChangeCategoryName();

	// INTERACTION
	// 1. 뒤로가기 버튼 > 뒤로가기
	const onClickBack = () => {
		router(-1);
	};

	// 2. 저장 버튼 > 저장
	const { mutate: postCategory, isLoading: isPostLoading } =
		usePOSTCategoryMutation({
			memberId: user?.code ?? ""
		});

	const onClickSave = () => {
		if (isPostLoading) return;
		if (!categoryName.length) {
			fireToast({ message: "앗! 카테고리 이름이 비어있어요", mode: "ERROR" });
			return;
		}
		if (mode === "ADD") {
			postCategory({
				memberId: user?.code ?? "",
				postData: [
					{
						emoji,
						name: categoryName
					}
				]
			});
		}
	};

	return (
		<Wrapper>
			<HeaderLeftAndRight
				leftButton={{ type: "back", onClick: onClickBack }}
				rightButton={{ text: "저장", onClick: onClickSave }}
			/>
			{/** 카테고리 페이지 설명 영역 */}
			<CategoryAddInfo mode={mode} />
			{/** 카테고리 입력 영역 */}
			<CategoryNameInputWrapper>
				<Emoji emoji={emoji} onClickEmoji={setEmojiBSOpen} />
				<CategoryName
					categoryName={categoryName}
					onChangeCategoryName={onChangeCategoryName}
				/>
			</CategoryNameInputWrapper>
			{/** 이모지 BS */}
			{isEmojiBSOpen && <EmojiSelect onChangeEmoji={onChangeEmoji} />}
		</Wrapper>
	);
};

export default CategoryAddPage;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
`;

const CategoryNameInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: ${getRem(20)};
	padding: 0 ${getRem(20)};
`;
