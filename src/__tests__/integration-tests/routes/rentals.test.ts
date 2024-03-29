/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { MovieInt } from "../../../interfaces/MovieInt";
import { RentalInt } from "../../../interfaces/RentalInt";
import { UserInt } from "../../../interfaces/UserInt";
import { Movie } from "../../../models/movie";
import { Payment } from "../../../models/payment";
import { Rental } from "../../../models/rental";
import { User } from "../../../models/user";
import { app } from "../../../server";

const request = supertest(app);

describe("ROUTE /api/rentals", () => {
	let user5: Omit<UserInt, "password">;
	let movie1: MovieInt;
	let movie2: MovieInt;

	afterEach(async () => await Rental.deleteMany({}));
	beforeEach(() => {
		user5 = {
			_id: new mongoose.Types.ObjectId(),
			name: "User5",
			email: "user5@gmail.com",
		};
		movie1 = {
			_id: new mongoose.Types.ObjectId(),
			title: "Avengers",
			genre: { name: "Action" },
			numberInStock: 2,
			dailyRentalRate: 2.5,
			voteAverage: 1,
			overview: "",
			category: "popular",
			dateRelease: "",
			url: "movie1_url",
		};
		movie2 = {
			_id: new mongoose.Types.ObjectId(),
			title: "GAME OF THRONE",
			genre: { name: "Adventure" },
			numberInStock: 3,
			dailyRentalRate: 3.5,
			voteAverage: 1,
			overview: "",
			category: "popular",
			dateRelease: "",
			url: "movie2_url",
		};
	});

	/**
	 *  @route /api/rentals
	 * @method GET
	 * @access Private
	 * @return 401 if no jwt was provided
	 * @return all the rentals if their returned date > today
	 * @return all the rentals
	 */

	describe("GET /", () => {
		let token: string;
		let rental1: RentalInt;
		let rental3: RentalInt;

		afterEach(async () => await Rental.deleteMany({}));
		beforeEach(async () => {
			rental3 = {
				user: {
					_id: user5._id!.toHexString(),
					name: user5.name!,
				},
				rentals: [
					{
						movieId: movie1._id!.toHexString(),
						rentalFee: 0,
						rentDate: new Date(new Date().setDate(new Date().getDate() - 1)),
						returnedDate: new Date(),
						status: "succeeded",
					},
				],
			};
			rental1 = {
				user: {
					_id: user5._id!.toHexString(),
					name: user5.name!,
				},
				rentals: [
					{
						movieId: movie1._id!.toHexString(),
						rentalFee: 0,
						rentDate: new Date(),
						returnedDate: new Date(
							new Date().setDate(new Date().getDate() + 1)
						),
						status: "succeeded",
					},
					{
						movieId: movie2._id!.toHexString(),
						rentalFee: 0,
						rentDate: new Date(),
						returnedDate: new Date(
							new Date().setDate(new Date().getDate() + 2)
						),
						status: "succeeded",
					},
				],
			};
			await Rental.create(rental1);
			token = generateAuthToken(new User(user5));
		});

		const exec = () => request.get("/api/rentals").set("X-Auth-Token", token);

		it("should return 401 if no jwt was provided", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return all the rentals if their returned date > today", async () => {
			await Rental.insertMany([rental3]);
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.rentals).toHaveLength(2);
		});

		it("should return all the rentals", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.rentals).toHaveLength(2);
		});
	});

	/**
	 *  @method GET/:id
	 * @access Private
	 * @return 404 if ID is invalid
	 * @return 404 if rental is not found
	 * @return 200 if rental is valid
	 */

	// describe("GET /:id", () => {
	// 	let id: string;
	// 	let rental: mongoose.Document<unknown, unknown, RentalInt> & {
	// 		_id: mongoose.Types.ObjectId;
	// 	};

	// 	beforeEach(async () => {
	// 		rental = await Rental.create({
	// 			customer: customer1,
	// 			movie: movie1,
	// 			rentalFee: 0,
	// 		});
	// 		id = rental._id.toHexString();
	// 	});

	// 	const exec = () => request.get(`/api/rentals/${id}`);

	// 	it("should return 404 if ID is invalid", async () => {
	// 		id = "1";
	// 		const res = await exec();
	// 		expect(res.status).toBe(404);
	// 		expect(res.body).toMatch(/invalid id/i);
	// 	});

	// 	it("should return 404 if rental is not found", async () => {
	// 		id = "61df00dd7facff58c1a80e94";
	// 		const res = await exec();
	// 		expect(res.status).toBe(404);
	// 		expect(res.body).toMatch(/not found/i);
	// 	});

	// 	it("should return 200 if rental is valid", async () => {
	// 		const res = await exec();
	// 		expect(res.status).toBe(200);
	// 		expect(res.body.customer).toHaveProperty("name", "Takanome");
	// 		expect(res.body.movie).toHaveProperty("title", "Avengers");
	// 	});
	// });

	/**
	 * @method POST
	 * @access Private
	 * @return 401 if no jwt was provided
	 * @return 400 if movie is invalid
	 * @return 404 if numberInStock is null
	 * @return 400 if user is not found
	 * @return 400 if no payment was found
	 * @return 200 if rental is valid
	 */

	describe("POST /", () => {
		let user: UserInt;
		let movieId: string;
		let userId: string;
		let token: string;
		let paymentIntentId: string;
		let returnedDate: number;

		afterEach(async () => {
			await User.deleteMany({});
			await Movie.deleteMany({});
			await Payment.deleteMany({});
			await Rental.deleteMany({});
		});

		beforeEach(async () => {
			user = await User.create({
				name: user5.name,
				email: user5.email,
				hash: "user5hash",
			});
			const { _id } = await Movie.create(movie1);
			movieId = _id!.toHexString();
			userId = user._id!.toHexString();
			paymentIntentId = "payment_id";
			token = generateAuthToken(user);
			returnedDate = new Date().setDate(new Date().getDate() + 1);
			await Payment.create({
				paymentId: "payment_id",
				userId,
				movieId,
				amount: 2,
				client_secret: "client_secret",
				createAt: +new Date(),
				status: "succeeded",
			});
		});

		const exec = () =>
			request
				.post("/api/rentals")
				.set("X-Auth-Token", token)
				.send({ movieId, userId, returnedDate, paymentIntentId });

		it("should return 401 if no jwt was provided", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 400 if movie is invalid", async () => {
			movieId = "61df00dd7facff58c1a80e94";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/no movie was found/i);
		});

		// it("should return 404 if numberInStock is null", async () => {
		// 	movie1.numberInStock = 0;
		// 	const res = await exec();
		// 	expect(res.status).toBe(404);
		// 	expect(res.body).toMatch(/stock for this movie is empty/i);
		// });

		it("should return 400 if user is not found", async () => {
			userId = "61df00dd7facff58c1a80e94";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/user not found/i);
		});

		it("should return 400 if no payment was found", async () => {
			paymentIntentId = "payment_intent_id";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/no payment was found/i);
		});

		it("should return 200 if rental is valid", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/successfully rented/);
		});
	});
});
