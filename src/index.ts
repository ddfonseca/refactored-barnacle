import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { logger } from "./utils/logger";
import { ProductController } from "./products/product.controller";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();
const productController = new ProductController();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection
mongoose
	.connect(config.mongodbUri)
	.then(() => logger.info("Connected to MongoDB"))
	.catch((error) => {
		logger.error("MongoDB connection error:", error);
		process.exit(1);
	});

// Product routes
app.get("/api/products", productController.getAllProducts.bind(productController));
app.post("/api/products", productController.createProduct.bind(productController));
app.put("/api/products/:id", productController.updateProduct.bind(productController));
app.delete("/api/products/:id", productController.deleteProduct.bind(productController));
app.get("/api/products/search", productController.searchProducts.bind(productController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	logger.error(err);
	res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(config.port, () => {
	logger.info(`Server is running on port ${config.port}`);
});
