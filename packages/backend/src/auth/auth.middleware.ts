import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                username: string;
            };
        }
    }
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = await AuthService.verifyAccessToken(token);
        req.user = decoded as { userId: string; username: string };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
