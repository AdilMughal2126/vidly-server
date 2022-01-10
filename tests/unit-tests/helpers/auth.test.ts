import mongoose from "mongoose";
import {
  generateAuthToken,
  generateHash,
  validateHash,
  verifyToken,
} from "../../../helpers/auth";
import { User } from "../../../models/user";

describe("Auth Helper", () => {
  describe("JWT verification", () => {
    it("should return a valid token", () => {
      const payload = {
        _id: new mongoose.Types.ObjectId(),
        isAdmin: true,
      };
      const user = new User(payload);
      const token = generateAuthToken(user);
      const decoded = verifyToken(token);
      expect(decoded).toMatchObject(payload);
    });
  });

  describe("Bcrypt Hash", () => {
    it("should return a valid hash", async () => {
      const password = "Hello World!";
      const hash = await generateHash(password);
      const validate = await validateHash(password, hash);
      expect(validate).toBe(true);
    });
  });
});
