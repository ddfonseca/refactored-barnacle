import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./product.model";

@Injectable()
export class ProductRepository {
	constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

	async findAll(
		query: any,
		options: {
			skip: number;
			limit: number;
			sort?: { [key: string]: "asc" | "desc" };
		}
	): Promise<ProductDocument[]> {
		const baseQuery = this.productModel.find(query);
		if (options.sort) {
			baseQuery.sort(options.sort);
		}
		return baseQuery.skip(options.skip).limit(options.limit);
	}

	async count(query: any): Promise<number> {
		return this.productModel.countDocuments(query);
	}

	async create(productData: Partial<ProductDocument>): Promise<ProductDocument> {
		const product = new this.productModel(productData);
		return product.save();
	}

	async findByIdAndUpdate(id: string, updateData: Partial<ProductDocument>): Promise<ProductDocument | null> {
		return this.productModel.findByIdAndUpdate(
			id,
			{ ...updateData, updatedAt: new Date() },
			{ new: true, runValidators: true }
		);
	}

	async findById(id: string): Promise<ProductDocument | null> {
		return this.productModel.findById(id);
	}

	async search(
		query: any,
		options: {
			skip: number;
			limit: number;
		}
	): Promise<ProductDocument[]> {
		return this.productModel.find(query).skip(options.skip).limit(options.limit);
	}
}
