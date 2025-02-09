import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProductRepository } from "./product.repository";
import { Product } from "./product.model";
import { ProductSchema } from "./schemas/product.schema";

@Module({
	imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
	controllers: [ProductController],
	providers: [ProductService, ProductRepository],
	exports: [ProductService],
})
export class ProductsModule {}
