import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    AUTH_EXPIRED_EVENT,
    AUTH_TOKENS_UPDATED_EVENT,
    clearTokenPair,
    getAccessToken,
    getRefreshToken,
    setTokenPair,
    type AuthTokenPair,
} from '../../api/tokenStorage';

type UserContextValue = {
    token: string | null;
    refreshToken: string | null;
    isLoggedIn: boolean;
    role: "admin" | "doctor" | "elder" | null;
    setRole: (role: "admin" | "doctor" | "elder") => void;
    setAuth: (tokens: AuthTokenPair) => void;
    clearAuth: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => getAccessToken());
    const [refreshToken, setRefreshToken] = useState<string | null>(() => getRefreshToken());
    const [role, setRole] = useState<"admin" | "doctor" | "elder" | null>(null);

    const setAuth = useCallback((tokens: AuthTokenPair) => {
        setToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setTokenPair(tokens);
    }, []);

    const clearAuth = useCallback(() => {
        setToken(null);
        setRefreshToken(null);
        clearTokenPair();
    }, []);

    useEffect(() => {
        const syncTokens = () => {
            setToken(getAccessToken());
            setRefreshToken(getRefreshToken());
        };
        const clearTokens = () => {
            setToken(null);
            setRefreshToken(null);
        };

        window.addEventListener(AUTH_TOKENS_UPDATED_EVENT, syncTokens);
        window.addEventListener(AUTH_EXPIRED_EVENT, clearTokens);
        return () => {
            window.removeEventListener(AUTH_TOKENS_UPDATED_EVENT, syncTokens);
            window.removeEventListener(AUTH_EXPIRED_EVENT, clearTokens);
        };
    }, []);

    const value = useMemo(
        () => ({
            token,
            refreshToken,
            isLoggedIn: Boolean(token),
            role,
            setRole,
            setAuth,
            clearAuth,
        }),
        [token, refreshToken, role, setAuth, clearAuth]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUserContext must be used within UserProvider');
    }
    return ctx;
};
