import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Text from "@src/ui/Text";
import getRem from "@src/utils/getRem";
import { theme } from "@src/utils/theme";
import { SyntheticEvent } from "react";
import {
	AiFillHeart as HeartFillIcon,
	AiOutlineHeart as HeartIcon
} from "react-icons/ai";
import { BsBookFill as BookFillIcon } from "react-icons/bs";
import {
	TbMessageCircle2Filled as MessageFillIcon,
	TbMessageCircle2 as MessageIcon
} from "react-icons/tb";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BookmarkItemType } from "../service/api/bookmark";

const BookmarkItem = ({
	url,
	commentCnt,
	createdDate,
	isUserLike,
	previewImageUrl,
	readByUser,
	title,
	disabled = false,
	categoryName,
	categoryEmoji
}: BookmarkItemType) => {
	const onImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
		e.currentTarget.src = import.meta.env.VITE_ASSETS_URL + "/main.webp";
		e.currentTarget.setAttribute("style", "object-fit: contain");
	};

	const onClickItem = () => {
		chrome.tabs.create({ url });
	};

	return (
		<LinkWrapper
			onClick={(e) => {
				if (disabled) e.preventDefault();
				else onClickItem();
			}}
			disabled={disabled}
		>
			<ItemWrapper>
				<ItemUpperLeft>
					<EllipsisText fontSize={1.1} weight='bold'>
						{title}
					</EllipsisText>
					<CategoryTimeWrapper>
						<CategoryWrapper>
							<Text.Span
								fontSize={categoryName.length > 5 ? 0.7 : 0.8}
								color='white'
								css={css`
									margin-top: -2px;
									margin-right: 3px;
								`}
							>
								{categoryEmoji}
							</Text.Span>
							<Text.Span
								fontSize={categoryName.length > 5 ? 0.7 : 0.8}
								color='white'
								css={css`
									text-shadow: 1px 1px 10px black;
								`}
							>
								{` ${categoryName}`}
							</Text.Span>
						</CategoryWrapper>
						<Text.Span fontSize={0.9} color='lightPrimary'>
							{createdDate}
						</Text.Span>
					</CategoryTimeWrapper>
					<IconWrapper>
						{isUserLike && (
							<HeartFillIcon color={theme.colors.lightPrimary} size={16} />
						)}
						{!isUserLike && <HeartIcon color={theme.colors.white} size={16} />}
						{commentCnt > 0 && (
							<MessageFillIcon color={theme.colors.lightPrimary} size={16} />
						)}
						{commentCnt === 0 && (
							<MessageIcon color={theme.colors.white} size={16} />
						)}
						{!readByUser && (
							<BookFillIcon color={theme.colors.white} size={16} />
						)}
					</IconWrapper>
				</ItemUpperLeft>
				<ItemUpperRight>
					<Thumbnail
						src={previewImageUrl}
						effect='opacity'
						onError={onImageError}
					/>
				</ItemUpperRight>
			</ItemWrapper>
		</LinkWrapper>
	);
};

export default BookmarkItem;

interface LinkWrapperProps {
	disabled?: boolean;
}

const LinkWrapper = styled.div<LinkWrapperProps>`
	display: block;
	padding: ${getRem(15, 20)};
	width: 100%;
	transition: background-color 0.3s ease-in-out, opacity 0.3s ease-in-out;
	border: ${(props) =>
		props.disabled ? `1px solid ${theme.colors.grey800}` : "none"};
	border-bottom: 1px solid ${theme.colors.grey800};
	height: 100%;

	&:active {
		background-color: ${(props) =>
			props.disabled ? "none" : theme.colors.grey800};

		opacity: ${(props) => (props.disabled ? 1 : 0.7)};
	}
`;

const ItemWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const CategoryTimeWrapper = styled.div`
	display: flex;
	column-gap: 1rem;
	align-items: center;
`;

const CategoryWrapper = styled.div`
	padding: 0.1rem 0.5rem;
	background-color: ${theme.colors.lightPrimary};
	border-radius: 0.5rem;
	height: 1.7rem;
	display: flex;
	align-items: center;
`;

const IconWrapper = styled.div`
	display: flex;
	column-gap: 0.7rem;
	margin-left: 0.3rem;
`;

const ItemUpperLeft = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 1rem;
	flex: 1 1 auto;
	min-width: 0;
`;

const EllipsisText = styled(Text.Span)`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ItemUpperRight = styled.div`
	height: 100%;
	display: flex;
	flex-shrink: 0;
`;

const Thumbnail = styled(LazyLoadImage)`
	width: 7rem;
	height: 6rem;
	border-radius: 0.5rem;
	margin-left: 1rem;
	object-fit: contain;
	background-color: ${theme.colors.grey800};
`;
