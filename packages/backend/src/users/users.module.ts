import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "./users.service";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	providers: [UsersService, UserRepository],
	exports: [UsersService],
})
export class UsersModule {}
