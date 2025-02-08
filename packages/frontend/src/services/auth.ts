import { api } from './api';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    username: string;
    userId: string;
}

class AuthService {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';
    private static USER_KEY = 'user';

    static async login(username: string, password: string): Promise<void> {
        const response = await api.post<AuthResponse>('/auth/login', {
            username,
            password,
        });

        this.setTokens(response.data);
        this.setUser(this.parseToken(response.data.accessToken));
    }

    static async register(username: string, password: string): Promise<void> {
        const response = await api.post<AuthResponse>('/auth/register', {
            username,
            password,
        });

        this.setTokens(response.data);
        this.setUser(this.parseToken(response.data.accessToken));
    }

    static async logout(): Promise<void> {
        try {
            const user = this.getUser();
            if (user) {
                await api.post('/auth/logout', { userId: user.userId });
            }
        } finally {
            this.clearAuth();
        }
    }

    static async refreshToken(): Promise<string> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<AuthResponse>('/auth/refresh', {
            refreshToken,
        });

        this.setTokens(response.data);
        this.setUser(this.parseToken(response.data.accessToken));
        return response.data.accessToken;
    }

    static getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static getUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    static isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    private static setTokens(tokens: AuthResponse): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }

    private static setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    private static clearAuth(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    private static parseToken(token: string): User {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            userId: payload.userId,
            username: payload.username,
        };
    }
}

export default AuthService;
