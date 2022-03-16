/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Favorite } from "../../../models/favorite";
import { Movie } from "../../../models/movie";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { FavoriteType } from "../../../types/FavoriteType";
import { MovieType } from "../../../types/MovieType";
import { UserType } from "../../../types/UserType";

const request = supertest(app);

describe("Route /api/favorites", () => {
	let token: string;
	let movie1: MovieType;
	let movie2: MovieType;
	let fav1: FavoriteType;
	let fav2: FavoriteType;
	let user: Omit<UserType, "password">;

	afterEach(async () => {
		await Promise.all([
			await User.deleteMany({}),
			await Movie.deleteMany({}),
			await Favorite.deleteMany({}),
		]);
	});

	beforeEach(async () => {
		user = {
			_id: new mongoose.Types.ObjectId(),
			name: "User10",
			email: "user10@gmail.com",
			hash: "user_hash",
		};
		token = generateAuthToken(new User(user));
		movie1 = {
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
			likes: [{ _id: user._id!.toHexString() }],
			bookmarks: [],
			rentals: [],
		};
		movie2 = {
			_id: new mongoose.Types.ObjectId(),
			title: "Fast & Furious",
			genre: { name: "Action" },
			numberInStock: 3,
			dailyRentalRate: 3.5,
			voteAverage: 1,
			category: "popular",
			overview: "",
			dateRelease: "",
			url: "movie_url",
			likes: [{ _id: user._id!.toHexString() }],
			bookmarks: [],
			rentals: [],
		};
		fav1 = {
			user: { _id: user._id!.toHexString(), name: user.name! },
			movie: {
				_id: movie1._id!.toHexString(),
				title: movie1.title,
				url: movie1.url,
				voteAverage: movie1.voteAverage,
				likes: movie1.likes,
			},
			date: new Date(),
		};
		fav2 = {
			user: { _id: user._id!.toHexString(), name: user.name! },
			movie: {
				_id: movie2._id!.toHexString(),
				title: movie2.title,
				url: movie2.url,
				voteAverage: movie2.voteAverage,
				likes: movie2.likes,
			},
			date: new Date(),
		};

		await Promise.all([
			await User.create(user),
			await Movie.create(movie1, movie2),
			await Favorite.create(fav1, fav2),
		]);
	});

	/**
	 * @method GET
	 * @access Private
	 * @return 401 if user is not logged in
	 * @return all the favorites
	 */

	describe("GET /", () => {
		const exec = () => request.get("/api/favorites").set("X-Auth-Token", token);

		it("should return 401 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 200 if valid", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveLength(2);
		});
	});

	/**
	 * @method POST
	 * @access Private
	 * @return 401 if user is not logged in
	 * @return 400 if user is not found
	 * @return 400 if no movie was found
	 * @return 200 if movie successfully added to favorites
	 */

	describe("POST /", () => {
		let userId: string;
		let movieId: string;

		beforeEach(() => {
			userId = user._id!.toHexString();
			movieId = movie1._id!.toHexString();
		});

		const exec = () =>
			request
				.post("/api/favorites")
				.set("X-Auth-Token", token)
				.send({ userId, movieId });

		it("should return 401 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 400 if user is not found", async () => {
			userId = "61dea11b934e3d2eba68782f";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/user not found/i);
		});

		it("should return 400 if no movie was found", async () => {
			movieId = "61dea11b934e3d2eba68782f";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/movie not found/i);
		});

		it("should return 200 if movie successfully added to favorites", async () => {
			const res = await exec();
			const fav = await Favorite.findOne({
				"user._id": userId,
				"movie._id": movieId,
			});
			expect(fav).not.toBeNull();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/added to favorites/i);
		});
	});

	/**
	 * @method DELETE
	 * @route /api/favorites/:movieId
	 * @access Private
	 * @return 401 if user is not logged in
	 * @should unset userId in movie's likes
	 * @return 400 if favorite's movie not found
	 * @return 200 if movie successfully deleted from favorites
	 */

	describe("DELETE /:movieId", () => {
		let movieId: string;

		beforeEach(() => {
			movieId = movie2._id!.toHexString();
		});

		const exec = () =>
			request
				.delete(`/api/favorites/${movieId}`)
				.set("X-Auth-Token", token)
				.send({ movieId });

		it("should return 401 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should unset userId in movie's favorites", async () => {
			await exec();
			const movie = await Movie.findById(movieId);
			const isDeleted = movie?.likes.includes({
				_id: user._id!.toHexString(),
			});
			expect(isDeleted).toBe(false);
		});

		it("should return 200 if movie successfully deleted from favorites", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/removed from favorites/i);
		});
	});

	/**
	 * @method DELETE
	 * @route /api/favorites/userId/clear
	 * @access Private
	 * @return 401 if user is not logged in
	 * @return 400 if user not found
	 * @should unset userId in movie's favorites
	 * @return 200 if movie successfully deleted from favorites
	 */

	describe("DELETE /userId/clear", () => {
		let userId: string;

		beforeEach(() => (userId = user._id!.toHexString()));

		const exec = () =>
			request
				.delete(`/api/favorites/${userId}/clear`)
				.set("X-Auth-Token", token);

		it("should return 401 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return 400 if user not found", async () => {
			userId = "61dea11b934e3d2eba68782f";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/user not found/i);
		});

		// it("should return 400 if favorite not found", async () => {
		// 	const res = await exec();
		// 	expect(res.status).toBe(400);
		// 	expect(res.body).toMatch(/no movies was found/i);
		// });

		it("should unset userId in movie's favorites", async () => {
			await exec();
			const movies = await Movie.find({ likes: { _id: userId } });
			expect(movies.length).toBe(0);
		});

		it("should return 200 if favorites is clear", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/removed from favorites/i);
		});
	});
});
