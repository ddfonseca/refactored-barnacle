import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import appConfig, { envSchema } from "./config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig],
			validate: (config) => envSchema.parse(config),
		}),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>("app.mongodbUri"),
			}),
		}),
		AuthModule,
		UsersModule,
		ProductsModule,
	],
})
export class AppModule {}
