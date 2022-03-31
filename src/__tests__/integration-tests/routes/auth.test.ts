import supertest from "supertest";
import { verifyToken } from "../../../helpers/auth";
import { UserInt } from "../../../interfaces/UserInt";
import { User } from "../../../models/user";
import { app } from "../../../server";

const request = supertest(app);

describe("ROUTE /api/auth", () => {
	let user: UserInt;

	afterEach(async () => await User.deleteMany({}));
	beforeEach(async () => {
		await User.create({
			name: "User1",
			email: "user1@gmail.com",
			hash: "$2a$10$bHBjONSBdNxaBzrcDXVweuihdtbRi8xyJihBOYPM9u6J1oCjv5rBe",
		});

		user = {
			email: "user1@gmail.com",
			password: "12345678",
		};
	});

	const exec = () => request.post("/api/auth").send(user);

	it("should return 400 if email is invalid", async () => {
		user.email = "user1@gmail.co";
		user.password = "12345679";
		const res = await exec();
		expect(res.status).toBe(400);
		expect(res.body).toMatch(/invalid email or password/i);
	});

	it("should return 400 if user not found", async () => {
		user.email = "user@gmail.com";
		const res = await exec();
		expect(res.status).toBe(400);
		expect(res.body).toMatch(/invalid email or password/i);
	});

	it("should return 400 if password is invalid", async () => {
		user.password = "12345679";
		const res = await exec();
		expect(res.status).toBe(400);
		expect(res.body).toMatch(/invalid email or password/i);
	});

	it("should return jwt if user is info is correct", async () => {
		const res = await exec();
		const isValid = verifyToken(res.body as string);
		expect(res.status).toBe(200);
		expect(isValid).toBeTruthy();
	});
});
