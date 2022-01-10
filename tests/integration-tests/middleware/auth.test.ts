import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Genre } from "../../../models/genre";
import { User } from "../../../models/user";
import { app } from "../../../server";

const request = supertest(app);
const user = new User();
let token: string;

const exec = () =>
  request
    .post("/api/genres")
    .set("X-Auth-Token", token)
    .send({ name: "Genre3" });

describe("Auth Middleware", () => {
  beforeEach(() => (token = generateAuthToken(user)));
  afterEach(async () => await Genre.deleteMany({}));

  describe("Require Auth", () => {
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
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Genre3" });
    });
  });

  describe("Require Admin", () => {
    it("should return 403 if user is not admin", async () => {
      const res = await request
        .delete(`/api/genres/61dc32ce56357825beee0d3f`)
        .set("X-Auth-Token", token);
      expect(res.status).toBe(403);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 200 if user is admin", async () => {
      const admin = new User({ isAdmin: true });
      const genre = await Genre.collection.insertOne({ name: "Genre4" });
      const token = generateAuthToken(admin);
      const res = await request
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        .delete(`/api/genres/${genre.insertedId}`)
        .set("X-Auth-Token", token);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Genre4" });
    });
  });
});
