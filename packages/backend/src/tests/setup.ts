import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load test environment variables
dotenv.config({ path: path.join(__dirname, "test.env") });

let mongoServer: MongoMemoryServer;

export const setupTestDB = () => {
	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();
		await mongoose.connect(mongoUri);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	afterEach(async () => {
		// Only clear products collection
		await mongoose.connection.db.collection('products').deleteMany({});
	});
};
