import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, Types } from "mongoose";
import { getConnectionToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

describe("ProductsController (e2e)", () => {
	let app: INestApplication;
	let mongoServer: MongoMemoryServer;
	let dbConnection: Connection;
	let jwtService: JwtService;
	let authToken: string;

	beforeAll(async () => {
		// Start in-memory MongoDB instance
		mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();

		// Override MongoDB URI for testing
		process.env.MONGODB_URI = mongoUri;

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix("api");
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				forbidNonWhitelisted: true,
			})
		);

		dbConnection = moduleFixture.get(getConnectionToken());
		jwtService = moduleFixture.get(JwtService);

		// Create a test JWT token
		authToken = jwtService.sign({ sub: "test-user", username: "test" });

		await app.init();
	});

	afterAll(async () => {
		await dbConnection.close();
		await mongoServer.stop();
		await app.close();
	});

	beforeEach(async () => {
		// Clear the products collection before each test
		await dbConnection.collection("products").deleteMany({});
	});

	const testProduct = {
		name: "Test Product",
		description: "Test Description",
		price: 99.99,
		quantity: 10,
		category: "Test Category",
	};

	describe("POST /api/products", () => {
		it("should create a new product", async () => {
			const response = await request(app.getHttpServer())
				.post("/api/products")
				.set("Authorization", `Bearer ${authToken}`)
				.send(testProduct)
				.expect(201);

			expect(response.body).toMatchObject({
				...testProduct,
				_id: expect.any(String),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});
		});

		it("should validate product data", async () => {
			const invalidProduct = {
				name: "", // Invalid: empty name
				price: -10, // Invalid: negative price
				quantity: -5, // Invalid: negative quantity
			};

			await request(app.getHttpServer())
				.post("/api/products")
				.set("Authorization", `Bearer ${authToken}`)
				.send(invalidProduct)
				.expect(400);
		});
	});

	describe("GET /api/products", () => {
		beforeEach(async () => {
			// Create test products
			const products = [
				{ ...testProduct, name: "Product 1", price: 10, isActive: true },
				{ ...testProduct, name: "Product 2", price: 20, isActive: true },
				{ ...testProduct, name: "Product 3", price: 30, isActive: true },
			].map((product) => ({ ...product, _id: new Types.ObjectId() }));

			await dbConnection.collection("products").insertMany(products);
		});

		it("should return paginated products", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/products")
				.set("Authorization", `Bearer ${authToken}`)
				.query({ page: 1, limit: 2 })
				.expect(200);

			expect(response.body).toMatchObject({
				products: expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]),
				pagination: expect.objectContaining({
					total: expect.any(Number),
					page: expect.any(Number),
					pages: expect.any(Number),
				}),
			});
		});

		it("should filter products by price range", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/products")
				.set("Authorization", `Bearer ${authToken}`)
				.query({ minPrice: 15, maxPrice: 25 })
				.expect(200);

			expect(response.body.products).toHaveLength(1);
			expect(response.body.products[0].name).toBe("Product 2");
		});
	});

	describe("PUT /api/products/:id", () => {
		let productId: string;

		beforeEach(async () => {
			const doc = { ...testProduct, _id: new Types.ObjectId(), isActive: true };
			await dbConnection.collection("products").insertOne(doc);
			productId = doc._id.toString();
		});

		it("should update a product", async () => {
			const updateData = {
				name: "Updated Product",
				price: 199.99,
			};

			const response = await request(app.getHttpServer())
				.put(`/api/products/${productId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send(updateData)
				.expect(200);

			expect(response.body).toMatchObject({
				...testProduct,
				...updateData,
				_id: productId,
			});
		});

		it("should return 404 for non-existent product", async () => {
			const nonExistentId = "123456789012345678901234";
			await request(app.getHttpServer())
				.put(`/api/products/${nonExistentId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ name: "Updated Product" })
				.expect(404);
		});
	});

	describe("DELETE /api/products/:id", () => {
		let productId: string;

		beforeEach(async () => {
			const doc = { ...testProduct, _id: new Types.ObjectId(), isActive: true };
			await dbConnection.collection("products").insertOne(doc);
			productId = doc._id.toString();
		});

		it("should delete a product", async () => {
			await request(app.getHttpServer())
				.delete(`/api/products/${productId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);

			// Verify product is marked as inactive
			const product = await dbConnection
				.collection("products")
				.findOne({ _id: new Types.ObjectId(productId) });
			expect(product?.isActive).toBe(false);
		});

		it("should return 404 for non-existent product", async () => {
			const nonExistentId = "123456789012345678901234";
			await request(app.getHttpServer())
				.delete(`/api/products/${nonExistentId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.expect(404);
		});
	});

	describe("GET /api/products/search", () => {
		beforeEach(async () => {
			const products = [
				{ ...testProduct, name: "Gaming Laptop", description: "High performance", isActive: true },
				{ ...testProduct, name: "Office Laptop", description: "For business", isActive: true },
				{ ...testProduct, name: "Gaming Mouse", description: "RGB lighting", isActive: true },
			].map((product) => ({ ...product, _id: new Types.ObjectId() }));

			await dbConnection.collection("products").insertMany(products);
		});

		it("should search products by query", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/products/search")
				.set("Authorization", `Bearer ${authToken}`)
				.query({ q: "gaming" })
				.expect(200);

			expect(response.body.products).toHaveLength(2);
			expect(
				response.body.products.every(
					(item: any) =>
						item.name.toLowerCase().includes("gaming") || item.description.toLowerCase().includes("gaming")
				)
			).toBe(true);
		});

		it("should return 400 for empty search query", async () => {
			await request(app.getHttpServer())
				.get("/api/products/search")
				.set("Authorization", `Bearer ${authToken}`)
				.query({ q: "" })
				.expect(400);
		});
	});
});
