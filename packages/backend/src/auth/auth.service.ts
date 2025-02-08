import jwt from 'jsonwebtoken';
import { User, UserModel } from '../users/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key';

export class AuthService {
    static generateTokens(user: User) {
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

    static async verifyAccessToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    static async verifyRefreshToken(token: string) {
        try {
            const decoded = jwt.verify(token, REFRESH_SECRET) as { userId: string };
            const user = await UserModel.findById(decoded.userId);
            
            if (!user || user.refreshToken !== token) {
                throw new Error('Invalid refresh token');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    static async login(username: string, password: string) {
        const user = await UserModel.findOne({ username });
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const tokens = this.generateTokens(user);
        
        // Save refresh token to user document
        user.refreshToken = tokens.refreshToken;
        await user.save();

        return tokens;
    }

    static async refreshToken(refreshToken: string) {
        const user = await this.verifyRefreshToken(refreshToken);
        const tokens = this.generateTokens(user);

        // Update refresh token
        user.refreshToken = tokens.refreshToken;
        await user.save();

        return tokens;
    }

    static async logout(userId: string) {
        await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
    }
}
