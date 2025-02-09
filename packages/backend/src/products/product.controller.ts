import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
	UseGuards,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

interface GetProductsQuery {
	page?: string;
	limit?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	category?: string;
	minPrice?: string;
	maxPrice?: string;
	minQuantity?: string;
	maxQuantity?: string;
}

@ApiTags("products")
@Controller("products")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	@ApiOperation({ summary: "Get all products" })
	@ApiResponse({ status: 200, description: "Returns all products" })
	async getAllProducts(@Query() query: GetProductsQuery) {
		try {
			const options = {
				page: parseInt(query.page as string) || 1,
				limit: parseInt(query.limit as string) || 10,
				sortBy: query.sortBy,
				sortOrder: query.sortOrder,
				category: query.category,
				minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
				maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
				minQuantity: query.minQuantity ? parseInt(query.minQuantity) : undefined,
				maxQuantity: query.maxQuantity ? parseInt(query.maxQuantity) : undefined,
			};

			return this.productService.getAllProducts(options);
		} catch (error) {
			throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Create a new product" })
	@ApiResponse({ status: 201, description: "Product created successfully" })
	async createProduct(@Body() productData: any) {
		try {
			return this.productService.createProduct(productData);
		} catch (error) {
			throw new HttpException("Invalid product data", HttpStatus.BAD_REQUEST);
		}
	}

	@Put(":id")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Update a product" })
	@ApiResponse({ status: 200, description: "Product updated successfully" })
	async updateProduct(@Param("id") id: string, @Body() productData: any) {
		try {
			return this.productService.updateProduct(id, productData);
		} catch (error) {
			if (error?.message === "Product not found") {
				throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
			}
			throw new HttpException("Invalid product data", HttpStatus.BAD_REQUEST);
		}
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Delete a product" })
	@ApiResponse({ status: 204, description: "Product deleted successfully" })
	async deleteProduct(@Param("id") id: string) {
		try {
			await this.productService.deleteProduct(id);
		} catch (error) {
			if (error?.message === "Product not found") {
				throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
			}
			throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get("search")
	@ApiOperation({ summary: "Search products" })
	@ApiResponse({ status: 200, description: "Returns matching products" })
	async searchProducts(
		@Query("q") searchTerm: string,
		@Query("page") page?: string,
		@Query("limit") limit?: string
	) {
		try {
			if (!searchTerm) {
				throw new HttpException("Search term is required", HttpStatus.BAD_REQUEST);
			}

			return this.productService.searchProducts(
				searchTerm,
				page ? parseInt(page) : undefined,
				limit ? parseInt(limit) : undefined
			);
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
