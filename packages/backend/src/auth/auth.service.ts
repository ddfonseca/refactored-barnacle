import jwt from 'jsonwebtoken';
import { User } from '../users/user.model';
import { IUserRepository } from '../users/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key';

export class AuthService {
    constructor(private userRepository: IUserRepository) {}

    private generateTokens(user: User) {
        const accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    async verifyAccessToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    private async verifyRefreshToken(token: string) {
        try {
            const decoded = jwt.verify(token, REFRESH_SECRET) as { userId: string };
            const user = await this.userRepository.findById(decoded.userId);
            
            if (!user || user.refreshToken !== token) {
                throw new Error('Invalid refresh token');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async register(username: string, password: string) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Create new user
        const user = await this.userRepository.create(username, password);

        // Generate tokens
        const tokens = this.generateTokens(user);

        // Save refresh token
        await this.userRepository.updateRefreshToken(user._id, tokens.refreshToken);

        return tokens;
    }

    async login(username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const tokens = this.generateTokens(user);
        
        // Save refresh token to user document
        await this.userRepository.updateRefreshToken(user._id, tokens.refreshToken);

        return tokens;
    }

    async refreshToken(refreshToken: string) {
        const user = await this.verifyRefreshToken(refreshToken);
        const tokens = this.generateTokens(user);

        // Update refresh token
        await this.userRepository.updateRefreshToken(user._id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string) {
        const user = await this.userRepository.updateRefreshToken(userId, undefined);
        if (!user) {
            throw new Error('User not found');
        }
    }
}
