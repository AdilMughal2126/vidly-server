import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Genre } from "../../../models/genre";
import { User } from "../../../models/user";
import { app } from "../../../server";

const request = supertest(app);

describe("Auth Middleware", () => {
	let token: string;
	let name: string;
	let id: string;

	afterEach(async () => await Genre.deleteMany({}));
	beforeEach(async () => {
		token = generateAuthToken(new User({ isAdmin: true }));
		name = "Test New Genre";
		const { _id } = await Genre.create({ name });
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		id = _id!.toHexString();
	});

	describe("Require Auth", () => {
		const exec = () =>
			request.post("/api/genres").set("X-Auth-Token", token).send({ name });

		it("should return 401 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 403 if user is not admin", async () => {
			token = generateAuthToken(new User());
			const res = await exec();
			expect(res.status).toBe(403);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 400 if token is invalid", async () => {
			token = "falsy";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/invalid token/i);
		});

		it("should return 200 if token is valid", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({ name });
		});
	});

	describe("Require Admin", () => {
		const exec = () =>
			request.delete(`/api/genres/${id}`).set("X-Auth-Token", token);

		it("should return 403 if user is not admin", async () => {
			token = generateAuthToken(new User());
			const res = await exec();
			expect(res.status).toBe(403);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return null if genre is deleted", async () => {
			const res = await exec();
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const genre = await Genre.findById(res.body._id);
			expect(genre).toBeNull();
		});
	});
});
