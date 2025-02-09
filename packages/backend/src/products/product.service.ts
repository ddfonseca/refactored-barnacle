import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IProduct } from "./schemas/product.schema";
import { ProductRepository } from "./product.repository";

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

@Injectable()
export class ProductService {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly configService: ConfigService
	) {}

	async getAllProducts(options: QueryOptions) {
		try {
			const {
				page = 1,
				limit = this.configService.get<number>("app.defaultPageSize"),
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
			if (minPrice !== undefined || maxPrice !== undefined) {
				query.price = {};
				if (minPrice !== undefined) query.price.$gte = minPrice;
				if (maxPrice !== undefined) query.price.$lte = maxPrice;
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
					limit: Math.min(limit, this.configService.get<number>("app.maxPageSize")),
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
		} catch (error) {
			throw new HttpException("Error retrieving products", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async createProduct(productData: Partial<IProduct>) {
		try {
			if (
				!productData.name ||
				!productData.price ||
				!productData.category ||
				!productData.description ||
				!productData.quantity
			) {
				throw new HttpException("Missing required fields", HttpStatus.BAD_REQUEST);
			}

			if (productData.price < 0) {
				throw new HttpException("Price must be non-negative", HttpStatus.BAD_REQUEST);
			}

			if (productData.quantity < 0) {
				throw new HttpException("Quantity must be non-negative", HttpStatus.BAD_REQUEST);
			}

			return this.productRepository.create(productData);
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException("Error creating product", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateProduct(id: string, updateData: Partial<IProduct>) {
		try {
			if (updateData.price !== undefined && updateData.price < 0) {
				throw new HttpException("Price must be non-negative", HttpStatus.BAD_REQUEST);
			}

			if (updateData.quantity !== undefined && updateData.quantity < 0) {
				throw new HttpException("Quantity must be non-negative", HttpStatus.BAD_REQUEST);
			}

			const product = await this.productRepository.findByIdAndUpdate(id, updateData);
			if (!product) {
				throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
			}
			return product;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException("Error updating product", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteProduct(id: string) {
		try {
			const product = await this.productRepository.findByIdAndUpdate(id, {
				isActive: false,
				updatedAt: new Date(),
			});
			if (!product) {
				throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
			}
			return product;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException("Error deleting product", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async searchProducts(
		searchTerm: string,
		page = 1,
		limit = this.configService.get<number>("app.defaultPageSize")
	) {
		try {
			if (!searchTerm) {
				throw new HttpException("Search term is required", HttpStatus.BAD_REQUEST);
			}

			const searchRegex = new RegExp(searchTerm, 'i');
			const query = {
				$or: [
					{ name: searchRegex },
					{ description: searchRegex },
					{ category: searchRegex },
				],
				isActive: true,
			};

			const skip = (page - 1) * limit;

			const [products, total] = await Promise.all([
				this.productRepository.search(query, {
					skip,
					limit: Math.min(limit, this.configService.get<number>("app.maxPageSize")),
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
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException("Error retrieving products", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
