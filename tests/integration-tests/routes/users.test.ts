/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from "supertest";
import mongoose from "mongoose";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { UserType } from "../../../types/UserType";

const request = supertest(app);

describe("Route /api/users", () => {
  afterEach(async () => await User.deleteMany({}));

  describe("GET /", () => {
    it("should return all the users", async () => {
      const users = [
        { name: "Takanome", email: "takanome@gmail.com", hash: "takanome" },
        { name: "Mugiwara", email: "mugiwara@gmail.com", hash: "mugiwara" },
      ];

      await User.create(users);
      const res = await request.get("/api/users");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("name", "Mugiwara");
      expect(res.body[1]).toHaveProperty("name", "Takanome");
    });
  });

  describe("GET /:id", () => {
    let id: string;
    let user: mongoose.Document<unknown, unknown, UserType> & {
      _id: mongoose.Types.ObjectId;
    };

    beforeEach(async () => {
      user = await User.create({
        name: "Takanome",
        email: "takanome@gmail.com",
        hash: "takanome",
      });
      id = user._id.toHexString();
    });

    const exec = () => request.get(`/api/users/${id}`);

    it("should return 404 if ID is invalid", async () => {
      id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/invalid id/i);
    });

    it("should return 404 if customer is not found", async () => {
      id = "61dd6dd371aa041cf91f7363";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/not found/i);
    });

    it("should return user if ID is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(user.toJSON());
    });
  });
});
