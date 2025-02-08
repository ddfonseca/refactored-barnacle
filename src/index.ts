import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "./utils/logger";
import { createServer } from "./server";

// Database connection
mongoose
	.connect(config.mongodbUri)
	.then(() => logger.info("Connected to MongoDB"))
	.catch((error) => {
		logger.error("MongoDB connection error:", error);
		process.exit(1);
	});

// Create and start server
createServer().then(app => {
	app.listen(config.port, () => {
		logger.info(`Server is running on port ${config.port}`);
	});
});
