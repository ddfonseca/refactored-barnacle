import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import { setupTestDB } from "./setup";
import { Product } from "../products/product.model";
import { createServer } from "../server";
import { createTestUser, getAuthToken } from "./helpers";

setupTestDB();

let app: Express;
let authToken: string;

beforeAll(async () => {
	app = await createServer();
	await createTestUser();
	authToken = await getAuthToken(app);
	console.log(authToken);
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("Product Endpoints", () => {
	describe("GET /api/products", () => {
		it("should return 401 when no token is provided", async () => {
			const res = await request(app).get("/api/products");
			expect(res.status).toBe(401);
		});

		it("should return empty array when no products exist", async () => {
			const res = await request(app).get("/api/products").set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body.products).toEqual([]);
			expect(res.body.pagination.total).toBe(0);
		});

		it("should return products with pagination", async () => {
			// Create test products
			await Product.create([
				{ name: "Product 1", description: "Desc 1", price: 100, category: "Category 1", quantity: 10 },
				{ name: "Product 2", description: "Desc 2", price: 200, category: "Category 2", quantity: 20 },
			]);

			const res = await request(app).get("/api/products").set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(2);
			expect(res.body.pagination.total).toBe(2);
		});

		it("should filter products by category", async () => {
			await Product.create([
				{ name: "Product 1", description: "Desc 1", price: 100, category: "Category 1", quantity: 10 },
				{ name: "Product 2", description: "Desc 2", price: 200, category: "Category 2", quantity: 20 },
			]);

			const res = await request(app)
				.get("/api/products?category=Category 1")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("Product 1");
		});

		it("should handle default sorting when sortBy is not provided", async () => {
			await Product.create({
				name: "Product A",
				description: "First",
				price: 100,
				category: "Category 1",
				quantity: 10,
			});
			await Product.create({
				name: "Product B",
				description: "Second",
				price: 200,
				category: "Category 1",
				quantity: 20,
			});

			const res = await request(app)
				.get("/api/products?sortOrder=desc")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(2);
			// Should default to sorting by createdAt
			expect(res.body.products[0].name).toBe("Product B");
			expect(res.body.products[1].name).toBe("Product A");
		});

		it("should handle partial price range filters", async () => {
			await Product.create([
				{ name: "Budget Product", description: "Cheap", price: 50, category: "Category 1", quantity: 10 },
				{ name: "Mid Product", description: "Medium", price: 150, category: "Category 1", quantity: 20 },
				{
					name: "Expensive Product",
					description: "Expensive",
					price: 300,
					category: "Category 1",
					quantity: 5,
				},
			]);

			// Test minPrice only
			let res = await request(app)
				.get("/api/products?minPrice=200")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("Expensive Product");

			// Test maxPrice only
			res = await request(app).get("/api/products?maxPrice=100").set("Authorization", `Bearer ${authToken}`);
			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("Budget Product");
		});

		it("should handle partial quantity range filters", async () => {
			await Product.create([
				{ name: "Low Stock", description: "Few items", price: 100, category: "Category 1", quantity: 5 },
				{ name: "Medium Stock", description: "Some items", price: 100, category: "Category 1", quantity: 15 },
				{ name: "High Stock", description: "Many items", price: 100, category: "Category 1", quantity: 25 },
			]);

			// Test minQuantity only
			let res = await request(app)
				.get("/api/products?minQuantity=20")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("High Stock");

			// Test maxQuantity only
			res = await request(app)
				.get("/api/products?maxQuantity=10")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("Low Stock");
		});
	});

	describe("POST /api/products", () => {
		it("should return 401 when no token is provided", async () => {
			const productData = {
				name: "New Product",
				description: "New Description",
				price: 150,
				category: "New Category",
				quantity: 15,
			};

			const res = await request(app).post("/api/products").send(productData);
			expect(res.status).toBe(401);
		});

		it("should create a new product", async () => {
			const productData = {
				name: "New Product",
				description: "New Description",
				price: 150,
				category: "New Category",
				quantity: 15,
			};

			const res = await request(app)
				.post("/api/products")
				.set("Authorization", `Bearer ${authToken}`)
				.send(productData);

			expect(res.status).toBe(201);
			expect(res.body.name).toBe(productData.name);
			expect(res.body.price).toBe(productData.price);

			// Verify product was saved to database
			const product = await Product.findById(res.body._id);
			expect(product).toBeTruthy();
			expect(product?.name).toBe(productData.name);
		});

		it("should return 400 for invalid product data", async () => {
			const invalidProduct = {
				name: "", // Invalid: empty name
				price: -100, // Invalid: negative price
			};

			const res = await request(app)
				.post("/api/products")
				.set("Authorization", `Bearer ${authToken}`)
				.send(invalidProduct);

			expect(res.status).toBe(400);
		});
	});

	describe("PUT /api/products/:id", () => {
		it("should return 401 when no token is provided", async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app).put(`/api/products/${nonExistentId}`).send({ name: "Updated Name" });

			expect(res.status).toBe(401);
		});

		it("should update an existing product", async () => {
			const product = await Product.create({
				name: "Original Product",
				description: "Original Description",
				price: 100,
				category: "Original Category",
				quantity: 10,
			});

			const updateData = {
				name: "Updated Product",
				price: 200,
			};

			const res = await request(app)
				.put(`/api/products/${product._id}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send(updateData);

			expect(res.status).toBe(200);
			expect(res.body.name).toBe(updateData.name);
			expect(res.body.price).toBe(updateData.price);
			expect(res.body.description).toBe(product.description); // Unchanged field

			// Verify update in database
			const updatedProduct = await Product.findById(product._id);
			expect(updatedProduct?.name).toBe(updateData.name);
		});

		it("should return 404 for non-existent product", async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app)
				.put(`/api/products/${nonExistentId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ name: "Updated Name" });

			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /api/products/:id", () => {
		it("should return 401 when no token is provided", async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app).delete(`/api/products/${nonExistentId}`);

			expect(res.status).toBe(401);
		});

		it("should soft delete a product", async () => {
			const product = await Product.create({
				name: "Product to Delete",
				description: "Description",
				price: 100,
				category: "Category",
				quantity: 10,
			});

			const res = await request(app)
				.delete(`/api/products/${product._id}`)
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);

			// Verify product was soft deleted
			const deletedProduct = await Product.findById(product._id);
			expect(deletedProduct?.isActive).toBe(false);
		});

		it("should return 404 for non-existent product", async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app)
				.delete(`/api/products/${nonExistentId}`)
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(404);
		});
	});

	describe("GET /api/products/search", () => {
		beforeEach(async () => {
			await Product.create([
				{
					name: "iPhone 12",
					description: "Apple smartphone",
					price: 999,
					category: "Electronics",
					quantity: 10,
				},
				{ name: "Samsung TV", description: "Smart TV", price: 799, category: "Electronics", quantity: 5 },
				{
					name: "Running Shoes",
					description: "Sports equipment",
					price: 99,
					category: "Sports",
					quantity: 20,
				},
			]);
		});

		it("should return 401 when no token is provided", async () => {
			const res = await request(app).get("/api/products/search?q=iPhone");
			expect(res.status).toBe(401);
		});

		it("should search products by name", async () => {
			const res = await request(app)
				.get("/api/products/search?q=iPhone")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("iPhone 12");
		});

		it("should search products by category", async () => {
			const res = await request(app)
				.get("/api/products/search?q=Electronics")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(2);
		});

		it("should return 400 if search term is missing", async () => {
			const res = await request(app).get("/api/products/search").set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(400);
		});
	});
});
