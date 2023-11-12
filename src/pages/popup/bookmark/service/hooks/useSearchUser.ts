import useDebounce from "@src/pages/popup/hooks/useDebounce";
import { ChangeEvent, useEffect } from "react";
import useSearchStore from "../store/search";

const useSearchUser = () => {
	const { setKeyword: setStoreSearchKeyword, keyword: storeKeyword } =
		useSearchStore();
	const debounceKeyword = useDebounce(storeKeyword, 500);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setStoreSearchKeyword(value);
	};

	useEffect(() => {
		setStoreSearchKeyword(debounceKeyword);
	}, [debounceKeyword, setStoreSearchKeyword]);

	const initializeKeyword = () => {
		setStoreSearchKeyword("");
	};

	return {
		keyword: storeKeyword,
		debounceKeyword,
		handleChange,
		initializeKeyword
	};
};

export default useSearchUser;
