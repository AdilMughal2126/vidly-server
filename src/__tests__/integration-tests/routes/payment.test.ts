/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Movie } from "../../../models/movie";
import { Payment } from "../../../models/payment";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { MovieType } from "../../../types/MovieType";
import { UserType } from "../../../types/UserType";

const request = supertest(app);

describe("Route /api/payment", () => {
	let token: string;
	let user: Omit<UserType, "password">;
	let movie: MovieType;
	let userId: string;
	let movieId: string;
	let returnedDate: number;

	afterEach(
		async () =>
			await Promise.all([await User.deleteMany({}), await Movie.deleteMany({})])
	);

	beforeEach(async () => {
		user = {
			_id: new mongoose.Types.ObjectId(),
			name: "User9",
			email: "user9@gmail.com",
			hash: "user_hash",
		};
		token = generateAuthToken(new User(user));
		movie = {
			_id: new mongoose.Types.ObjectId(),
			title: "Avengers",
			genre: { name: "Action" },
			numberInStock: 2,
			dailyRentalRate: 2.5,
			voteAverage: 1,
			category: "popular",
			overview: "",
			dateRelease: "",
			url: "movie_url",
			likes: [],
			bookmarks: [],
			rentals: [],
		};

		userId = user._id!.toHexString();
		movieId = movie._id!.toHexString();
		returnedDate = new Date().setDate(new Date().getDate() + 1);

		await Promise.all([await User.create(user), await Movie.create(movie)]);
	});

	const exec = () =>
		request
			.post("/api/payment")
			.set("X-Auth-Token", token)
			.send({ userId, movieId, returnedDate });

	/**
	 * @method POST
	 * @access Private
	 * @return 401 if user is not logged in
	 * @return 400 if user is not found
	 * @return 400 if movie is not found
	 * @return 400 if movie already rented
	 * @should save payment intent is created
	 * @return 200 if payment created
	 */

	it("should return 401 if user is not logged in", async () => {
		token = "";
		const res = await exec();
		expect(res.status).toBe(401);
		expect(res.body).toMatch(/access denied/i);
	});

	it("should return 400 if user is not found", async () => {
		userId = "61df00dd7facff58c1a80e94";
		const res = await exec();
		expect(res.status).toBe(400);
		expect(res.body).toMatch(/user not found/i);
	});

	it("should return 400 if movie is not found", async () => {
		movieId = "61df00dd7facff58c1a80e94";
		const res = await exec();
		expect(res.status).toBe(400);
		expect(res.body).toMatch(/movie not found/i);
	});

	it("should return 400 if movie already rented", async () => {
		await Payment.create({
			paymentId: "payment_id",
			userId,
			movieId,
			amount: 100,
			status: "pending",
			client_secret: "client_secret",
			createAt: +new Date(),
		});
		const res = await exec();
		expect(res.status).toBe(400);
		expect(res.body).toMatch(/movie already rented/i);
	});

	it("should save payment intent is created", async () => {
		const res = await exec();
		const payment = await Payment.findOne({ userId });
		expect(res.status).toBe(200);
		expect(payment).not.toBeNull();
	});

	it("should return 200 if payment intent is created", async () => {
		const res = await exec();
		expect(res.status).toBe(200);
		expect(res.body).toBeTruthy();
	});
});
