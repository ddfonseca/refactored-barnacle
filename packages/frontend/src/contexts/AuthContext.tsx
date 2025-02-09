import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '@/services/auth';
import { api } from '@/services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string; userId: string } | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
    const [user, setUser] = useState(AuthService.getUser());

    useEffect(() => {
        const initializeAuth = async () => {
            if (AuthService.isAuthenticated()) {
                try {
                    // Validate the current token or refresh if needed
                    await AuthService.validateToken();
                    setIsAuthenticated(true);
                    setUser(AuthService.getUser());
                } catch (error) {
                    // If validation fails, try to refresh the token
                    try {
                        await AuthService.refreshToken();
                        setIsAuthenticated(true);
                        setUser(AuthService.getUser());
                    } catch (refreshError) {
                        // If refresh fails, clear auth state
                        AuthService.clearAuth();
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                }
            }
        };

        initializeAuth();

        // Set up axios interceptor for token refresh
        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await AuthService.refreshToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        // If refresh token fails, logout user
                        await logout();
                        throw refreshError;
                    }
                }

                return Promise.reject(error);
            }
        );

        // Set authorization header for all requests
        const requestInterceptor = api.interceptors.request.use((config) => {
            const token = AuthService.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return () => {
            api.interceptors.response.eject(interceptor);
            api.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    const login = async (username: string, password: string) => {
        await AuthService.login(username, password);
        setIsAuthenticated(true);
        setUser(AuthService.getUser());
    };

    const register = async (username: string, password: string) => {
        await AuthService.register(username, password);
        setIsAuthenticated(true);
        setUser(AuthService.getUser());
    };

    const logout = async () => {
        await AuthService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
