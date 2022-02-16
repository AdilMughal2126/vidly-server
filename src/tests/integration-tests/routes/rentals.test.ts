/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from "supertest";
// import { RentalType } from "../../../types/RentalType";
// import { CustomerType } from "../../../types/CustomerType";
import { generateAuthToken } from "../../../helpers/auth";
import { Movie } from "../../../models/movie";
import { Rental } from "../../../models/rental";
import { User } from "../../../models/user";
// import mongoose from "mongoose";
import { app } from "../../../server";
// import { Customer } from "../../../models/customer";
import { MovieType } from "../../../types/MovieType";
import { UserType } from "../../../types/UserType";

const request = supertest(app);

/**
 * @route /api/rentals
 *
 * @method GET
 * @access Public
 * Return all the rentals
 *
 * @method GET/:id
 * @access Public
 * Return 404 if ID is invalid
 * Return 404 if rental is not found
 * Return 200 if rental is valid
 *
 * @method POST
 * @access Private
 * Return 401 if no jwt was provided
 * Return 400 if rental is invalid
 * Return 400 if customer is invalid
 * Return 400 if movie is invalid
 * Return 404 if numberInStock is null
 * Return 200 if rental is valid
 */

describe("ROUTE /api/rentals", () => {
	let user1: Omit<UserType, "password">;
	let user2: Omit<UserType, "password">;
	let movie1: MovieType;
	let movie2: MovieType;

	afterEach(async () => await Rental.deleteMany({}));
	beforeEach(() => {
		user1 = { name: "User1", email: "user1@gmail.com" };
		user2 = { name: "User2", email: "user2@gmail.com" };
		movie1 = {
			title: "Avengers",
			genres: [{ name: "Action" }],
			numberInStock: 2,
			dailyRentalRate: 2.5,
			voteAverage: 1,
			overview: "",
			category: "popular",
			dateRelease: "",
			url: "",
		};
		movie2 = {
			title: "GAME OF THRONE",
			genres: [{ name: "Adventure" }],
			numberInStock: 3,
			dailyRentalRate: 3.5,
			voteAverage: 1,
			overview: "",
			category: "popular",
			dateRelease: "",
			url: "",
		};
	});

	describe("GET /", () => {
		it("should return all the rentals", async () => {
			const rentals = [
				{ user: user1, movie: movie1, rentalFee: 0 },
				{ user: user2, movie: movie2, rentalFee: 0 },
			];
			await Rental.create(rentals);
			const res = await request.get("/api/rentals");
			console.log("GET /api/rentals :", res.body);
			expect(res.status).toBe(200);
			expect(res.body[0].user).toMatchObject(user1);
			expect(res.body[1].user).toMatchObject(user2);
		});
	});

	// describe("GET /:id", () => {
	// 	let id: string;
	// 	let rental: mongoose.Document<unknown, unknown, RentalType> & {
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

	describe("POST /", () => {
		let user: UserType;
		let movieId: string;
		let token: string;
		let dateOut: Date;
		let dateReturned: Date;

		afterEach(async () => {
			await User.deleteMany({});
			await Movie.deleteMany({});
		});

		beforeEach(async () => {
			user = await User.create({
				name: user1.name,
				email: user1.email,
				hash: "user1ssdldqslfqfffezf",
			});
			const movie = await Movie.create(movie1);
			movieId = movie._id.toHexString();
			// userId = (newUser._id!).toHexString();
			token = generateAuthToken(user);
			dateOut = new Date("01/02/2022");
			dateReturned = new Date();
		});

		const exec = () =>
			request
				.post("/api/rentals")
				.set("X-Auth-Token", token)
				.send({ movieId, dateOut, dateReturned });

		it("should return 401 if no jwt was provided", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		// it("should return 400 if rental is invalid", async () => {
		// 	customerId = "1";
		// 	// movieId = "1";
		// 	const res = await exec();
		// 	expect(res.status).toBe(400);
		// 	expect(res.body).toMatch(/fails to match the ObjectId pattern/i);
		// });

		// it("should return 400 if customer is invalid", async () => {
		// 	customerId = "61df00dd7facff58c1a80e94";
		// 	const res = await exec();
		// 	expect(res.status).toBe(400);
		// 	expect(res.body).toMatch(/invalid customer/i);
		// });

		it("should return 400 if movie is invalid", async () => {
			movieId = "61df00dd7facff58c1a80e94";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/invalid movie/i);
		});

		// it("should return 404 if numberInStock is null", async () => {
		//   const res = await exec();
		//   expect(res.status).toBe(404);
		//   expect(res.body).toMatch(/no movie found/i);
		// });

		it("should return 200 if rental is valid", async () => {
			const res = await exec();
			console.log("POST /api/rentals", res.body);
			expect(res.status).toBe(200);
			// expect(res.body.customer).toMatchObject(customer1);
			// expect(res.body.movie).toHaveProperty("title", "Avengers");
		});
	});
});
