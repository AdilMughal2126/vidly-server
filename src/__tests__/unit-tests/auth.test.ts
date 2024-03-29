import mongoose from "mongoose";
import {
	generateAuthToken,
	generateHash,
	validateHash,
	verifyToken,
} from "../../helpers/auth";
import { User } from "../../models/user";

describe("Auth Helper", () => {
	describe("JWT verification", () => {
		it("should return a valid token", () => {
			const payload = {
				_id: new mongoose.Types.ObjectId(),
				name: "User1",
				email: "user1@gmail.com",
			};
			const user = new User(payload);
			const token = generateAuthToken(user);
			const decoded = verifyToken(token);
			expect(decoded).toMatchObject(payload);
		});
	});

	describe("Bcrypt Hash", () => {
		it("should return a valid hash", async () => {
			const password = "12345678";
			const hash = await generateHash(password);
			const validate = await validateHash(password, hash);
			expect(validate).toBe(true);
		});
	});
});
