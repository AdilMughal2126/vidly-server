/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Bookmark } from "../../../models/bookmark";
import { Movie } from "../../../models/movie";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { BookmarkType } from "../../../types/BookmarkType";
import { MovieType } from "../../../types/MovieType";
import { UserType } from "../../../types/UserType";

const request = supertest(app);

describe("Route /api/bookmarks", () => {
	let token: string;
	let movie1: MovieType;
	let movie2: MovieType;
	let bookmark1: BookmarkType;
	let bookmark2: BookmarkType;
	let user: Omit<UserType, "password">;

	afterEach(async () => {
		await Promise.all([
			await User.deleteMany({}),
			await Movie.deleteMany({}),
			await Bookmark.deleteMany({}),
		]);
	});

	beforeEach(async () => {
		user = {
			_id: new mongoose.Types.ObjectId(),
			name: "User9",
			email: "user9@gmail.com",
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
			likes: [],
			bookmarks: [{ _id: user._id!.toHexString() }],
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
			likes: [],
			bookmarks: [{ _id: user._id!.toHexString() }],
			rentals: [],
		};
		bookmark1 = {
			user: { _id: user._id!.toHexString(), name: user.name! },
			movie: {
				_id: movie1._id!.toHexString(),
				title: movie1.title,
				url: movie1.url,
				voteAverage: movie1.voteAverage,
				bookmarks: movie1.bookmarks,
			},
			date: new Date(),
		};
		bookmark2 = {
			user: { _id: user._id!.toHexString(), name: user.name! },
			movie: {
				_id: movie2._id!.toHexString(),
				title: movie2.title,
				url: movie2.url,
				voteAverage: movie2.voteAverage,
				bookmarks: movie2.bookmarks,
			},
			date: new Date(),
		};

		await Promise.all([
			await User.create(user),
			await Movie.create(movie1, movie2),
			await Bookmark.create(bookmark1, bookmark2),
		]);
	});

	/**
	 * @method GET
	 * @access Private
	 * @return 401 if user is not logged in
	 * @return 200 if valid
	 */

	describe("GET /", () => {
		const exec = () => request.get("/api/bookmarks").set("X-Auth-Token", token);

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
	 * @return 200 if movie successfully bookmarked
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
				.post("/api/bookmarks")
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

		it("should return 200 if movie successfully bookmarked", async () => {
			const res = await exec();
			const bookmarkedMovie = await Bookmark.findOne({
				"user._id": userId,
				"movie._id": movieId,
			});
			expect(bookmarkedMovie).not.toBeNull();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/added to bookmarks/i);
		});
	});

	/**
	 * @method DELETE
	 * @route /api/bookmarks/:movieId
	 * @access Private
	 * @return 401 if user is not logged in
	 * @should unset userId in movie's bookmarks
	 * @return 400 if bookmark not found
	 * @return 200 if movie successfully deleted from bookmarks
	 */

	describe("DELETE /:movieId", () => {
		let movieId: string;

		beforeEach(() => {
			movieId = movie2._id!.toHexString();
		});

		const exec = () =>
			request
				.delete(`/api/bookmarks/${movieId}`)
				.set("X-Auth-Token", token)
				.send({ movieId });

		it("should return 401 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should unset userId in movie's bookmarks", async () => {
			await exec();
			const movie = await Movie.findById(movieId);
			const isDeleted = movie?.bookmarks.includes({
				_id: user._id!.toHexString(),
			});
			expect(isDeleted).toBe(false);
		});

		it("should return 200 if movie successfully deleted from bookmarks", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/removed from bookmarks/i);
		});
	});

	/**
	 * @method DELETE
	 * @route /api/bookmarks/userId/clear
	 * @access Private
	 * @return 401 if user is not logged in
	 * @return 400 if user not found
	 * @should unset userId in movie's bookmarks
	 * @return 200 if movie successfully deleted from bookmarks
	 */

	describe("DELETE /userId/clear", () => {
		let userId: string;

		beforeEach(() => (userId = user._id!.toHexString()));

		const exec = () =>
			request
				.delete(`/api/bookmarks/${userId}/clear`)
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

		it("should unset userId in movie's bookmarks", async () => {
			await exec();
			const movies = await Movie.find({ bookmarks: { _id: userId } });
			expect(movies.length).toBe(0);
		});

		// it("should return 400 if bookmark not found", async () => {
		// 	userId = "61dea11b934e3d2eba68782f";
		// 	const res = await exec();
		// 	expect(res.status).toBe(400);
		// 	expect(res.body).toMatch(/no movies was found/i);
		// });

		it("should return 200 if bookmarks is clear", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/removed from bookmarks/i);
		});
	});
});
