/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from "supertest";
import mongoose from "mongoose";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { UserType } from "../../../types/UserType";
import { generateAuthToken } from "../../../helpers/auth";

const request = supertest(app);

/**
 * @route /api/users
 *
 * @method GET
 * @access Public
 * Return all users
 *
 * @method GET/:id
 * @access Public
 * Return 404 if ID is invalid
 * Return 404 if customer is not found
 * Return user if ID is valid
 *
 * @method POST
 * @access Public
 * Return 400 if user info is invalid
 * Return 400 if email exist
 * Save user if valid
 * Return user if valid
 *
 * @method PUT
 * @access Private
 * Return 404 if ID is invalid
 * Return 403 if user is not admin
 * Return 400 if user is invalid
 * Return 404 if user is not found
 * Update user if valid
 * Return the updated user if valid
 *
 * @method DELETE
 * @access Private
 * Return 404 if ID is invalid
 * Return 403 if user is not admin
 * Return 404 if user is not found
 * Delete user if valid
 * Return the deleted user if valid
 */

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
      expect(res.body).toHaveLength(2);
      expect(res.body[1]).toHaveProperty("name", "Takanome");
    });
  });

  describe("GET /:id", () => {
    let id: string;
    let user: mongoose.Document<unknown, unknown, UserType> & {
      _id: mongoose.Types.ObjectId | undefined;
    };

    beforeEach(async () => {
      user = await User.create({
        name: "Takanome",
        email: "takanome@gmail.com",
        hash: "takanome",
      });
      id = user._id!.toHexString();
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
      expect(res.body).toHaveProperty("name", "Takanome");
    });
  });

  describe("POST - PUT - DELETE", () => {
    let id: string;
    let newUser: mongoose.Document<unknown, unknown, UserType> & {
      _id: mongoose.Types.ObjectId | undefined;
    };

    beforeEach(async () => {
      newUser = await User.create({
        name: "Takanome",
        email: "takanome@gmail.com",
        hash: "takanome",
        isAdmin: true,
      });
      id = newUser._id!.toHexString();
    });

    describe("POST /", () => {
      let user: UserType;

      beforeEach(() => {
        user = {
          name: "Developer",
          email: "dev@dev.com",
          password: "reactdev",
        };
      });

      const exec = () => request.post("/api/users").send(user);

      it("should return 400 if user info is invalid", async () => {
        user.name = "Dev";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if email exist", async () => {
        user.email = "takanome@gmail.com";
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.body).toMatch(/already registered/i);
      });

      it("should save user if valid", async () => {
        const res = await exec();
        const registeredUser = await User.findById(res.body._id);
        expect(registeredUser).not.toBeNull();
      });

      it("should return user if valid", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Developer");
        expect(res.body).toHaveProperty("email", "dev@dev.com");
      });
    });

    describe("PUT - DELETE", () => {
      let token: string;
      let user: UserType;

      beforeEach(() => {
        token = generateAuthToken(new User(newUser));
      });

      describe("PUT /:id", () => {
        beforeEach(() => {
          user = {
            name: "Developer",
            email: "dev@dev.com",
            password: "reactdev",
          };
        });
        const exec = () =>
          request.put(`/api/users/${id}`).set("X-Auth-Token", token).send(user);

        it("should return 404 if ID is invalid", async () => {
          id = "1";
          const res = await exec();
          expect(res.status).toBe(404);
          expect(res.body).toMatch(/invalid id/i);
        });

        it("should return 403 if user is not admin", async () => {
          token = generateAuthToken(new User());
          const res = await exec();
          expect(res.status).toBe(403);
          expect(res.body).toMatch(/access denied/i);
        });

        it("should return 400 if user is invalid", async () => {
          user.name = "Dev";
          const res = await exec();
          expect(res.status).toBe(400);
          expect(res.body).toMatch(/must be at least 5/i);
        });

        it("should return 404 if user is not found", async () => {
          id = "61dea11b934e3d2eba68782f";
          const res = await exec();
          expect(res.status).toBe(404);
          expect(res.body).toMatch(/not found/i);
        });

        it("should update user if valid", async () => {
          const res = await exec();
          const updatedUser = await User.findById(res.body._id);
          expect(updatedUser).not.toBeNull();
        });

        it("should return the updated user if valid", async () => {
          const res = await exec();
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("name", "Developer");
        });
      });

      describe("DELETE /:id", () => {
        const exec = () =>
          request.delete(`/api/users/${id}`).set("X-Auth-Token", token);

        it("should return 404 if ID is invalid", async () => {
          id = "1";
          const res = await exec();
          expect(res.status).toBe(404);
          expect(res.body).toMatch(/invalid id/i);
        });

        it("should return 403 if user is not admin", async () => {
          token = generateAuthToken(new User());
          const res = await exec();
          expect(res.status).toBe(403);
          expect(res.body).toMatch(/access denied/i);
        });

        it("should return 404 if user is not found", async () => {
          id = "61dea11b934e3d2eba68782f";
          const res = await exec();
          expect(res.status).toBe(404);
          expect(res.body).toMatch(/not found/i);
        });

        it("should delete user if valid", async () => {
          const res = await exec();
          const updatedUser = await User.findById(res.body._id);
          expect(updatedUser).toBeNull();
        });

        it("should return the deleted user if valid", async () => {
          const res = await exec();
          expect(res.status).toBe(200);
          console.log(res.body);
          expect(res.body).toHaveProperty("isAdmin", true);
          expect(res.body).toHaveProperty("hash", "takanome");
        });
      });
    });
  });
});
