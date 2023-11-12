import { ThemeProvider } from "@emotion/react";
import GlobalStyle from "@src/ui/GlobalStyle";
import ToastList from "@src/ui/toast/ToastList";
import { theme } from "@src/utils/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import AddBookmarkPage from "./pages/AddBookmarkPage";
import BookmarkPage from "./pages/BookmarkPage";
import BookmarkSearchPage from "./pages/BookmarkSearchPage";
import CategoryAddPage from "./pages/CategoryAddPage";
import Login from "./pages/Login";

const queryClient = new QueryClient();

export default function Popup(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<GlobalStyle />
			<ToastList />
			<MemoryRouter>
				<AuthProvider>
					<ThemeProvider theme={theme}>
						<Routes>
							<Route path='/' element={<AddBookmarkPage />} />
							<Route path='/login' element={<Login />} />
							<Route path='/bookmark' element={<BookmarkPage />} />
							<Route path='/bookmark/search' element={<BookmarkSearchPage />} />
							<Route
								path='/category/add'
								element={<CategoryAddPage mode='ADD' />}
							/>
						</Routes>
					</ThemeProvider>
				</AuthProvider>
			</MemoryRouter>
		</QueryClientProvider>
	);
}
