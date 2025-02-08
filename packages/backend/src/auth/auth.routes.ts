import { Router } from "express";
import { AuthController } from "./auth.controller";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.register.bind(authController));
authRouter.post("/login", authController.login.bind(authController));
authRouter.post("/refresh", authController.refreshToken.bind(authController));
authRouter.post("/logout", authController.logout.bind(authController));
