import { Injectable } from "@nestjs/common";
import { UserDocument } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
	constructor(private userRepository: UserRepository) {}

	async findByUsername(username: string): Promise<UserDocument | null> {
		return this.userRepository.findByUsername(username);
	}

	async findById(id: string): Promise<UserDocument | null> {
		return this.userRepository.findById(id);
	}

	async create(username: string, password: string): Promise<UserDocument> {
		return this.userRepository.create(username, password);
	}

	async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
		await this.userRepository.updateRefreshToken(userId, refreshToken);
	}
}
