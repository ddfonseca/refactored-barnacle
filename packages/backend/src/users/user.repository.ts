import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserRepository {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findByUsername(username: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ username }).exec();
	}

	async findById(id: string): Promise<UserDocument | null> {
		return this.userModel.findById(id).exec();
	}

	async create(username: string, password: string): Promise<UserDocument> {
		const user = new this.userModel({ username, password });
		return user.save();
	}

	async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
		await this.userModel.updateOne({ _id: userId }, { refreshToken }).exec();
	}
}
