import { Product, IProduct } from "./product.model";
import { ProductRepository } from "./product.repository";

export class MongoDBProductRepository implements ProductRepository {
    async findAll(query: any, options: {
        skip: number;
        limit: number;
        sort: { [key: string]: "asc" | "desc" };
    }): Promise<IProduct[]> {
        return Product.find(query)
            .sort(options.sort)
            .skip(options.skip)
            .limit(options.limit);
    }

    async count(query: any): Promise<number> {
        return Product.countDocuments(query);
    }

    async create(productData: Partial<IProduct>): Promise<IProduct> {
        const product = new Product(productData);
        return product.save();
    }

    async findByIdAndUpdate(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
        return Product.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async findById(id: string): Promise<IProduct | null> {
        return Product.findById(id);
    }

    async search(query: any, options: {
        skip: number;
        limit: number;
    }): Promise<IProduct[]> {
        return Product.find(query)
            .skip(options.skip)
            .limit(options.limit);
    }
}
