import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ProductController } from "./products/product.controller";
import { authRouter } from "./auth/auth.routes";
import { authenticateToken } from "./auth/auth.middleware";

export const createServer = async () => {
	const app = express();
	const productController = new ProductController();

	// Middleware
	app.use(helmet());
	app.use(cors());
	app.use(express.json());

	// Auth routes
	app.use("/api/auth", authRouter);

	// Protected Product routes
	app.get("/api/products", authenticateToken, productController.getAllProducts.bind(productController));
	app.post("/api/products", authenticateToken, productController.createProduct.bind(productController));
	app.put("/api/products/:id", authenticateToken, productController.updateProduct.bind(productController));
	app.delete("/api/products/:id", authenticateToken, productController.deleteProduct.bind(productController));
	app.get("/api/products/search", authenticateToken, productController.searchProducts.bind(productController));

	// Error handling middleware
	app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	});

	return app;
};
