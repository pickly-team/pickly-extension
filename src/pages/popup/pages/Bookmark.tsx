/* eslint-disable @typescript-eslint/no-empty-function */
import styled from "@emotion/styled";
import { theme } from "@src/utils/theme";
import useAuthContext from "../hooks/useAuthContext";
import { GET_CATEGORY_LIST, useGETCategoryListQuery } from "../api/category";
import TriggerBottomSheet from "@src/ui/BottomSheet/TriggerBottomSheet";
import Header from "@src/ui/Header";
import Input from "@src/ui/Input";
import Text from "@src/ui/Text";
import useAddBookmark from "../hooks/useAddBookmark";
import Button from "@src/ui/Button";
import useGetHref from "../hooks/useGetHref";
import BSConfirmation from "@src/ui/BottomSheet/BSConfirmation";
import useBottomSheet from "@src/ui/BottomSheet/useBottomSheet";
import { resetMemberCode } from "../auth/store/auth";
import useToast from "@src/ui/toast/useToast";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import getRem from "@src/utils/getRem";
import IconButton from "@src/ui/IconButton";
import { css } from "@emotion/react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { BiHelpCircle as HelpIcon } from "react-icons/bi";
import { useQueryClient } from "@tanstack/react-query";
import { GET_BOOKMARK_TITLE } from "../api/title";
import Help from "../components/Help";

const BookmarkPage = () => {
	const { user } = useAuthContext();

	const { data: categoryList } = useGETCategoryListQuery({
		memberId: user?.code ?? ""
	});

	const {
		url,
		title,
		selectedCategory,
		visibilityList,
		selectedVisibility,
		isBookmarkError,
		isLoadingGetTitle,
		isPostEnabled,
		onChangeUrl,
		onChangeTitle,
		onChangeCategory,
		onChangeVisibility,
		onClickPostBookmark
	} = useAddBookmark({ category: categoryList });

	useGetHref({ onChangeUrl });

	const {
		isOpen: logoutBSOpen,
		open: openLogoutBS,
		close: closeLogoutBS
	} = useBottomSheet();

	const navigate = useNavigate();

	const { fireToast } = useToast();
	const queryClient = useQueryClient();
	const onClickLogout = () => {
		queryClient.removeQueries(GET_BOOKMARK_TITLE(url, user?.code ?? ""));
		queryClient.removeQueries(GET_CATEGORY_LIST(user?.code ?? ""));
		resetMemberCode();
		fireToast({ message: "로그아웃 되었습니다" });
		closeLogoutBS();
		navigate("/login");
	};

	return (
		<Wrapper>
			<Header
				title='북마크 추가하기'
				rightButton={
					<HeaderRightButtonWrapper>
						<TriggerBottomSheet>
							<TriggerBottomSheet.Trigger
								as={
									<IconButton onClick={() => {}}>
										<HelpIcon size={24} />
									</IconButton>
								}
							/>
							<TriggerBottomSheet.BottomSheet>
								<Help />
							</TriggerBottomSheet.BottomSheet>
						</TriggerBottomSheet>
						<Button
							onClick={openLogoutBS}
							height={2}
							buttonColor='lightPrimary'
						>
							<ButtonText fontSize={0.8} weight='bold'>
								로그아웃
							</ButtonText>
						</Button>
					</HeaderRightButtonWrapper>
				}
			/>
			<ContentWrapper style={{ marginTop: 0 }}>
				<Title fontSize={1.1} level='h2' weight='bold'>
					URL
				</Title>
				<UrlWrapper>
					<UrlText color='grey600'>{url}</UrlText>
				</UrlWrapper>
			</ContentWrapper>
			<ContentWrapper>
				<Title fontSize={1.1} level='h2' weight='bold'>
					제목
				</Title>
				<InputWrapper>
					<StyledInputCloseWrapper>
						{isLoadingGetTitle ? (
							<StyledLoadingInput>
								<Oval
									height={25}
									width={25}
									color={theme.colors.lightPrimary}
									visible={true}
									ariaLabel='oval-loading'
									secondaryColor={theme.colors.lightPrimary}
									strokeWidth={4}
									strokeWidthSecondary={4}
								/>
							</StyledLoadingInput>
						) : (
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
						)}
					</StyledInputCloseWrapper>
				</InputWrapper>
			</ContentWrapper>
			<ContentWrapper>
				<Title fontSize={1.1} level='h2' weight='bold'>
					카테고리
				</Title>
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
							{categoryList?.map((category) => (
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
			<ContentWrapper>
				<Title fontSize={1.1} level='h2' weight='bold'>
					공개범위
				</Title>
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
			<ButtonWrapper>
				<Button
					onClick={onClickPostBookmark}
					disabled={isBookmarkError || !isPostEnabled}
				>
					<Text.Span weight='bold'>추가하기</Text.Span>
				</Button>
			</ButtonWrapper>
			<BSConfirmation
				open={logoutBSOpen}
				title='로그아웃'
				description='로그아웃 하시겠습니까?'
				onConfirm={onClickLogout}
				onClose={closeLogoutBS}
				onCancel={closeLogoutBS}
			/>
		</Wrapper>
	);
};

export default BookmarkPage;

const Wrapper = styled.div`
	position: "absolute";
	background-color: ${theme.colors.black};
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: "flex";
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;

	overflow: auto;
	&::-webkit-scrollbar {
		width: 10px;
	}
`;

const HeaderRightButtonWrapper = styled.div`
	display: flex;
	column-gap: 0.5rem;
	align-items: center;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	margin-top: 1rem;
	margin-bottom: 1rem;
`;

const Title = styled(Text.Header)`
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

const InputWrapper = styled.div`
	padding: 0 1rem;
	width: 100%;
`;

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

const ButtonWrapper = styled.div`
	width: 100%;
	margin: 2rem 0;
	padding: 0 1.3rem;
`;

const CategoryWrapper = styled.div`
	max-height: 70vh;
	overflow: auto;
`;

const ButtonText = styled(Text.Span)`
	padding: 1rem;
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

const StyledLoadingInput = styled.div`
	display: flex;
	height: 3rem;
	width: 100%;
	background-color: ${theme.colors.grey900};
	border-color: ${theme.colors.grey700};
	border-width: ${getRem(30)};
	border-radius: ${getRem(10)};

	align-items: center;
	justify-content: center;
`;
