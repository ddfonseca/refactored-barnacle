import { IProduct } from "./product.model";
import { config } from "../config";
import { IProductRepository } from "./product.repository";

interface QueryOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	minQuantity?: number;
	maxQuantity?: number;
}

export class ProductService {
	constructor(private readonly productRepository: IProductRepository) {}

	async getAllProducts(options: QueryOptions) {
		const {
			page = 1,
			limit = config.defaultPageSize,
			sortBy = "createdAt",
			sortOrder = "desc",
			category,
			minPrice,
			maxPrice,
			minQuantity,
			maxQuantity,
		} = options;

		const query: any = { isActive: true };

		if (category) query.category = category;
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = minPrice;
			if (maxPrice) query.price.$lte = maxPrice;
		}
		if (minQuantity || maxQuantity) {
			query.quantity = {};
			if (minQuantity) query.quantity.$gte = minQuantity;
			if (maxQuantity) query.quantity.$lte = maxQuantity;
		}

		const skip = (page - 1) * limit;
		const sortOptions = { [sortBy]: sortOrder };

		const [products, total] = await Promise.all([
			this.productRepository.findAll(query, {
				skip,
				limit: Math.min(limit, config.maxPageSize),
				sort: sortOptions,
			}),
			this.productRepository.count(query),
		]);

		return {
			products,
			pagination: {
				total,
				page,
				pages: Math.ceil(total / limit),
			},
		};
	}

	async createProduct(productData: Partial<IProduct>) {
		return this.productRepository.create(productData);
	}

	async updateProduct(id: string, updateData: Partial<IProduct>) {
		const product = await this.productRepository.findByIdAndUpdate(id, updateData);
		if (!product) throw new Error("Product not found");
		return product;
	}

	async deleteProduct(id: string) {
		const product = await this.productRepository.findByIdAndUpdate(id, {
			isActive: false,
			updatedAt: new Date(),
		});
		if (!product) throw new Error("Product not found");
		return product;
	}

	async searchProducts(searchTerm: string, page = 1, limit = config.defaultPageSize) {
		const query = {
			$text: { $search: searchTerm },
			isActive: true,
		};

		const skip = (page - 1) * limit;

		const [products, total] = await Promise.all([
			this.productRepository.search(query, {
				skip,
				limit: Math.min(limit, config.maxPageSize),
			}),
			this.productRepository.count(query),
		]);

		return {
			products,
			pagination: {
				total,
				page,
				pages: Math.ceil(total / limit),
			},
		};
	}
}
