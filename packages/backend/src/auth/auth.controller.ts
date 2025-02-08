import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserModel } from '../users/user.model';

export const authRouter = Router();

// Register new user
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = new UserModel({ username, password });
        await user.save();

        // Generate tokens
        const tokens = AuthService.generateTokens(user);

        // Save refresh token
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(201).json(tokens);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login
authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const tokens = await AuthService.login(username, password);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Refresh token
authRouter.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await AuthService.refreshToken(refreshToken);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

// Logout
authRouter.post('/logout', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        await AuthService.logout(userId);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out' });
    }
});
