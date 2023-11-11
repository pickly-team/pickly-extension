import styled from "@emotion/styled";
import Input from "@src/ui/Input";
import Text from "@src/ui/Text";
import getRem from "@src/utils/getRem";

const CATEGORY_MAX_LENGTH = 8;

interface NameProps {
	onChangeCategoryName: (name: string) => void;
	categoryName: string;
}

const CategoryName = ({ categoryName, onChangeCategoryName }: NameProps) => {
	return (
		<Wrapper>
			<Text.Header level='h3' weight='bold' fontSize={getRem(16)}>
				카테고리 이름
			</Text.Header>
			<CategoryNameInput
				value={categoryName}
				onChange={(e) => onChangeCategoryName(e.target.value)}
				maxLength={CATEGORY_MAX_LENGTH}
				height={3}
			/>
			<CountText
				fontSize={getRem(10)}
			>{`${categoryName.length} / ${CATEGORY_MAX_LENGTH}자`}</CountText>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: ${getRem(20)};
`;

const CategoryNameInput = styled(Input)`
	margin-top: ${getRem(20)};
`;

const CountText = styled(Text.P)`
	text-align: right;
	margin-top: ${getRem(10)};
`;

export default CategoryName;
