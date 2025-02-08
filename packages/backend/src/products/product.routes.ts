import { Router } from "express";
import { ProductController } from "./product.controller";
import { createAuthMiddleware } from "../auth/auth.middleware";
import { AuthService } from "../auth/auth.service";
import { MongoDBUserRepository } from "../users/user.repository";

export const createProductRouter = () => {
    const router = Router();
    const productController = new ProductController();

    // Create auth middleware
    const userRepository = new MongoDBUserRepository();
    const authService = new AuthService(userRepository);
    const authenticateToken = createAuthMiddleware(authService);

    // Product routes
    router.get("/", authenticateToken, productController.getAllProducts.bind(productController));
    router.post("/", authenticateToken, productController.createProduct.bind(productController));
    router.put("/:id", authenticateToken, productController.updateProduct.bind(productController));
    router.delete("/:id", authenticateToken, productController.deleteProduct.bind(productController));
    router.get("/search", authenticateToken, productController.searchProducts.bind(productController));

    return router;
};
