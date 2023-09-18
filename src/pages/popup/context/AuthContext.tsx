/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	createContext,
	useEffect,
	useReducer,
	useCallback,
	useMemo
} from "react";
import { getMemberCode } from "../auth/store/auth";
import { useNavigate } from "react-router-dom";

export type ActionMapType<M extends { [index: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key;
		  }
		: {
				type: Key;
				payload: M[Key];
		  };
};

interface User {
	code?: string;
	[key: string]: any;
}

export type AuthUserType = null | User;

export type AuthStateType = {
	isInitialized: boolean;
	user: AuthUserType;
};

export type Auth0ContextType = {
	isInitialized: boolean;
	user: AuthUserType;
	logout: () => void;
};

enum Types {
	INITIAL = "INITIAL",
	LOGOUT = "LOGOUT"
}

type Payload = {
	[Types.INITIAL]: {
		user: AuthUserType;
	};
	[Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
	isInitialized: false,
	user: null
};

const reducer = (state: AuthStateType, action: ActionsType) => {
	if (action.type === Types.INITIAL) {
		return {
			isInitialized: true,
			user: action.payload.user
		};
	}
	if (action.type === Types.LOGOUT) {
		return {
			...state,
			isAuthenticated: false,
			user: null
		};
	}
	return state;
};

export const AuthContext = createContext<Auth0ContextType | null>(null);

type AuthProviderProps = {
	children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
	const router = useNavigate();
	const [state, dispatch] = useReducer(reducer, initialState);

	const initialize = useCallback(async () => {
		try {
			const code = await getMemberCode();
			if (code && code.length > 0) {
				dispatch({
					type: Types.INITIAL,
					payload: {
						user: {
							code
						}
					}
				});
			} else {
				dispatch({
					type: Types.INITIAL,
					payload: {
						user: null
					}
				});
				router("/login");
			}
		} catch (error) {
			console.error(error);
			dispatch({
				type: Types.INITIAL,
				payload: {
					user: null
				}
			});
		}
	}, []);

	// LOGOUT
	const logout = useCallback(() => {
		dispatch({
			type: Types.LOGOUT
		});
	}, []);

	// INITIALIZE
	useEffect(() => {
		initialize();
	}, [initialize]);

	const memoizedValue = useMemo(
		() => ({
			isInitialized: state.isInitialized,
			user: state.user,
			logout
		}),
		[state.isInitialized, state.user, logout]
	);

	return (
		<AuthContext.Provider value={memoizedValue}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
