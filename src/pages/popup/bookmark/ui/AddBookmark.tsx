/* eslint-disable @typescript-eslint/no-empty-function */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import TriggerBottomSheet from "@src/ui/BottomSheet/TriggerBottomSheet";
import Button from "@src/ui/Button";
import IconButton from "@src/ui/IconButton";
import Input from "@src/ui/Input";
import Text from "@src/ui/Text";
import getRem from "@src/utils/getRem";
import { theme } from "@src/utils/theme";
import { ReactNode } from "react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Category as CategoryType } from "../../api/category";
import { ClientVisibility, SelectedCategory } from "../../hooks/useAddBookmark";

interface AddBookmarkProps {
	children: ReactNode;
}

const AddBookmark = ({ children }: AddBookmarkProps) => {
	return <>{children}</>;
};

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	margin-top: 1rem;
	margin-bottom: 1rem;
`;

interface UrlProps {
	url: string;
}

const Url = ({ url }: UrlProps) => {
	return (
		<ContentWrapper style={{ marginTop: 0 }}>
			<StyledTitle fontSize={1.1} level='h2' weight='bold'>
				URL
			</StyledTitle>
			<UrlWrapper>
				<UrlText color='grey600'>{url}</UrlText>
			</UrlWrapper>
		</ContentWrapper>
	);
};

const StyledTitle = styled(Text.Header)`
	margin-top: 1rem;
	margin-bottom: 1rem;
	margin-left: 1.3rem;
`;

const UrlWrapper = styled.div`
	display: flex;
	padding: 0 1.3rem;
	width: 100%;
`;

const UrlText = styled(Text.Span)`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

interface TitleProps {
	title: string;
	onChangeTitle: (title: string) => void;
}

const Title = ({ title, onChangeTitle }: TitleProps) => {
	return (
		<ContentWrapper>
			<StyledTitle fontSize={1.1} level='h2' weight='bold'>
				제목
			</StyledTitle>
			<InputWrapper>
				<StyledInputCloseWrapper>
					<>
						<StyledInput
							css={css`
								transition: all 0.5s ease-in-out;
							`}
							value={title}
							onChange={(e) => onChangeTitle(e.target.value)}
							maxLength={100}
							height={3}
						/>
						<FixedIconWrapper>
							{!!title.length && (
								<IconButton onClick={() => onChangeTitle("")}>
									<CloseIcon size={20} />
								</IconButton>
							)}
						</FixedIconWrapper>
					</>
				</StyledInputCloseWrapper>
			</InputWrapper>
		</ContentWrapper>
	);
};

const InputWrapper = styled.div`
	padding: 0 1rem;
	width: 100%;
`;

const StyledInputCloseWrapper = styled.div`
	width: 100%;
	position: relative;
`;

const StyledInput = styled(Input)`
	padding-right: ${getRem(40)};
`;

const FixedIconWrapper = styled.div`
	position: absolute;
	top: ${getRem(5)};
	right: ${getRem(12)};
`;

interface CategoryProps {
	categoryList: CategoryType[] | undefined;
	selectedCategory: SelectedCategory;
	onChangeCategory: (categoryId: number, categoryName: string) => void;
}

const Category = ({
	categoryList,
	selectedCategory,
	onChangeCategory
}: CategoryProps) => {
	const navigate = useNavigate();
	const onClick_카테고리_추가 = () => {
		navigate("/category/add");
	};
	return (
		<ContentWrapper>
			<ButtonWrapper>
				<StyledTitle fontSize={1.1} level='h2' weight='bold'>
					카테고리
				</StyledTitle>
				<Button
					onClick={onClick_카테고리_추가}
					width={25}
					height={2}
					buttonColor='lightPrimary'
				>
					<ButtonText fontSize={0.8} weight='bold'>
						추가하기
					</ButtonText>
				</Button>
			</ButtonWrapper>
			<TriggerBottomSheet>
				<TriggerBottomSheet.Trigger
					as={
						<BottomSheetTrigger onClick={() => {}}>
							<Text.Span fontSize={0.9}>{selectedCategory.item}</Text.Span>
						</BottomSheetTrigger>
					}
				/>
				<TriggerBottomSheet.BottomSheet>
					<CategoryWrapper>
						{!categoryList?.length && (
							<TriggerBottomSheet.Item onClick={() => {}} key={""}>
								{"카테고리가 없습니다"}
							</TriggerBottomSheet.Item>
						)}
						{!!categoryList?.length &&
							categoryList?.map((category) => (
								<TriggerBottomSheet.Item
									onClick={() => {
										onChangeCategory(
											category.categoryId,
											`${category.emoji} ${category.name}`
										);
									}}
									key={category.categoryId}
								>
									{category.emoji + " " + category.name}
								</TriggerBottomSheet.Item>
							))}
					</CategoryWrapper>
				</TriggerBottomSheet.BottomSheet>
			</TriggerBottomSheet>
		</ContentWrapper>
	);
};

const BottomSheetTrigger = styled.div`
	width: 100%;
	background-color: ${theme.colors.grey850};
	height: 3rem;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 1.3rem;
	:active {
		background-color: ${theme.colors.grey700};
	}
	transition: all 0.2s ease-in-out;
`;

const CategoryWrapper = styled.div`
	max-height: 70vh;
	overflow: auto;
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	padding-right: ${getRem(20)};
`;

const ButtonText = styled(Text.Span)`
	padding: 1rem;
`;

interface VisibilityProps {
	visibilityList: ClientVisibility[];
	selectedVisibility: ClientVisibility;
	onChangeVisibility: (visibility: ClientVisibility) => void;
}

const Visibility = ({
	visibilityList,
	selectedVisibility,
	onChangeVisibility
}: VisibilityProps) => {
	return (
		<ContentWrapper>
			<StyledTitle fontSize={1.1} level='h2' weight='bold'>
				공개범위
			</StyledTitle>
			<TriggerBottomSheet>
				<TriggerBottomSheet.Trigger
					as={
						<BottomSheetTrigger onClick={() => {}}>
							<Text.Span fontSize={0.9}>{selectedVisibility}</Text.Span>
						</BottomSheetTrigger>
					}
				/>
				<TriggerBottomSheet.BottomSheet>
					{visibilityList?.map((visibility) => (
						<TriggerBottomSheet.Item
							onClick={() => {
								onChangeVisibility(visibility);
							}}
							key={visibility}
						>
							{visibility}
						</TriggerBottomSheet.Item>
					))}
				</TriggerBottomSheet.BottomSheet>
			</TriggerBottomSheet>
		</ContentWrapper>
	);
};

AddBookmark.Url = Url;
AddBookmark.Title = Title;
AddBookmark.Category = Category;
AddBookmark.Visibility = Visibility;

export default AddBookmark;
