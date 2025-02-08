import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { createAuthMiddleware } from "./auth.middleware";
import { MongoDBUserRepository } from "../users/user.repository";

export const createAuthRouter = () => {
	const router = Router();
	const userRepository = new MongoDBUserRepository();
	const authService = new AuthService(userRepository);
	const authController = new AuthController(authService);
	const authenticateToken = createAuthMiddleware(authService);

	router.post("/register", authController.register.bind(authController));
	router.post("/login", authController.login.bind(authController));
	router.post("/refresh", authenticateToken, authController.refreshToken.bind(authController));
	router.post("/logout", authenticateToken, authController.logout.bind(authController));

	return router;
};
