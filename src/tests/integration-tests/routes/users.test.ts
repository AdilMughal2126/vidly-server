/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from "supertest";
import {
	generateAuthToken,
	validateHash,
	verifyToken,
} from "../../../helpers/auth";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { JwtPayload } from "../../../types/JwtPayload";
import { UpdatePasswordType, UserType } from "../../../types/UserType";

const request = supertest(app);

describe("Route /api/users", () => {
	let user3: UserType;
	let user4: UserType;

	beforeEach(() => {
		user3 = {
			name: "User3",
			email: "user3@gmail.com",
			hash: "user3hash",
			password: "12345678",
			isAdmin: true,
		};
		user4 = {
			name: "User4",
			email: "user4@gmail.com",
			hash: "user4hash",
			password: "87654321",
		};
	});

	/**
	 * @route /api/users
	 * @method GET
	 * @access Public
	 * @return all users
	 */

	describe("GET /", () => {
		afterEach(async () => await User.deleteMany({}));

		it("should return all the users", async () => {
			await User.insertMany([user3, user4]);
			const res = await request.get("/api/users");
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
		});
	});

	/**
	 * @route /api/users/:id
	 * @method GET/:id
	 * @access Public
	 * @return 404 if ID is invalid
	 * @return 404 if user is not found
	 * @return user if ID is valid
	 */

	describe("GET /:id", () => {
		let id: string;

		beforeEach(async () => {
			const { _id } = await User.create(user3);
			id = _id!.toHexString();
		});
		afterEach(async () => await User.deleteMany({}));

		const exec = () => request.get(`/api/users/${id}`);

		it("should return 404 if ID is invalid", async () => {
			id = "1";
			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toMatch(/invalid id/i);
		});

		it("should return 404 if user is not found", async () => {
			id = "61dd6dd371aa041cf91f7363";
			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toMatch(/not found/i);
		});

		it("should return user if ID is valid", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("name", user3.name);
			expect(res.body).toHaveProperty("email", user3.email);
		});
	});

	/**
	 * @route /api/users
	 * @method POST
	 * @access Public
	 * @return 400 if user name is less than 5
	 * @return 400 if user email is invalid
	 * @return 400 if email already exist
	 * @should save user if valid
	 * @return token if valid
	 */

	describe("POST /", () => {
		let user7: Omit<UserType, "password">;
		let user8: UserType;

		afterEach(async () => await User.deleteMany({}));
		beforeEach(async () => {
			user7 = {
				name: "User7",
				email: "user7@gmail.com",
				hash: "user7hash",
			};
			user8 = {
				name: "User8",
				email: "user8@gmail.com",
				password: "87654321",
			};

			await User.create(user7);
		});

		const exec = () => request.post("/api/users").send(user8);

		it("should return 400 if user name is less than 5", async () => {
			user8.name = "User";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/must be at least 5/i);
		});

		it("should return 400 if user email is invalid", async () => {
			user8.email = "user8gmail.com";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/must be a valid email/i);
		});

		it("should return 400 if email already exist", async () => {
			user8.email = "user7@gmail.com";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/already registered/i);
		});

		it("should save user if valid", async () => {
			await exec();
			const user = await User.findOne({ name: user8.name, email: user8.email });
			expect(user).not.toBeNull();
		});

		it("should return token if valid", async () => {
			const res = await exec();
			const user = await User.findOne({ name: user8.name, email: user8.email });
			const decoded = verifyToken(res.body as string) as JwtPayload;
			const isValid = decoded?._id === user?._id?.toHexString();
			expect(res.status).toBe(200);
			expect(isValid).toBe(true);
		});
	});

	/**
	 * @route /api/users/:id
	 * @method PUT
	 * @access Private
	 * @return 404 if ID is invalid
	 * @return 404 if user is not found
	 * @should update user if valid
	 * @return token if user is valid
	 */

	describe("PUT /:id", () => {
		let user8: Omit<UserType, "password">;
		let user88: Omit<UserType, "password">;
		let token: string;
		let id: string;

		afterEach(async () => await User.deleteMany({}));
		beforeEach(async () => {
			user8 = {
				name: "User8",
				email: "user8@gmail.com",
				hash: "user8hash",
			};
			user88 = {
				name: "User88",
				email: "user88@gmail.com",
			};
			token = generateAuthToken(new User());
			const { _id } = await User.create(user8);
			id = _id!.toHexString();
		});

		const exec = () =>
			request.put(`/api/users/${id}`).set("X-Auth-Token", token).send(user88);

		it("should return 404 if ID is invalid", async () => {
			id = "1";
			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toMatch(/invalid id/i);
		});

		it("should return 404 if user is not found", async () => {
			id = "61dea11b934e3d2eba68782f";
			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toMatch(/not found/i);
		});

		it("should update user if valid", async () => {
			await exec();
			const user = await User.findOne({
				name: user88.name,
				email: user88.email,
			});
			expect(user).not.toBeNull();
		});

		it("should return token if user valid", async () => {
			const res = await exec();
			const user = await User.findOne({
				name: user88.name,
				email: user88.email,
			});
			const decoded = verifyToken(res.body as string) as JwtPayload;
			const isValid = decoded?._id === user?._id?.toHexString();
			expect(res.status).toBe(200);
			expect(isValid).toBe(true);
		});
	});

	/**
	 * @route /api/users/reset/:id
	 * @method PUT
	 * @access Private
	 * @return 404 if ID is invalid
	 * @return 400 if user is not found
	 * @return 400 if user is not logged in
	 * @return 400 if current password is invalid
	 * @should update user password if valid && return 200
	 */

	describe("PUT /reset/:id", () => {
		let user1: Omit<UserType, "password">;
		let updateUser8Password: UpdatePasswordType;
		let token: string;
		let id: string;

		afterEach(async () => await User.deleteMany({}));
		beforeEach(async () => {
			user1 = {
				name: "User1",
				email: "user1@gmail.com",
				hash: "$2a$10$bHBjONSBdNxaBzrcDXVweuihdtbRi8xyJihBOYPM9u6J1oCjv5rBe",
			};
			updateUser8Password = {
				currentPassword: "12345678",
				newPassword: "87654321",
			};
			token = generateAuthToken(new User());
			const { _id } = await User.create(user1);
			id = _id!.toHexString();
		});

		const exec = () =>
			request
				.put(`/api/users/reset/${id}`)
				.set("X-Auth-Token", token)
				.send(updateUser8Password);

		it("should return 404 if ID is invalid", async () => {
			id = "1";
			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toMatch(/invalid id/i);
		});

		it("should return 400 if user is not found", async () => {
			id = "61dea11b934e3d2eba68782f";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/not found/i);
		});

		it("should return 400 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 400 if current password is invalid", async () => {
			updateUser8Password.currentPassword = "abcdefgh";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/invalid password/i);
		});

		it("should update user password if valid", async () => {
			const res = await exec();
			const user = await User.findOne({ name: user1.name, email: user1.email });
			const isValid = await validateHash(
				updateUser8Password.newPassword,
				user?.hash as string
			);
			expect(res.status).toBe(200);
			expect(isValid).toBe(true);
		});
	});

	/**
	 *  @method DELETE
	 * @access Private
	 * @return 404 if ID is invalid
	 * @return 403 if user is not admin
	 * @return 404 if user is not found
	 * @should delete user if valid
	 * @return the deleted user if valid
	 */

	describe("DELETE /:id", () => {
		let token: string;
		let id: string;

		afterEach(async () => await User.deleteMany({}));
		beforeEach(async () => {
			const { _id } = await User.create(user3);
			id = _id!.toHexString();
			token = generateAuthToken(new User(user3));
		});

		const exec = () =>
			request.delete(`/api/users/${id}`).set("X-Auth-Token", token);

		it("should return 404 if ID is invalid", async () => {
			id = "1";
			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toMatch(/invalid id/i);
		});

		it("should return 403 if user is not admin", async () => {
			token = generateAuthToken(new User());
			const res = await exec();
			expect(res.status).toBe(403);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 404 if user is not found", async () => {
			id = "61dea11b934e3d2eba68782f";
			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toMatch(/not found/i);
		});

		it("should delete user if valid", async () => {
			const res = await exec();
			const user = await User.findById(res.body._id);
			expect(user).toBeNull();
		});

		it("should return the deleted user if valid", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				name: user3.name,
				email: user3.email,
				hash: user3.hash,
			});
		});
	});
});
