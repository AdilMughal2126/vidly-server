/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { BookmarkInt } from "../../../interfaces/BookmarkInt";
import { MovieInt } from "../../../interfaces/MovieInt";
import { UserInt } from "../../../interfaces/UserInt";
import { Bookmark } from "../../../models/bookmark";
import { Movie } from "../../../models/movie";
import { User } from "../../../models/user";
import { app } from "../../../server";

const request = supertest(app);

describe("Route /api/bookmarks", () => {
	let token: string;
	let movie1: MovieInt;
	let movie2: MovieInt;
	let bookmarks: BookmarkInt;
	let user: Omit<UserInt, "password">;

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
		};
		bookmarks = {
			user: { _id: user._id!.toHexString(), name: user.name! },
			bookmarks: [
				{ movieId: movie2._id!.toHexString() },
				{ movieId: movie1._id!.toHexString() },
			],
		};

		await Promise.all([
			await User.create(user),
			await Movie.insertMany([movie1, movie2]),
			await Bookmark.create(bookmarks),
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
			expect(res.body.bookmarks).toHaveLength(2);
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
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/added to bookmarks/i);
		});
	});

	/**
	 * @method DELETE
	 * @route /api/bookmarks/:movieId
	 * @access Private
	 * @return 401 if user is not logged in
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

		it("should return 200 if movies successfully deleted from bookmarks", async () => {
			const res = await exec();
			const bookmarked = await Bookmark.findOne({ bookmarks: [{ movieId }] });
			expect(bookmarked).toBeNull();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/removed from bookmarks/i);
		});
	});

	/**
	 * @method DELETE
	 * @route /api/bookmarks/userId/clear
	 * @access Private
	 * @return 401 if user is not logged in
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

		it("should return 200 if bookmarks is clear", async () => {
			const res = await exec();
			const bookmarked = await Bookmark.findOne({ "user._id": userId });
			expect(bookmarked).toBeNull();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/removed from bookmarks/i);
		});
	});
});
