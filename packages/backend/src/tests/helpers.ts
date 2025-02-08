import { Express } from "express";
import request from "supertest";
import { UserModel } from "../users/user.model";

export async function createTestUser() {
	return UserModel.create({
		username: "testuser",
		password: "test123",
	});
}

export async function getAuthToken(app: Express) {
	const response = await request(app).post("/api/auth/login").send({
		username: "testuser",
		password: "test123",
	});
	console.log(response.body);

	return response.body.accessToken;
}
