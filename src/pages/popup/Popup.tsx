import { ThemeProvider } from "@emotion/react";
import Login from "./pages/Login";
import { theme } from "@src/utils/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import BookmarkPage from "./pages/Bookmark";
import AuthProvider from "./context/AuthContext";
import GlobalStyle from "@src/ui/GlobalStyle";
import ToastList from "@src/ui/toast/ToastList";

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
							<Route path='/' element={<BookmarkPage />} />
							<Route path='/login' element={<Login />} />
						</Routes>
					</ThemeProvider>
				</AuthProvider>
			</MemoryRouter>
		</QueryClientProvider>
	);
}
