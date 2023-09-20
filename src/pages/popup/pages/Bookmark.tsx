/* eslint-disable @typescript-eslint/no-empty-function */
import styled from "@emotion/styled";
import { theme } from "@src/utils/theme";
import useAuthContext from "../hooks/useAuthContext";
import { useGETCategoryListQuery } from "../api/category";
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
import useBottomIntersection from "@src/hooks/useBottomIntersection";
import { useEffect, useRef, useState } from "react";

const BookmarkPage = () => {
	const { user } = useAuthContext();

	const {
		data: categoryList,
		fetchNextPage,
		isFetchingNextPage
	} = useGETCategoryListQuery({
		memberId: user?.code ?? ""
	});

	const flatCategoryList = categoryList?.pages.flatMap((page) => page.contents);

	const bottomWrapper = useRef<HTMLDivElement>(null);
	const [loadedElement, setLoadedElement] = useState<HTMLElement | null>(null);
	const [portalOn, setPortalOn] = useState(false);

	useEffect(() => {
		setLoadedElement(bottomWrapper.current);
		if (portalOn) {
			setPortalOn(false);
		}
	}, [bottomWrapper, portalOn]);

	const { bottom } = useBottomIntersection({
		fetchNextPage,
		rootElement: loadedElement,
		enabled: !isFetchingNextPage
	});

	const {
		url,
		title,
		selectedCategory,
		visibilityList,
		selectedVisibility,
		isBookmarkError,
		onChangeUrl,
		onChangeTitle,
		onChangeCategory,
		onChangeVisibility,
		onClickPostBookmark
	} = useAddBookmark({ category: flatCategoryList });

	useGetHref({ onChangeUrl });

	const {
		isOpen: logoutBSOpen,
		open: openLogoutBS,
		close: closeLogoutBS
	} = useBottomSheet();

	const navigate = useNavigate();

	const { fireToast } = useToast();
	const onClickLogout = () => {
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
						<Button onClick={openLogoutBS} height={2} buttonColor='darkPrimary'>
							<ButtonText fontSize={0.8}>로그아웃</ButtonText>
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
					<Input
						value={title}
						onChange={onChangeTitle}
						height={3}
						placeholder='제목을 입력하세요.'
					/>
				</InputWrapper>
			</ContentWrapper>
			<ContentWrapper>
				<Title fontSize={1.1} level='h2' weight='bold'>
					카테고리
				</Title>
				<TriggerBottomSheet>
					<TriggerBottomSheet.Trigger
						as={
							<BottomSheetTrigger
								onClick={() => {
									setPortalOn(true);
								}}
							>
								<Text.Span fontSize={0.9}>{selectedCategory.item}</Text.Span>
							</BottomSheetTrigger>
						}
					/>
					<TriggerBottomSheet.BottomSheet>
						<CategoryWrapper ref={bottomWrapper}>
							{flatCategoryList?.map((category) => (
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
							<div ref={bottom} />
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
				<Button onClick={onClickPostBookmark} disabled={isBookmarkError}>
					<Text.Span>추가하기</Text.Span>
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
