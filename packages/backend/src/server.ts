import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createProductRouter } from "./products/product.routes";
import { createAuthRouter } from "./auth/auth.routes";

export const createServer = async () => {
	const app = express();

	// Middleware
	app.use(helmet());
	app.use(cors());
	app.use(express.json());

	// Routes
	app.use("/api/auth", createAuthRouter());
	app.use("/api/products", createProductRouter());

	// Error handling middleware
	app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	});

	return app;
};
