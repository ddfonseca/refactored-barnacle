import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import { setupTestDB } from "./setup";
import { Product } from "../products/product.model";
import { createServer } from "../server";

setupTestDB();

let app: Express;

beforeAll(async () => {
	app = await createServer();
});

describe("Product Endpoints", () => {
	describe("GET /api/products", () => {
		it("should return empty array when no products exist", async () => {
			const res = await request(app).get("/api/products");

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

			const res = await request(app).get("/api/products");

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(2);
			expect(res.body.pagination.total).toBe(2);
		});

		it("should filter products by category", async () => {
			await Product.create([
				{ name: "Product 1", description: "Desc 1", price: 100, category: "Category 1", quantity: 10 },
				{ name: "Product 2", description: "Desc 2", price: 200, category: "Category 2", quantity: 20 },
			]);

			const res = await request(app).get("/api/products?category=Category 1");

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("Product 1");
		});
	});

	describe("POST /api/products", () => {
		it("should create a new product", async () => {
			const productData = {
				name: "New Product",
				description: "New Description",
				price: 150,
				category: "New Category",
				quantity: 15,
			};

			const res = await request(app).post("/api/products").send(productData);

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

			const res = await request(app).post("/api/products").send(invalidProduct);

			expect(res.status).toBe(400);
		});
	});

	describe("PUT /api/products/:id", () => {
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

			const res = await request(app).put(`/api/products/${product._id}`).send(updateData);

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
			const res = await request(app).put(`/api/products/${nonExistentId}`).send({ name: "Updated Name" });

			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /api/products/:id", () => {
		it("should soft delete a product", async () => {
			const product = await Product.create({
				name: "Product to Delete",
				description: "Description",
				price: 100,
				category: "Category",
				quantity: 10,
			});

			const res = await request(app).delete(`/api/products/${product._id}`);

			expect(res.status).toBe(200);
			expect(res.body.isActive).toBe(false);

			// Verify product is soft deleted in database
			const deletedProduct = await Product.findById(product._id);
			expect(deletedProduct?.isActive).toBe(false);
		});

		it("should return 404 for non-existent product", async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app).delete(`/api/products/${nonExistentId}`);

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

		it("should search products by name", async () => {
			const res = await request(app).get("/api/products/search?q=iPhone");

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0].name).toBe("iPhone 12");
		});

		it("should search products by category", async () => {
			const res = await request(app).get("/api/products/search?q=Electronics");

			expect(res.status).toBe(200);
			expect(res.body.products).toHaveLength(2);
		});

		it("should return 400 if search term is missing", async () => {
			const res = await request(app).get("/api/products/search");

			expect(res.status).toBe(400);
		});
	});
});
