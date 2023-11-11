/* eslint-disable no-mixed-spaces-and-tabs */
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import getRem from "@src/utils/getRem";
import { theme } from "@src/utils/theme";
import {
	ChangeEventHandler,
	Children,
	ReactElement,
	ReactNode,
	RefObject,
	cloneElement,
	isValidElement,
	useEffect,
	useRef,
	useState
} from "react";
import Text, { TextProps } from "../Text";

const NO_RESULT_TEST = "🥒 전체";
const NO_SEARCH_RESULT_TEXT = "검색결과가 없습니다";

interface SelectProps {
	trigger: ReactElement;
	children: ReactNode;
	value: string | undefined;
	onChange: (selectedValue: string) => void;
	isSearchActive?: boolean;
}

const Select = ({ trigger, children, value, onChange }: SelectProps) => {
	const ref = useRef<HTMLSelectElement>(null);
	const { searchValue } = useSearch();
	const { options } = useOptions(ref, children);
	const [isOpen, setIsOpen] = useState(false);

	const toggleSelect = () => {
		setIsOpen(!isOpen);
	};

	const closeSelect = () => {
		setIsOpen(false);
	};

	const onClick = (value: string) => {
		if (ref.current) {
			ref.current.value = value;
		}
		onChange(value);
		closeSelect();
	};

	const buttonText = options
		.filter((option) => option.value === value)
		.at(0)?.label;

	const searchedOptions = options.filter((option) =>
		option.label.includes(searchValue)
	);

	const updateTextInChildren = (
		children: ReactNode,
		newText: string
	): ReactNode => {
		return Children.map(children, (child) => {
			if (isValidElement(child) && child.type === Text.Span) {
				const typedChild = child as ReactElement<TextProps>;
				return cloneElement(typedChild, { children: newText });
			} else if (isValidElement(child)) {
				const typedChild = child as ReactElement;
				if (typedChild.props.children) {
					return cloneElement(typedChild, {
						children: updateTextInChildren(typedChild.props.children, newText)
					});
				}
			}
			return child;
		});
	};

	const triggerText = trigger.props.children;
	const isTextSpan =
		isValidElement(triggerText) && triggerText.type === Text.Span;

	const clonedTrigger = cloneElement(trigger, {
		children: isTextSpan
			? updateTextInChildren(
					trigger.props.children,
					buttonText ?? NO_RESULT_TEST
			  )
			: buttonText ?? NO_RESULT_TEST,
		onClick: toggleSelect
	});

	// Container 밖을 클릭하면 Select가 닫히도록 하는 로직
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const clickOutsideHandler = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				closeSelect();
			}
		};

		if (isOpen) document.addEventListener("click", clickOutsideHandler);

		return () => document.removeEventListener("click", clickOutsideHandler);
	}, [isOpen, closeSelect, containerRef]);

	return (
		<Container ref={containerRef}>
			{clonedTrigger}
			<select ref={ref} style={{ display: "none" }}>
				{children}
			</select>

			<SelectUlWrapper isOpen={isOpen}>
				<SelectUl>
					{searchedOptions.map((option) => (
						<SelectLi key={option.value} onClick={() => onClick(option.value)}>
							{option.textContent}
						</SelectLi>
					))}
					{searchedOptions.length === 0 && (
						<SelectLi>{NO_SEARCH_RESULT_TEXT}</SelectLi>
					)}
				</SelectUl>
			</SelectUlWrapper>
		</Container>
	);
};

export default Select;

const useOptions = (ref: RefObject<HTMLSelectElement>, children: ReactNode) => {
	const [options, setOptions] = useState<HTMLOptionElement[]>([]);

	useEffect(() => {
		if (ref.current) {
			setOptions(Array.from(ref.current.querySelectorAll("option")));
		}
	}, [children]);

	return {
		options
	};
};

const useSearch = () => {
	const [searchValue, setSearchValue] = useState<string>("");

	const onChangeSearch: ChangeEventHandler<HTMLInputElement> = (event) => {
		const { value } = event.target;
		setSearchValue(value);
	};

	return {
		searchValue,
		onChangeSearch
	};
};

const Container = styled.div`
	position: static;
`;

const SelectUlWrapper = styled.div<{ isOpen: boolean }>`
	position: absolute;
	left: ${getRem(20)};
	width: calc(100vw - ${getRem(38)});
	border-radius: 0.5rem;
	animation: ${(p) => (p.isOpen ? showUp : showOut)} 0.3s ease-in-out;
	display: ${(p) => (p.isOpen ? "block" : "none")};
	background-color: ${theme.colors.grey850};
	padding: ${getRem(10)} ${getRem(10)} ${getRem(20)};
	margin-top: ${getRem(15)};
`;

const showUp = keyframes`
    0% { opacity:0; }
    100% { opacity:1; }
    `;
const showOut = keyframes`
    0% { opacity:1; }
    100% { opacity:0; }
`;

const SelectUl = styled.ul`
	max-height: 30svh;
	overflow-y: auto;
`;

const SelectLi = styled.li`
	cursor: pointer;
	padding: 0.5rem 0;
`;
