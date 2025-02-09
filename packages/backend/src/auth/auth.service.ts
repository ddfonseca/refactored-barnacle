import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { User } from "../users/schemas/user.schema";

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	private generateTokens(user: User) {
		const payload = { userId: user._id, username: user.username };

		const accessToken = this.jwtService.sign(payload);
		const refreshToken = this.jwtService.sign(
			{ userId: user._id },
			{ secret: this.configService.get<string>("REFRESH_SECRET"), expiresIn: "7d" }
		);

		return { accessToken, refreshToken };
	}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.usersService.findByUsername(username);
		if (user && (await user.comparePassword(password))) {
			const { password, ...result } = user.toObject();
			return result;
		}
		return null;
	}

	async register(username: string, password: string) {
		const existingUser = await this.usersService.findByUsername(username);
		if (existingUser) {
			throw new ConflictException("Username already exists");
		}

		const user = await this.usersService.create(username, password);
		const tokens = this.generateTokens(user);

		await this.usersService.updateRefreshToken(user._id, tokens.refreshToken);

		return tokens;
	}

	async login(username: string, password: string) {
		const user = await this.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const tokens = this.generateTokens(user);
		await this.usersService.updateRefreshToken(user._id, tokens.refreshToken);

		return tokens;
	}

	async refreshToken(refreshToken: string) {
		try {
			const decoded = this.jwtService.verify(refreshToken, {
				secret: this.configService.get<string>("REFRESH_SECRET"),
			});

			const user = await this.usersService.findById(decoded.userId);
			if (!user || user.refreshToken !== refreshToken) {
				throw new UnauthorizedException("Invalid refresh token");
			}

			const tokens = this.generateTokens(user);
			await this.usersService.updateRefreshToken(user._id, tokens.refreshToken);

			return tokens;
		} catch {
			throw new UnauthorizedException("Invalid refresh token");
		}
	}

	async logout(userId: string): Promise<void> {
		await this.usersService.updateRefreshToken(userId, null);
	}
}
