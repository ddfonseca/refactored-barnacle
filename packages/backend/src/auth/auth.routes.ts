import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { createAuthMiddleware } from "./auth.middleware";
import { MongoDBUserRepository } from "../users/user.repository";

export const authRouter = Router();
const userRepository = new MongoDBUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
const authenticateToken = createAuthMiddleware(authService);

authRouter.post("/register", authController.register.bind(authController));
authRouter.post("/login", authController.login.bind(authController));
authRouter.post("/refresh", authenticateToken, authController.refreshToken.bind(authController));
authRouter.post("/logout", authenticateToken, authController.logout.bind(authController));
