import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { logger } from "../utils/logger";
import { MongoDBProductRepository } from "./product.repository";

export class ProductController {
	private readonly productService: ProductService;

	constructor() {
		const productRepository = new MongoDBProductRepository();
		this.productService = new ProductService(productRepository);
	}

	async getAllProducts(req: Request, res: Response) {
		try {
			const options = {
				page: parseInt(req.query.page as string) || 1,
				limit: parseInt(req.query.limit as string) || 10,
				sortBy: req.query.sortBy as string,
				sortOrder: req.query.sortOrder as "asc" | "desc",
				category: req.query.category as string,
				minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
				maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
				minQuantity: req.query.minQuantity ? parseInt(req.query.minQuantity as string) : undefined,
				maxQuantity: req.query.maxQuantity ? parseInt(req.query.maxQuantity as string) : undefined,
			};

			const result = await this.productService.getAllProducts(options);
			res.json(result);
		} catch (error) {
			logger.error("Error in getAllProducts:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async createProduct(req: Request, res: Response) {
		try {
			const product = await this.productService.createProduct(req.body);
			res.status(201).json(product);
		} catch (error) {
			logger.error("Error in createProduct:", error);
			res.status(400).json({ message: "Invalid product data" });
		}
	}

	async updateProduct(req: Request, res: Response) {
		try {
			const product = await this.productService.updateProduct(req.params.id, req.body);
			res.json(product);
		} catch (error: any) {
			logger.error("Error in updateProduct:", error);
			if (error?.message === "Product not found") {
				res.status(404).json({ message: "Product not found" });
			} else {
				res.status(400).json({ message: "Invalid product data" });
			}
		}
	}

	async deleteProduct(req: Request, res: Response) {
		try {
			const product = await this.productService.deleteProduct(req.params.id);
			res.json(product);
		} catch (error: any) {
			logger.error("Error in deleteProduct:", error);
			if (error?.message === "Product not found") {
				res.status(404).json({ message: "Product not found" });
			} else {
				res.status(500).json({ message: "Internal server error" });
			}
		}
	}

	async searchProducts(req: Request, res: Response) {
		try {
			const searchTerm = req.query.q as string;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			if (!searchTerm) {
				return res.status(400).json({ message: "Search term is required" });
			}

			const result = await this.productService.searchProducts(searchTerm, page, limit);
			res.json(result);
		} catch (error) {
			logger.error("Error in searchProducts:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}
