import { Server } from "http";
import mongoose from "mongoose";
import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Genre } from "../../../models/genre";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { GenreType } from "../../../types/GenreType";

// const agent = supertest(app);
const user = new User();
let token: string;
let name: string;
let server: Server;
let agent: supertest.SuperTest<supertest.Test>;
let genre: mongoose.Document<unknown, unknown, GenreType> &
  GenreType & { _id: mongoose.Types.ObjectId };

describe("Auth Middleware", () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // await mongoose.connect(process.env.MONGO_URI_TEST!);
    server = app.listen(5000);
    agent = supertest(server);
    token = generateAuthToken(user);
    genre = await Genre.create({ name: "Genre4" });
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    // await mongoose.disconnect();
    server.close();
  });

  describe("Require Auth", () => {
    const exec = () =>
      agent.post("/api/genres").set("X-Auth-Token", token).send({ name });

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
      agent
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        .delete(`/api/genres/${genre._id}`)
        .set("X-Auth-Token", token);

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
