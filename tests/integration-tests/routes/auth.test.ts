import supertest from "supertest";
import { app } from "../../../server";
import { User } from "../../../models/user";
import { verifyToken } from "../../../helpers/auth";
import { UserType } from "../../../types/UserType";

const request = supertest(app);

/**
 * @route /api/auth
 * @method POST
 * @access Public
 *
 * Return 400 if user is invalid
 * Return 400 if user not found
 * Return 400 if password is invalid
 * Return jwt if user is logged in
 */

describe("ROUTE /api/auth", () => {
  let user: UserType;

  beforeEach(async () => {
    await User.create({
      name: "Takanome",
      email: "takanome@gmail.com",
      hash: "$2a$10$LK8evu7yGG3HjbgdA3UmvukrumFqsrLplh.gWo2YoecAj4ylX2pUm",
    });

    user = {
      email: "takanome@gmail.com",
      password: "takanome",
    };
  });

  afterEach(async () => await User.deleteMany({}));

  const exec = () => request.post("/api/auth").send(user);

  it("should return 400 if user is invalid", async () => {
    user.email = "takanomegmail.com";
    // user.password = "taka";
    const res = await exec();
    expect(res.status).toBe(400);
    expect(res.body).toMatch(/must be a valid email/i);
    // expect(res.body).toMatch(/must be at least 8/i);
  });

  it("should return 400 if user not found", async () => {
    user.email = "takanom@gmail.com";
    const res = await exec();
    expect(res.status).toBe(400);
    expect(res.body).toMatch(/invalid email or password/i);
  });

  it("should return 400 if password is invalid", async () => {
    user.password = "takanomer";
    const res = await exec();
    expect(res.status).toBe(400);
    expect(res.body).toMatch(/invalid email or password/i);
  });

  it("should return jwt if user is logged in", async () => {
    const res = await exec();
    const isValid = verifyToken(res.body as string);
    expect(res.status).toBe(200);
    expect(isValid).toBeTruthy();
  });
});
