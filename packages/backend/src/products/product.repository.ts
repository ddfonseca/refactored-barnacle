import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProduct, Product } from "./product.model";

@Injectable()
export class ProductRepository {
	constructor(@InjectModel(Product.name) private productModel: Model<IProduct>) {}

	async findAll(
		query: any,
		options: {
			skip: number;
			limit: number;
			sort?: { [key: string]: "asc" | "desc" };
		}
	): Promise<IProduct[]> {
		const baseQuery = this.productModel.find(query);
		if (options.sort) {
			baseQuery.sort(options.sort);
		}
		return baseQuery.skip(options.skip).limit(options.limit);
	}

	async count(query: any): Promise<number> {
		return this.productModel.countDocuments(query);
	}

	async create(productData: Partial<IProduct>): Promise<IProduct> {
		const product = new this.productModel(productData);
		return product.save();
	}

	async findByIdAndUpdate(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
		return this.productModel.findByIdAndUpdate(
			id,
			{ ...updateData, updatedAt: new Date() },
			{ new: true, runValidators: true }
		);
	}

	async findById(id: string): Promise<IProduct | null> {
		return this.productModel.findById(id);
	}

	async search(
		query: any,
		options: {
			skip: number;
			limit: number;
		}
	): Promise<IProduct[]> {
		return this.productModel.find(query).skip(options.skip).limit(options.limit);
	}
}
