/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Genre } from "../../../models/genre";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { GenreType } from "../../../types/GenreType";

const request = supertest(app);
const user = new User();

describe("/api/genres", () => {
  afterEach(async () => await Genre.deleteMany({}));

  describe("GET /", () => {
    it("should return all the genres", async () => {
      const genres = [{ name: "Genre1" }, { name: "Genre2" }];
      await Genre.collection.insertMany(genres);
      const res = await request.get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("name", "Genre1");
      expect(res.body[1]).toHaveProperty("name", "Genre2");
    });
  });

  describe("GET /:id", () => {
    let id: string;
    let genre: mongoose.Document<unknown, unknown, GenreType> &
      GenreType & { _id: mongoose.Types.ObjectId };

    beforeEach(async () => {
      genre = await Genre.create({ name: "Genre3" });
      id = genre._id.toHexString();
    });

    const exec = () => request.get(`/api/genres/${id}`);

    it("should return 404 if genreId is invalid", async () => {
      id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/invalid id/i);
    });

    it("should return 404 if genreId is not found", async () => {
      id = "61dbff8ad38ce60479b35a7e";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/not found/i);
    });

    it("should return genre if id is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Genre3");
    });
  });

  describe("POST /", () => {
    let token: string;
    let name: string;

    const exec = () =>
      request.post("/api/genres").set("X-Auth-Token", token).send({ name });

    beforeEach(() => {
      token = generateAuthToken(user);
      name = "Genre4";
    });

    it("should return 401 user is not log in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 400 if genre.name is less than 5 characters", async () => {
      name = "Genr";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/must be at least 5/i);
    });

    it("should return 400 if genre.name is greater than 50 characters", async () => {
      name = Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/must be less than or equal to 50/i);
    });

    it("should save genre if it is valid", async () => {
      const res = await exec();
      const genre = await Genre.findById(res.body._id);
      expect(genre).not.toBeNull();
    });

    it("should return genre if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Genre4" });
    });
  });

  describe("PUT /:id", () => {
    let token: string;
    let id: string;
    let name: string;
    let genre: mongoose.Document<unknown, unknown, GenreType> &
      GenreType & { _id: mongoose.Types.ObjectId };

    beforeEach(async () => {
      token = generateAuthToken(user);
      genre = await Genre.create({ name: "Genre5" });
      id = genre._id.toHexString();
    });

    const exec = () =>
      request
        .put(`/api/genres/${id}`)
        .set("X-Auth-Token", token)
        .send({ name });

    it("should return 404 if ID is invalid", async () => {
      id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/invalid id/i);
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 400 if genre.name is less than 5 characters", async () => {
      name = "Genr";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/must be at least 5/i);
    });

    it("should return 400 if genre.name is greater than 50 characters", async () => {
      name = Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/must be less than or equal to 50/i);
    });

    it("should update genre if it is valid", async () => {
      name = "Genre6";
      const res = await exec();
      const updatedGenre = await Genre.findById(res.body._id);
      expect(updatedGenre).not.toBeNull();
    });

    it("should return genre if it is valid", async () => {
      name = "Genre6";
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name });
    });
  });

  describe("DELETE /:id", () => {
    let token: string;
    let id: string;
    let name: string;
    let genre: mongoose.Document<unknown, unknown, GenreType> &
      GenreType & { _id: mongoose.Types.ObjectId };

    beforeEach(async () => {
      token = generateAuthToken(user);
      genre = await Genre.create({ name: "Genre6" });
      id = genre._id.toHexString();
    });

    const exec = () =>
      request
        .delete(`/api/genres/${id}`)
        .set("X-Auth-Token", token)
        .send({ name });

    it("should return 404 if ID is invalid", async () => {
      id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/invalid id/i);
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 403 if user is not admin", async () => {
      const res = await exec();
      expect(res.status).toBe(403);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 404 if genre is not found", async () => {
      token = generateAuthToken(new User({ isAdmin: true }));
      id = "61dbff8ad38ce60479b35a7e";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/not found/i);
    });

    it("should return null if genre is deleted", async () => {
      token = generateAuthToken(new User({ isAdmin: true }));
      const res = await exec();
      const genre = await Genre.findById(res.body._id);
      expect(genre).toBeNull();
    });

    it("should return the genre deleted", async () => {
      token = generateAuthToken(new User({ isAdmin: true }));
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Genre6" });
    });
  });
});
