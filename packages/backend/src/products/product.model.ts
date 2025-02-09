import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Product {
	@Prop({ required: true, trim: true, index: true })
	name: string;

	@Prop({ required: true, trim: true })
	description: string;

	@Prop({ required: true, min: 0 })
	price: number;

	@Prop({ required: true, trim: true, index: true })
	category: string;

	@Prop({ required: true, min: 0 })
	quantity: number;

	@Prop({ default: true, index: true })
	isActive: boolean;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type ProductDocument = Document & Product;

// Create text index for search functionality
ProductSchema.index({ name: "text", category: "text", description: "text" });
