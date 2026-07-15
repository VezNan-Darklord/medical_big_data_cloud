import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { clearAccessToken, getAccessToken, setAccessToken } from '../../api/instance';

type UserContextValue = {
    token: string | null;
    refreshToken: string | null;
    isLoggedIn: boolean;
    role: "admin" | "doctor" | "elder" | null;
    setRole: (role: "admin" | "doctor" | "elder") => void;
    setAuth: (token: string) => void;
    setRefreshAuth: (refreshToken: string) => void;
    clearAuth: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(() => getAccessToken());
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const setAuth = useCallback((nextToken: string) => {
        setToken(nextToken);
        setAccessToken(nextToken);
    }, []);

    const setRefreshAuth = useCallback((nextRefreshToken: string) => {
        setRefreshToken(nextRefreshToken);
    }, []);

    const clearAuth = useCallback(() => {
        setToken(null);
        setRefreshToken(null);
        clearAccessToken();
    }, []);

    const [role, setRole] = useState<"admin" | "doctor" | "elder" | null>(null);

    const value = useMemo(
        () => ({
            token,
            refreshToken,
            isLoggedIn: Boolean(token),
            role,
            setRole,
            setAuth,
            setRefreshAuth,
            clearAuth,
        }),
        [token, refreshToken, role, setAuth, setRefreshAuth, clearAuth]
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
