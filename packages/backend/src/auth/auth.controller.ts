import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserModel } from '../users/user.model';

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const tokens = await this.authService.register(username, password);
            res.status(201).json(tokens);
        } catch (error) {
            if (error instanceof Error && error.message === 'Username already exists') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error creating user' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const tokens = await this.authService.login(username, password);
            res.json(tokens);
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid credentials') {
                return res.status(401).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error logging in' });
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refreshToken(refreshToken);
            res.json(tokens);
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid refresh token') {
                return res.status(401).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error refreshing token' });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            await this.authService.logout(userId);
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            if (error instanceof Error && error.message === 'User not found') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error logging out' });
        }
    }
}
