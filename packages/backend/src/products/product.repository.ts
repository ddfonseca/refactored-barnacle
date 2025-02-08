import { IProduct } from "./product.model";

export interface ProductRepository {
    findAll(query: any, options: {
        skip: number;
        limit: number;
        sort: { [key: string]: "asc" | "desc" };
    }): Promise<IProduct[]>;
    count(query: any): Promise<number>;
    create(productData: Partial<IProduct>): Promise<IProduct>;
    findByIdAndUpdate(id: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
    findById(id: string): Promise<IProduct | null>;
    search(query: any, options: {
        skip: number;
        limit: number;
    }): Promise<IProduct[]>;
}
