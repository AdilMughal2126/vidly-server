/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Genre } from "../../../models/genre";
import { Movie } from "../../../models/movie";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { MovieType } from "../../../types/MovieType";
import { GenreType } from "../../../types/GenreType";

const request = supertest(app);

describe(" Route /api/movies", () => {
  afterEach(async () => await Movie.deleteMany({}));

  describe("GET /", () => {
    it("should return all the movies", async () => {
      const movies = [
        {
          title: "Avengers",
          genre: { name: "Action" },
          numberInStock: 2,
          dailyRentalRate: 2.5,
        },
        {
          title: "Fast & Furious",
          genre: { name: "Action" },
          numberInStock: 3,
          dailyRentalRate: 3.5,
        },
      ];

      await Movie.create(movies);
      const res = await request.get("/api/movies");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("title", "Avengers");
      expect(res.body[1]).toHaveProperty("title", "Fast & Furious");
    });
  });

  describe("GET /:id", () => {
    let id: string;
    let movie: MovieType;

    beforeEach(async () => {
      movie = {
        title: "Chaos",
        genre: { name: "Action" },
        numberInStock: 2,
        dailyRentalRate: 2.5,
      };
      const insertedMovie = await Movie.create(movie);
      id = insertedMovie._id;
    });
    const exec = () => request.get(`/api/movies/${id}`);

    it("should return 404 if ID is invalid", async () => {
      id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/invalid id/i);
    });

    it("should return 404 if movie is not found", async () => {
      id = "61dd6dd371aa041cf91f7363";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/not found/i);
    });

    it("should return 200 if movie is found", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(movie);
    });
  });

  describe("POST /", () => {
    let token: string;
    let movie: MovieType;

    beforeEach(async () => {
      const genre = await Genre.create({ name: "NewGenre" });
      movie = {
        title: "Merlin",
        genreId: genre._id,
        numberInStock: 2,
        dailyRentalRate: 2.5,
      };
      const user = new User();
      token = generateAuthToken(user);
    });
    afterEach(async () => await Genre.deleteMany({}));

    const exec = () =>
      request.post("/api/movies").set("X-Auth-Token", token).send(movie);

    it("should return 401 if no jwt was provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 400 if movie is invalid", async () => {
      movie.title = "Av";
      const res = await exec();
      expect(res.status).toBe(400);
      // expect(res.body).toMatch(/length must be at least 5/i);
      // expect(res.body).toMatch(/invalid genre/i);
      // expect(res.body).toMatch(/numberInStock must be greater than 0/i);
      // expect(res.body).toMatch(/dailyRentalRate must be less than 10/i);
    });

    it("should return 404 if genre is not found", async () => {
      movie.genreId = "61dbff8ad38ce60479b35a7f";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/not found/i);
    });

    it("should save movie if is valid", async () => {
      const res = await exec();
      const movie = await Movie.findById(res.body._id);
      expect(movie).not.toBeNull();
    });

    it("should return 200 if movie is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", "Merlin");
      expect(res.body).toHaveProperty("dailyRentalRate", 2.5);
    });
  });

  describe("PUT - DELETE", () => {
    let token: string;
    let movie: MovieType;
    let genre: mongoose.Document<unknown, unknown, GenreType> &
      GenreType & { _id: mongoose.Types.ObjectId };
    let id: string;

    beforeEach(async () => {
      genre = await Genre.create({ name: "NewGenre" });
      movie = {
        title: "Merlin",
        genre: {
          name: genre.name,
        },
        numberInStock: 2,
        dailyRentalRate: 2.5,
      };
      const user = new User();
      token = generateAuthToken(user);
      const newMovie = await Movie.create(movie);
      id = newMovie._id;
    });
    afterEach(async () => await Genre.deleteMany({}));

    describe("PUT /:id", () => {
      const exec = () =>
        request.put(`/api/movies/${id}`).set("X-Auth-Token", token).send(movie);

      it("should return 404 if ID is invalid", async () => {
        id = "1";
        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body).toMatch(/invalid id/i);
      });

      it("should return 401 if no jwt was provided", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
        expect(res.body).toMatch(/access denied/i);
      });

      it("should return 400 if movie is invalid", async () => {
        movie.title = "Av";
        const res = await exec();
        expect(res.status).toBe(400);
        // expect(res.body).toMatch(/length must be at least 5/i);
        // expect(res.body).toMatch(/invalid genre/i);
        // expect(res.body).toMatch(/numberInStock must be greater than 0/i);
        // expect(res.body).toMatch(/dailyRentalRate must be less than 10/i);
      });

      it("should save the updated movie", async () => {
        movie.title = "Game Of Throne";
        (movie.genreId = genre._id.toHexString()), (movie.genre = undefined);
        const res = await exec();
        const updatedMovie = await Movie.findById(res.body._id);
        expect(updatedMovie).not.toBeNull();
      });

      it("should return 200 if movie is updated", async () => {
        movie.title = "Game Of Throne";
        (movie.genreId = genre._id.toHexString()), (movie.genre = undefined);
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("title", "Game Of Throne");
      });
    });

    describe("DELETE /:id", () => {
      const exec = () =>
        request.delete(`/api/movies/${id}`).set("X-Auth-Token", token);

      it("should return 404 if ID is invalid", async () => {
        id = "1";
        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body).toMatch(/invalid id/i);
      });

      it("should return 403 if user is not admin", async () => {
        const res = await exec();
        expect(res.status).toBe(403);
        expect(res.body).toMatch(/access denied/i);
      });

      it("should return 404 if movie is not found", async () => {
        token = generateAuthToken(new User({ isAdmin: true }));
        id = "61dd6dd371aa041cf91f7363";
        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body).toMatch(/not found/i);
      });

      it("should return null if movie is deleted", async () => {
        token = generateAuthToken(new User({ isAdmin: true }));
        const res = await exec();
        const deletedMovie = await Movie.findById(res.body._id);
        expect(deletedMovie).toBeNull();
      });

      it("should return 200 if movie is successfully deleted", async () => {
        token = generateAuthToken(new User({ isAdmin: true }));
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("title", "Merlin");
        expect(res.body).toHaveProperty("numberInStock", 2);
      });
    });
  });
});
