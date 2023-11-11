import styled from "@emotion/styled";
import Text from "@src/ui/Text";
import getRem, { calculateRem } from "@src/utils/getRem";

interface CategoryAddInfoProps {
	mode: "ADD" | "EDIT";
}

const CategoryAddInfo = ({ mode }: CategoryAddInfoProps) => {
	return (
		<Content>
			<PaddingWrapper>
				<HeadingWrapper>
					<Text.Header level='h2' weight='bold' fontSize={calculateRem(25)}>
						{mode === "ADD" ? "새로운 카테고리 만들기" : "카테고리 수정"}
					</Text.Header>
					{mode === "ADD" && (
						<Text.P fontSize={calculateRem(16)} color={"lightPrimary"}>
							카테고리를 이용해 즐겨찾기를 관리해보세요!
						</Text.P>
					)}
				</HeadingWrapper>
			</PaddingWrapper>
		</Content>
	);
};

export default CategoryAddInfo;

const Content = styled.div`
	-ms-overflow-style: none;
	::-webkit-scrollbar {
		display: none;
	}
`;

const PaddingWrapper = styled.div`
	padding: 0 ${getRem(20)};
`;

const HeadingWrapper = styled.div`
	display: flex;
	flex-direction: column;

	margin-top: ${getRem(20)};
	p {
		margin-top: ${getRem(8)};
	}
`;
