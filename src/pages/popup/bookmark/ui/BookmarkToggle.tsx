import styled from "@emotion/styled";
import Button from "@src/ui/Button";
import Text from "@src/ui/Text";
import Select from "@src/ui/common/Select";
import getRem from "@src/utils/getRem";
import { theme } from "@src/utils/theme";
import { READ_OPTION } from "../service/hooks/useReadList";

export type ReadType = {
	value: string | null;
	label: string;
};

interface ToggleHandlerProps {
	isFriendPage?: boolean;
	children: React.ReactNode;
}

const BookmarkToggle = ({
	isFriendPage = false,
	children
}: ToggleHandlerProps) => {
	return <ToggleWrapper isFriendPage={isFriendPage}>{children}</ToggleWrapper>;
};

interface SelectCategoryProps {
	selectedCategoryId: number | null;
	categoryOptions: ReadType[];
	setCategoryId: (categoryId: string) => void;
}

const SelectCategory = ({
	selectedCategoryId,
	categoryOptions,
	setCategoryId
}: SelectCategoryProps) => {
	return (
		<ButtonWrapper>
			{!categoryOptions.length && (
				<Button
					buttonColor='black'
					height={2.5}
					style={{
						border: `2px solid ${theme.colors.lightPrimary}`,
						borderRadius: "0.8rem"
					}}
				>
					<Text.Span
						fontSize={0.9}
						color='lightPrimary'
						style={{
							width: "100%",
							textOverflow: "ellipsis",
							overflow: "hidden",
							padding: `0 ${getRem(10)}`
						}}
					>
						🥒 전체
					</Text.Span>
				</Button>
			)}
			{!!categoryOptions.length && (
				<Select
					trigger={
						<Button
							buttonColor='black'
							height={2.5}
							style={{
								border: `2px solid ${theme.colors.lightPrimary}`,
								borderRadius: "0.8rem"
							}}
						>
							<Text.Span
								color='lightPrimary'
								fontSize={0.9}
								style={{
									width: "100%",
									textOverflow: "ellipsis",
									overflow: "hidden",
									padding: `0 ${getRem(10)}`
								}}
							>
								🥒 전체
							</Text.Span>
						</Button>
					}
					value={String(selectedCategoryId) ?? "🥒 전체"}
					onChange={setCategoryId}
					isSearchActive
				>
					{categoryOptions.map((option) => (
						<option value={option.value ?? ""} key={option.value}>
							{option.label}
						</option>
					))}
				</Select>
			)}
		</ButtonWrapper>
	);
};

interface ToggleReadProps {
	selectedReadOption: READ_OPTION | null;
	readOptions: ReadType[];
	onChangeRead: (readMode: READ_OPTION) => void;
}

const SelectReadMode = ({
	selectedReadOption,
	readOptions,
	onChangeRead
}: ToggleReadProps) => {
	return (
		<ButtonWrapper>
			<Select
				trigger={
					<Button
						buttonColor='black'
						height={2.5}
						style={{
							border: `2px solid ${theme.colors.lightPrimary}`,
							borderRadius: "0.8rem"
						}}
					>
						<Text.Span
							fontSize={0.9}
							color='lightPrimary'
							style={{
								width: "100%",
								textOverflow: "ellipsis",
								overflow: "hidden",
								padding: `0 ${getRem(10)}`
							}}
						>
							📖 전체
						</Text.Span>
					</Button>
				}
				value={selectedReadOption ?? "📖 전체"}
				onChange={(value) => {
					onChangeRead(value as READ_OPTION);
				}}
				isSearchActive
			>
				{readOptions.map((option) => (
					<option value={option.value ?? ""} key={option.value}>
						{option.label}
					</option>
				))}
			</Select>
		</ButtonWrapper>
	);
};

interface ToggleEditProps {
	isEdit: boolean;
	onClickEdit: () => void;
}

const ToggleEdit = ({ isEdit, onClickEdit }: ToggleEditProps) => {
	return (
		<ButtonWrapper>
			<Button
				buttonColor='black'
				height={2.5}
				style={{
					border: `2px solid ${theme.colors.lightPrimary}`,
					borderRadius: "0.8rem"
				}}
				onClick={onClickEdit}
			>
				<Text.Span fontSize={0.9} color='lightPrimary'>
					{isEdit ? "완료" : "삭제"}
				</Text.Span>
			</Button>
		</ButtonWrapper>
	);
};

BookmarkToggle.SelectCategory = SelectCategory;
BookmarkToggle.SelectReadMode = SelectReadMode;
BookmarkToggle.ToggleEdit = ToggleEdit;

export default BookmarkToggle;

interface ToggleWrapperProps {
	isFriendPage: boolean;
}

const ToggleWrapper = styled.div<ToggleWrapperProps>`
	display: flex;
	position: sticky;

	align-self: flex-start;
	background-color: ${theme.colors.black};
	height: ${getRem(80)};
	border-radius: 0.8rem;
	justify-content: flex-start;
	padding: ${getRem(20)};
	z-index: 1;
	top: ${({ isFriendPage }) =>
		isFriendPage ? `${getRem(50)}` : `${getRem(-1)}`};
	column-gap: ${getRem(20)};
`;

const ButtonWrapper = styled.div`
	width: 30%;
`;
