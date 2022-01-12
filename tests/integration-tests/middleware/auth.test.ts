import supertest from "supertest";
import mongoose from "mongoose";
import { app } from "../../../server";
import { User } from "../../../models/user";
import { Genre } from "../../../models/genre";
import { GenreType } from "../../../types/GenreType";
import { generateAuthToken } from "../../../helpers/auth";

const request = supertest(app);
const user = new User();

describe("Auth Middleware", () => {
  let token: string;
  let name: string;
  let id: string;
  let genre: mongoose.Document<unknown, unknown, GenreType> & {
    _id: mongoose.Types.ObjectId;
  };

  afterEach(async () => await Genre.deleteMany({}));
  beforeEach(async () => {
    token = generateAuthToken(user);
    genre = await Genre.create({ name: "Genre4" });
    id = genre._id.toHexString();
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

    it("should return 400 if token is invalid", async () => {
      token = "falsy";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/invalid token/i);
    });

    it("should return 200 if token is valid", async () => {
      name = "Genre3";
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Genre3" });
    });
  });

  describe("Require Admin", () => {
    const exec = () =>
      request.delete(`/api/genres/${id}`).set("X-Auth-Token", token);

    it("should return 403 if user is not admin", async () => {
      const res = await exec();
      expect(res.status).toBe(403);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return null if genre is deleted", async () => {
      token = generateAuthToken(new User({ isAdmin: true }));
      const res = await exec();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const genre = await Genre.findById(res.body._id);
      expect(genre).toBeNull();
    });
  });
});
